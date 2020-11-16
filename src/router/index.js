import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Auth from "../views/Auth.vue";
import CartItems from "../views/CartItems.vue";
import Orders from "../views/Orders.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  { path: "/auth", component: Auth },
  { path: "/cart", component: CartItems },
  { path: "/orders", component: Orders },
  { path: "/create-product", component: Home },
  { path: "/edit-product/:id", component: Home },
  { path: "/delete-product/:id", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
