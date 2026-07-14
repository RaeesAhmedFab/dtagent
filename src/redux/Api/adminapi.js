import { apiSlice } from "../apiSlice/apiSlice"; 
const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postAdminLogin: builder.mutation({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: { password },
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, password }) => ({
        url: "/auth/update-password",
        method: "POST",
        body: { oldPassword, password },
      }),
    }),
    loginwithmembership: builder.query({
      query: () => ({
        url: `/auth/ym/authorize/`,
        method: "GET",
      }),
    }),
    ymCallback: builder.query({
      query: (code) => ({
        url: `/auth/ym/call-back/?code=${code}`,
        method: "GET",
      }),
    }),
    getMe:builder.query({
      query: ()=>({
        url:"/auth/me",
        method:"GET"
      })
    }),
    getNotificationPreferences: builder.query({
      query: () => ({
        url: "/notifications/me/",
        method: "GET",
      }),
      providesTags: ["NotificationPreferences"],
    }),
    updateNotificationPreferences: builder.mutation({
      query: (body) => ({
        url: "/notifications/me/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NotificationPreferences"],
    }),
  }),
});
export const {
  usePostAdminLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useLoginwithmembershipQuery,
  useLazyLoginwithmembershipQuery,
  useLazyYmCallbackQuery,
  useGetMeQuery,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = adminApi;
