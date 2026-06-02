import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/homePage.vue"),
    },
    {
      path: "/RED",
      name: "RED",
      component: () => import("@/views/RED.vue"),
    },
    {
      path: "/live",
      name: "live",
      component: () => import("@/views/live.vue"),
    },
  ],
});

export default router;
