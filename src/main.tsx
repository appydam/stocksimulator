
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = "pk_test_bGFyZ2UtYW50ZWF0ZXItODEuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/market"
      signUpFallbackRedirectUrl="/market"
      afterSignOutUrl="/">
      <Provider store={store}>
        <App />
      </Provider>
    </ClerkProvider>
  </React.StrictMode>,
);
