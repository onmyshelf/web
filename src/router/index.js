import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/collection/new",
      component: () => import("../components/admin/CollectionEdit.vue"),
    },
    {
      path: "/collection/:cid",
      component: () => import("../views/Collection.vue"),
      children: [
        {
          path: "",
          component: () => import("../components/Collection.vue"),
        },
        {
          path: "manage",
          component: () => import("../components/admin/Collection.vue"),
        },
        {
          path: "manage/delete",
          component: () => import("../components/admin/CollectionDelete.vue"),
        },
        {
          path: "manage/edit",
          component: () => import("../components/admin/CollectionEdit.vue"),
        },
        {
          path: "manage/property/new",
          component: () => import("../components/admin/PropertyEdit.vue"),
        },
        {
          path: "manage/property/:id",
          component: () => import("../components/admin/PropertyEdit.vue"),
        },
        {
          path: "manage/property/:id/delete",
          component: () => import("../components/admin/PropertyDelete.vue"),
        },
        {
          path: "manage/import",
          component: () => import("../components/admin/Import.vue"),
        },
        {
          path: "import/item",
          component: () => import("../components/admin/ItemImport.vue"),
        },
        {
          path: "item/new",
          component: () => import("../components/admin/ItemEdit.vue"),
        },
        {
          path: "item/:id",
          component: () => import("../components/Item.vue"),
        },
        {
          path: "item/:id/edit",
          component: () => import("../components/admin/ItemEdit.vue"),
        },
        {
          path: "item/:id/delete",
          component: () => import("../components/admin/ItemDelete.vue"),
        },
        {
          path: "item/:iid/loan/new",
          component: () => import("../components/admin/LoanEdit.vue"),
        },
        {
          path: "item/:iid/loan/:id",
          component: () => import("../components/admin/LoanEdit.vue"),
        },
        {
          path: "item/:iid/loan/:id/delete",
          component: () => import("../components/admin/LoanDelete.vue"),
        },
      ],
    },
    {
      path: "/login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/config/",
      component: () => import("../components/admin/configuration/ServerConfig.vue"),
      children: [
        {
          path: "",
          component: () => import("../components/admin/configuration/ServerConfig.vue"),
        },
      ],
    },
    {
      path: "/profile/",
      component: () => import("../views/Profile.vue"),
    },
    {
      path: "/resetpassword",
      component: () => import("../views/ResetPassword.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/About.vue"),
    },
  ],
})

export default router
