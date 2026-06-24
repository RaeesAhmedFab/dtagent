import { apiSlice } from "../apiSlice/apiSlice";

const SourcesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/sources/
    getSources: builder.query({
      query: () => ({
        url: "/sources/",
        method: "GET",
      }),
    }),
    // PATCH /api/v1/sources/{id}/
    updateSource: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sources/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),


    // POST /api/v1/sources/{id}/run/
    runSource: builder.mutation({
      query: (id) => ({
        url: `/sources/${id}/run/`,
        method: "POST",
      }),
    }),


    // POST /api/v1/sources/run-all/
    runAllSources: builder.mutation({
      query: () => ({
        url: "/sources/run-all/",
        method: "POST",
      }),
    }),


    // DELETE /api/v1/sources/{id}/
    deleteSource: builder.mutation({
      query: (id) => ({
        url: `/sources/${id}/`,
        method: "DELETE",
      }),
    }),

  }),
});


export const {
  // Sources hooks
  useGetSourcesQuery,
  useUpdateSourceMutation,
  useRunSourceMutation,
  useRunAllSourcesMutation,
  useDeleteSourceMutation,

} = SourcesApi;