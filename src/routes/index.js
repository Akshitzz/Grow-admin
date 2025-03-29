import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Forms = lazy(() => import("../pages/Forms"));
const Cards = lazy(() => import("../pages/Cards"));
const Charts = lazy(() => import("../pages/Charts"));
const Buttons = lazy(() => import("../pages/Buttons"));
const Modals = lazy(() => import("../pages/Modals"));
const Tables = lazy(() => import("../pages/Tables"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));

// Add Contests imports
const Contests = lazy(() => import("../pages/Contests"));
const CreateContest = lazy(() => import("../pages/CreateContest"));
const ContestDetails = lazy(() => import("../pages/ContestDetails"));

// Add Leagues imports
const Leagues = lazy(() => import("../pages/Leagues"));
const CreateLeague = lazy(() => import("../pages/CreateLeague"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
    exact: true,
  },
  {
    path: "/forms",
    component: Forms,
    exact: true,
  },
  {
    path: "/cards",
    component: Cards,
    exact: true,
  },
  {
    path: "/charts",
    component: Charts,
    exact: true,
  },
  {
    path: "/buttons",
    component: Buttons,
    exact: true,
  },
  {
    path: "/modals",
    component: Modals,
    exact: true,
  },
  {
    path: "/tables",
    component: Tables,
    exact: true,
  },
  {
    path: "/404",
    component: Page404,
    exact: true,
  },
  {
    path: "/blank",
    component: Blank,
    exact: true,
  },
  {
    path: "/contests",
    component: Contests,
    exact: true,
  },
  {
    path: "/contests/create",
    component: CreateContest,
    exact: true,
  },
  {
    path: "/contests/:id",
    component: ContestDetails,
    exact: true,
  },
  {
    path: "/leagues",
    component: Leagues,
    exact: true,
  },
  {
    path: "/leagues/create",
    component: CreateLeague,
    exact: true,
  },
];

export default routes;
