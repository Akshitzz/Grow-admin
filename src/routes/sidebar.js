/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard",
    icon: "HomeIcon",
    name: "Dashboard",
  },
  {
    path: "/app/users",
    icon: "PeopleIcon",
    name: "Users",
  },
  {
    path: "/app/leagues", // the url
    icon: "FormsIcon", // the component being exported from icons/index.js
    name: "Leagues", // name that appear in Sidebar
  },
  {
    path: "/app/contests",
    icon: "MoneyIcon", // Using MoneyIcon for contests
    name: "Contests",
  },
  {
    path: "/app/teams",
    icon: "PeopleIcon",
    name: "Recent Teams",
  },
  {
    path: "/app/leaderboard",
    icon: "MoneyIcon",
    name: "Leaderboard",
  },
  {
    path: "/app/privacy-policy",
    icon: "PeopleIcon",
    name: "Privacy Policy",
  },
  {
    path: "/app/refund-policy",
    icon: "PeopleIcon",
    name: "Refund Policy",
  },
  {
    path: "/app/terms-conditions",
    icon: "PeopleIcon",
    name: "Terms & Conditions",
  },
  // {
  //   path: "/app/forms",
  //   icon: "FormsIcon",
  //   name: "Forms",
  // },
  // {
  //   path: "/app/cards",
  //   icon: "CardsIcon",
  //   name: "Cards",
  // },
  // {
  //   path: "/app/charts",
  //   icon: "ChartsIcon",
  //   name: "Charts",
  // },
  // {
  //   path: "/app/buttons",
  //   icon: "ButtonsIcon",
  //   name: "Buttons",
  // },
  // {
  //   path: "/app/modals",
  //   icon: "ModalsIcon",
  //   name: "Modals",
  // },
  // {
  //   path: "/app/tables",
  //   icon: "TablesIcon",
  //   name: "Tables",
  // },
  // {
  //   icon: "PagesIcon",
  //   name: "Pages",
  //   routes: [
  //     // submenu
  //     {
  //       path: "/login",
  //       name: "Login",
  //     },
  //     {
  //       path: "/create-account",
  //       name: "Create account",
  //     },
  //     {
  //       path: "/forgot-password",
  //       name: "Forgot password",
  //     },
  //     {
  //       path: "/app/404",
  //       name: "404",
  //     },
  //     {
  //       path: "/app/blank",
  //       name: "Blank",
  //     },
  //   ],
  // },
];

export default routes;
