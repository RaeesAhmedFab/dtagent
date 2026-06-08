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
  }),
});
export const {
  usePostAdminLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = adminApi;
