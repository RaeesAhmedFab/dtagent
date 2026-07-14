import { apiSlice } from "../apiSlice/apiSlice";

const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsCards: builder.query({
      query: () => ({
        url: "/analytics/cards/",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
    getDauTrend: builder.query({
      query: (days = 7) => ({
        url: `/analytics/dau-trend/?days=${days}`,
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
    getSourceEngagement: builder.query({
      query: () => ({
        url: "/analytics/source-engagement/",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
    getAgentTopics: builder.query({
      query: () => ({
        url: "/analytics/agent-topics/",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetAnalyticsCardsQuery,
  useGetDauTrendQuery,
  useGetSourceEngagementQuery,
  useGetAgentTopicsQuery,
} = analyticsApi;