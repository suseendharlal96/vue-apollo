import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";
import CartItems from "../views/CartItems.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  { path: "/auth", component: Auth },
  { path: "/cart", component: CartItems },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
