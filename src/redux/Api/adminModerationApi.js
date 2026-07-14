import { apiSlice } from "../apiSlice/apiSlice";

const adminModerationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModerationQueue: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.source_name && filters.source_name !== "all")
          params.set("source_name", filters.source_name);
        if (filters.category && filters.category !== "all")
          params.set("category", filters.category);
        if (filters.status && filters.status !== "all")
          params.set("status", filters.status);
        if (filters.ordering)
          params.set("ordering", filters.ordering);
        if (filters.search)
          params.set("search", filters.search);
        if (filters.page)
          params.set("page", filters.page);
        if (filters.page_size)
          params.set("page_size", filters.page_size);
        const qs = params.toString();
        return {
          url: `/moderation-queue/${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["ModerationQueue"],
    }),
    getDatasourcenames: builder.query({
      query: () => ({
        url: `/source/dtasource-names/`,
        method: "GET",
      }),
    }),

    updateModerationStatus: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/moderation-queue/${id}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["ModerationQueue"],
    }),

    getSnapshotToday: builder.query({
      query: () => ({
        url: "/snapshot/today/",
        method: "GET",
      }),
    }),

    getTopSourcesToday: builder.query({
      query: () => ({
        url: "/snapshot/top-sources-today/",
        method: "GET",
      }),
    }),

    getArticleDetail: builder.query({
      query: (id) => ({
        url: `/moderation-queue/${id}/`,
        method: "GET",
      }),
    }),

    recordArticleRead: builder.mutation({
      query: (id) => ({
        url: `/moderation-queue/${id}/record-read/`,
        method: "POST",
      }),
    }),

    reprocessArticle: builder.mutation({
      query: (article_id) => ({
        url: `/ai/articles/${article_id}/reprocess/`,
        method: "POST",
        body: { article_id },
      }),
      invalidatesTags: ["ModerationQueue"],
    }),

    getRelatedArticles: builder.query({
      query: (id) => ({
        url: `/moderation-queue/${id}/related-articles/`,
        method: "GET",
      }),
    }),

  }),
});


export const {
  useGetModerationQueueQuery,
  useGetDatasourcenamesQuery,
  useUpdateModerationStatusMutation,
  useGetSnapshotTodayQuery,
  useGetTopSourcesTodayQuery,
  useLazyGetArticleDetailQuery,
  useRecordArticleReadMutation,
  useLazyGetRelatedArticlesQuery,
  useReprocessArticleMutation,

} = adminModerationApi;
