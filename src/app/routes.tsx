import { createBrowserRouter } from "react-router";
import SiteLayout from "./SiteLayout";
import AboutPage from "../pages/AboutPage";
import DetailPage from "../pages/DetailPage";
import HomePage from "../pages/HomePage";
import ResumePage from "../pages/ResumePage";
import WorkPage from "../pages/WorkPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SiteLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "resume", Component: ResumePage },
      { path: "work", Component: WorkPage },
      { path: "work/:projectId", Component: DetailPage },
      { path: "explorations/:explorationId", Component: DetailPage },
      { path: "*", Component: HomePage },
    ],
  },
]);
