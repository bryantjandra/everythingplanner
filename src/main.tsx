import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@douyinfe/semi-ui/lib/es/_base/base.css";
import "./index.css";
import App from "./App.tsx";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_GB from "@douyinfe/semi-ui/lib/es/locale/source/en_GB";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider locale={en_GB}>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
