import { createRouter, createWebHistory } from "vue-router";
import About from "../components/About.vue";
import Booking from "../components/Booking.vue";
import Cart from "../components/Cart.vue";
import Deals from "../components/Deals.vue";
import Experiences from "../components/Experiences.vue";
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
