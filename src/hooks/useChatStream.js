import { useState, useRef, useCallback } from "react"

/**
 * Custom hook for streaming chat responses via Server-Sent Events (SSE).
 *
 * @param {string} url - The API endpoint URL.
 * @param {object} options
 * @param {() => object} [options.getHeaders] - Optional function that returns headers (e.g. auth token).
 * @returns {{ sendMessage: Function, isStreaming: boolean }}
 */
export function useChatStream(url, { getHeaders } = {}) {
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef(null)

  const sendMessage = useCallback(
    async (text, callbacks = {}, extraBody = {}) => {
      const { onChunk, onDone, onError } = callbacks
      if (isStreaming) return

      const controller = new AbortController()
      abortRef.current = controller
      setIsStreaming(true)

      try {
        const headers = {
          "Content-Type": "application/json",
          ...(getHeaders ? getHeaders() : {}),
        }

        const body = {
          question: text,
          ...extraBody,
        }

        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        })

        if (!response.ok) {
          let errorData = null
          try {
            errorData = await response.json()
          } catch {
            // ignore parse errors
          }
          throw {
            status: response.status,
            data: errorData,
            message: errorData?.message || `HTTP ${response.status}`,
          }
        }

        let receivedSessionId = null
        let receivedSources = null
        // Tracks whether any incremental content has already been emitted. The
        // final SSE event often repeats the whole reply in an `answer` field;
        // without this guard it would be appended on top of the streamed text,
        // making every response render twice.
        let streamedAny = false

        // Proper SSE parsing. Each event looks like:
        //   event: chunk
        //   data: {"delta": "..."}
        //
        // Builds a full SSE event (with optional `event:` field) from the
        // buffered stream before dispatching it.
        const dispatchEvent = (eventName, dataValue) => {
          if (!dataValue) return

          let parsed
          try {
            parsed = JSON.parse(dataValue)
          } catch {
            // Not JSON: treat the raw data as plain text content
            onChunk?.(dataValue)
            return
          }
          if (!parsed) return

          if (parsed.session_id) {
            receivedSessionId = parsed.session_id
          }

          // Streaming chunk: append the incremental `delta`
          if (parsed.delta !== undefined && parsed.delta !== null) {
            onChunk?.(String(parsed.delta))
            streamedAny = true
            return
          }

          // Other known text fields
          if (parsed.response !== undefined) {
            onChunk?.(String(parsed.response))
            streamedAny = true
            return
          }
          if (parsed.content !== undefined) {
            onChunk?.(String(parsed.content))
            streamedAny = true
            return
          }
          if (parsed.message !== undefined) {
            onChunk?.(String(parsed.message))
            streamedAny = true
            return
          }

          // Final `done` event may carry the full answer + sources. Only emit
          // the answer when nothing was streamed (non-streaming backends);
          // otherwise it would duplicate the already-streamed reply.
          if (parsed.answer !== undefined && !streamedAny) {
            onChunk?.(String(parsed.answer))
            streamedAny = true
          }
          if (parsed.sources !== undefined) {
            receivedSources = parsed.sources
          }
        }

        // Read the stream
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        let pendingEvent = null

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split("\n")
          // Keep the last partial line in the buffer
          buffer = lines.pop() || ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) {
              // Blank line: signals end of an SSE event
              if (pendingEvent) {
                dispatchEvent(pendingEvent.event, pendingEvent.data)
                pendingEvent = null
              }
              continue
            }

            if (trimmed.startsWith("event:")) {
              pendingEvent = pendingEvent || { event: "", data: "" }
              pendingEvent.event = trimmed.slice(6).trim()
            } else if (trimmed.startsWith("data:")) {
              pendingEvent = pendingEvent || { event: "", data: "" }
              pendingEvent.data = (pendingEvent.data + trimmed.slice(5).trim())
                .trim()
            } else {
              // Non-SSE line (e.g. plain text stream)
              dispatchEvent(null, trimmed)
            }
          }
        }

        // Flush any trailing event
        if (pendingEvent && pendingEvent.data) {
          dispatchEvent(pendingEvent.event, pendingEvent.data)
        }

        // Signal completion with the session_id (and sources) if found
        onDone?.(receivedSessionId, receivedSources)
      } catch (err) {
        if (err.name === "AbortError") return
        onError?.(err)
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [url, getHeaders, isStreaming],
  )

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }, [])

  return { sendMessage, isStreaming, abort }
}