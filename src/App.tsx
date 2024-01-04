import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { AppRoutes } from "./routes";

const App = () => {
  return (
    <RecoilRoot>
      <AppRoutes />
    </RecoilRoot>
  );
};

export const mountApp = () => {
  const appEl = document.getElementById("app");
  if (!appEl) {
    throw new Error("root element is undefined");
  }
  const root = createRoot(appEl);
  root.render(<App />);
};
