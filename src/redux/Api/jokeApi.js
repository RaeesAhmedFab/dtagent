import { apiSlice } from "../apiSlice/apiSlice";

const jokeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJokeOfTheDay: builder.query({
      query: () => ({
        url: "/joke-of-the-day/",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetJokeOfTheDayQuery } = jokeApi;