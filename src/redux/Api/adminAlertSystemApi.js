import { apiSlice } from "../apiSlice/apiSlice";

const adminAlertSystemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSystemAlerts: builder.query({
      query: () => ({
        url: "/system-alerts/",
        method: "GET",
      }),
      providesTags: ["SystemAlerts"],
    }),
    getSystemAlertById: builder.query({
      query: (id) => ({
        url: `/system-alerts/${id}/`,
        method: "GET",
      }),
      providesTags: ["SystemAlerts"],
    }),
    createSystemAlerts: builder.mutation({
      query: (data) => ({
        url: "/system-alerts/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SystemAlerts"],
    }),
    updateSystemAlerts: builder.mutation({
      query: ({ id, data }) => ({
        url: `/system-alerts/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["SystemAlerts"],
    }),
    patchSystemAlerts: builder.mutation({
      query: ({ id, data }) => ({
        url: `/system-alerts/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SystemAlerts"],
    }),
    deleteSystemAlerts: builder.mutation({
      query: (id) => ({
        url: `/system-alerts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SystemAlerts"],
    }),
  }),
});

export const {
  useGetSystemAlertsQuery,
  useGetSystemAlertByIdQuery,
  useCreateSystemAlertsMutation,
  useUpdateSystemAlertsMutation,
  usePatchSystemAlertsMutation,
  useDeleteSystemAlertsMutation,
} = adminAlertSystemApi;