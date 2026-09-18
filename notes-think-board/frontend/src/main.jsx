import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationProvider.jsx";
import { NotesProvider } from "./context/NotesProvider.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotesProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </NotesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)