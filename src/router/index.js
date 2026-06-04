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
    {
      path: "/diandian",
      name: "diandian",
      component: () => import("@/views/diandian.vue"),
    },
    {
      path: "/diandian/chat/:id",
      name: "chat",
      component: () => import("@/views/chatPage.vue"),
    },
    {
      path: "/message",
      name: "message",
      component: () => import("@/views/message.vue"),
    },
  ],
});

export default router;
