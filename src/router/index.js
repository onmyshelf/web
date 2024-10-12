import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "collections",
      component: () => import("../views/Home.vue"),
      meta: {
        title: "Collections",
      },
    },
    {
      path: "/borrowers",
      component: () => import("../views/Borrowers.vue"),
      meta: {
        title: "Borrowers",
      },
      children: [
        {
          path: "",
          component: () => import("../components/admin/borrowers/BorrowersList.vue"),
          meta: {
            title: "Borrowers",
          },
        },
        {
          path: "new",
          component: () => import("../components/admin/borrowers/BorrowerEdit.vue"),
          meta: {
            title: "New borrower",
          },
        },
        {
          path: ":id",
          component: () => import("../components/admin/borrowers/BorrowerView.vue"),
          meta: {
            title: "Borrower",
          },
        },
        {
          path: ":id/edit",
          component: () => import("../components/admin/borrowers/BorrowerEdit.vue"),
          meta: {
            title: "Edit borrower",
          },
        },
        {
          path: ":id/delete",
          component: () => import("../components/admin/borrowers/BorrowerDelete.vue"),
          meta: {
            title: "Delete borrower",
          },
        },
      ],
    },
    {
      path: "/collection/new",
      component: () => import("../components/admin/CollectionEdit.vue"),
      meta: {
        title: "New collection",
      },
    },
    {
      path: "/collection/:cid",
      component: () => import("../views/Collection.vue"),
      children: [
        {
          path: "",
          component: () => import("../components/Collection.vue"),
          meta: {
            title: "Collection",
          },
        },
        {
          path: "manage",
          component: () => import("../components/admin/Collection.vue"),
          meta: {
            title: "Manage collection",
          },
        },
        {
          path: "manage/delete",
          component: () => import("../components/admin/CollectionDelete.vue"),
          meta: {
            title: "Delete collection",
          },
        },
        {
          path: "manage/edit",
          component: () => import("../components/admin/CollectionEdit.vue"),
          meta: {
            title: "Edit collection",
          },
        },
        {
          path: "manage/property/new",
          component: () => import("../components/admin/PropertyEdit.vue"),
          meta: {
            title: "New property",
          },
        },
        {
          path: "manage/property/:id",
          component: () => import("../components/admin/PropertyEdit.vue"),
          meta: {
            title: "Edit property",
          },
        },
        {
          path: "manage/property/:id/delete",
          component: () => import("../components/admin/PropertyDelete.vue"),
          meta: {
            title: "Delete property",
          },
        },
        {
          path: "manage/import",
          component: () => import("../components/admin/import/ImportCollection.vue"),
          meta: {
            title: "Import collection",
          },
        },
        {
          path: "import/item",
          component: () => import("../components/admin/import/SearchAndImport.vue"),
          meta: {
            title: "Import items",
          },
        },
        {
          path: "item/new",
          component: () => import("../components/admin/ItemEdit.vue"),
          meta: {
            title: "New item",
          },
        },
        {
          path: "item/:id",
          component: () => import("../views/Item.vue"),
          meta: {
            title: "Item",
          },
          children: [
            {
              path: "",
              component: () => import("../components/items/ItemView.vue"),
              meta: {
                title: "Item",
              },
            },
          ],
        },
        {
          path: "item/:id/borrow",
          component: () => import("../components/loans/BorrowRequest.vue"),
          meta: {
            title: "Borrow item",
          },
        },
        {
          path: "item/:id/edit",
          component: () => import("../components/admin/ItemEdit.vue"),
          meta: {
            title: "Edit item",
          },
        },
        {
          path: "item/:id/delete",
          component: () => import("../components/admin/ItemDelete.vue"),
          meta: {
            title: "Delete item",
          },
        },
        {
          path: "item/:id/print",
          component: () => import("../components/items/BarcodePrint.vue"),
          meta: {
            title: "Print item barcode",
          },
        },
        {
          path: "item/:iid/loan/new",
          component: () => import("../components/admin/LoanEdit.vue"),
          meta: {
            title: "New loan",
          },
        },
        {
          path: "item/:iid/loan/:id",
          component: () => import("../components/admin/LoanEdit.vue"),
          meta: {
            title: "Edit loan",
          },
        },
        {
          path: "item/:iid/loan/:id/delete",
          component: () => import("../components/admin/LoanDelete.vue"),
          meta: {
            title: "Delete loan",
          },
        },
      ],
    },
    {
      path: "/login",
      component: () => import("../views/Login.vue"),
      meta: {
        title: "Login",
      },
    },
    {
      path: "/config/",
      component: () => import("../views/Config.vue"),
      meta: {
        title: "Configuration",
      },
      children: [
        {
          path: "",
          component: () => import("../components/admin/configuration/ServerConfig.vue"),
          meta: {
            title: "Server configuration",
          },
        },
        {
          path: "emails",
          component: () => import("../components/admin/configuration/EmailConfig.vue"),
          meta: {
            title: "Emails",
          },
        },
        {
          path: "modules",
          component: () => import("../components/admin/configuration/ModulesConfig.vue"),
          meta: {
            title: "Modules",
          },
        },
        {
          path: "users",
          children: [
            {
              path: "",
              component: () => import("../components/admin/configuration/users/UsersList.vue"),
              meta: {
                title: "Users",
              },
            },
            {
              path: "new",
              component: () => import("../components/admin/configuration/users/UserEdit.vue"),
              meta: {
                title: "New user",
              },
            },
            {
              path: ":id",
              component: () => import("../components/admin/configuration/users/UserEdit.vue"),
              meta: {
                title: "Edit user",
              },
            },
            {
              path: ":id/delete",
              component: () => import("../components/admin/configuration/users/UserDelete.vue"),
              meta: {
                title: "Delete user",
              },
            },
          ],
        },
      ],
    },
    {
      path: "/profile/",
      component: () => import("../views/Profile.vue"),
      meta: {
        title: "My profile",
      },
    },
    {
      path: "/resetpassword",
      component: () => import("../views/ResetPassword.vue"),
      meta: {
        title: "Reset password",
      },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
      meta: {
        title: "About",
      },
    },
  ],
})

export default router

router.beforeEach((to) => {
  const { title } = to.meta
  if (title) {
    document.title = title + " - OnMyShelf"
  } else {
    document.title = "OnMyShelf - Collection Manager"
  }
})
