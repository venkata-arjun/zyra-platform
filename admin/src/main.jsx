import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster
      position="top-center"
      containerStyle={{
        top: 20,
      }}
      toastOptions={{
        style: {
          fontSize: "14px",
        },
      }}
    />
    <App />
  </BrowserRouter>,
);
