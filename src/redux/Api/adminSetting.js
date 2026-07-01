import { apiSlice } from "../apiSlice/apiSlice";

const adminSettingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSystemSetting: builder.query({
      query: () => ({
        url: "/system-settings/",
        method: "GET",
      }),
    }),
    updateSystemSetting: builder.mutation({
      query: ({ id, data }) => ({
        url: `/system-settings/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

  }),
});


export const {
  
  useGetSystemSettingQuery,
  useUpdateSystemSettingMutation,

} = adminSettingApi;