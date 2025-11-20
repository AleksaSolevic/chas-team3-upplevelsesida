import { createRouter, createWebHistory } from "vue-router";
import About from "../pages/About.vue";
import Booking from "../pages/Booking.vue";
import Cart from "../pages/Cart.vue";
import Deals from "../pages/Deals.vue";
import Experiences from "../pages/Experiences.vue";
import Home from "../components/Home.vue";

const routes = [
  {
    path: "/",
    component: Home,
    name: "Home",
  },
  {
    path: "/About",
    component: About,
    name: "about",
  },
  {
    path: "/Booking/:id",
    component: Booking,
  },
  {
    path: "/Cart",
    component: Cart,
    name: "Cart",
  },
  {
    path: "/Deals",
    component: Deals,
    name: "deals",
  },
  {
    path: "/Experiences/:id",
    component: Experiences,
  },
];

const router = createRouter({ history: createWebHistory(), routes });

export default router;
