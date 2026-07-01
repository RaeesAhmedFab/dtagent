import { apiSlice } from "../apiSlice/apiSlice";

const auditLogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: ({ action, actor } = {}) => {
        const params = new URLSearchParams();
        if (action && action !== "all") params.append("action", action);
        if (actor && actor !== "all") params.append("actor", actor);
        const qs = params.toString();
        return {
          url: `/audit-logs/${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
    }),
    getAuditLogsExports: builder.query({
      query: ({ action, actor } = {}) => {
        const params = new URLSearchParams();
        if (action && action !== "all") params.append("action", action);
        if (actor && actor !== "all") params.append("actor", actor);
        const qs = params.toString();
        return {
          url: `/audit-logs/export/${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
    }),
    getAuditLogsStats: builder.query({
      query: () => ({
        url: "/audit-logs/stats/",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAuditLogsQuery, useGetAuditLogsExportsQuery, useGetAuditLogsStatsQuery, useLazyGetAuditLogsExportsQuery } =
  auditLogsApi;
