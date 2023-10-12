import ScrollToTop from "./base-components/ScrollToTop";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // Importamos HashRouter
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <Provider store={store}>
      <Router />
    </Provider>
    <ScrollToTop />
  </HashRouter>
);
