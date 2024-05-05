import express from "express";
import eventRoutes from "./eventRoutes.js";
import authRoutes from "./authRoutes.js";
import leadRoutes from "./leadRoutes.js";
import popupEntityRoutes from "./popupEntityRoutes.js";
import rulesRoutes from "./ruleRoutes.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/events",
    route: eventRoutes,
  },
  {
    path: "/leads",
    route: leadRoutes,
  },
  {
    path: "/popup-entity",
    route: popupEntityRoutes,
  },
  {
    path: "/rules",
    route: rulesRoutes
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
