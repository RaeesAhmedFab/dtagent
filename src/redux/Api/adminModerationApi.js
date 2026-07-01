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

  }),
});


export const {
  
  useGetModerationQueueQuery,
  useGetDatasourcenamesQuery,
  useUpdateModerationStatusMutation,

} = adminModerationApi;