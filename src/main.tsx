import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import apolloClient from "./ApolloClient.ts";
import store, { persistor } from "./redux/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
            <Toaster position="top-center" richColors />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
