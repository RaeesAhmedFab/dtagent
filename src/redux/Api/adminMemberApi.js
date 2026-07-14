import { apiSlice } from "../apiSlice/apiSlice"; 
const adminMemberApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMembers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.set("search", params.search);
        if (params.tier && params.tier !== "all") queryParams.set("ym_tier", params.tier.toLowerCase());
        const qs = queryParams.toString();
        return {
          url: `/users/${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    adminuserBlock: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}/block/`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    adminuserUnBlock: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}/unblock/`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});
export const {
  useGetAdminMembersQuery,
  useAdminuserBlockMutation,
  useAdminuserUnBlockMutation
} = adminMemberApi;
