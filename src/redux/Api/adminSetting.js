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

    getAPiCredentials: builder.query({
      query: () => ({
        url: "/api-creds/",
        method: "GET",
      }),
    }),
    updateAPiCredentials: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api-creds/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),

    createAPiCredentials: builder.mutation({
      query: (data) => ({
        url: "/api-creds/",
        method: "POST",
        body: data,
      }),
    }),

    dangerZonetoday: builder.mutation({
      query: (data) => ({
        url: "/danger-zone/flush-today-article-cache/",
        method: "POST",
        body: data,
      }),
    }),

    dangerZonereset: builder.mutation({
      query: (data) => ({
        url: "/danger-zone/reset-active-sessions/",
        method: "POST",
        body: data,
      }),
    }),

    dangerZonepurge: builder.mutation({
      query: (data) => ({
        url: "/danger-zone/purge-removed-articles/",
        method: "POST",
        body: data,
      }),
    }),


  }),
});


export const {
  
  useGetSystemSettingQuery,
  useUpdateSystemSettingMutation,
  useGetAPiCredentialsQuery,
  useUpdateAPiCredentialsMutation,
  useCreateAPiCredentialsMutation,
  useDangerZonetodayMutation,
  useDangerZoneresetMutation,
  useDangerZonepurgeMutation
  
} = adminSettingApi;