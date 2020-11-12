import {
  createHttpLink,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client/core";

const httpLink = createHttpLink({
  uri: "https://shop-graphql.herokuapp.com/",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
