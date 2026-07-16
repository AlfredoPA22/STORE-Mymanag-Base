import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from "@apollo/client";
import store from "./redux/store";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = store.getState().authSlice.token;

  if (token) {
    operation.setContext({
      headers: {
        Authorization: token,
      },
    });
  }

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
