import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/collection/new',
    component: () => import('../components/admin/CollectionEdit.vue'),
  },
  {
    path: '/collection/:cid',
    component: () => import('../views/Collection.vue'),
    children: [
      {
        path: '',
        component: () => import('../components/Collection.vue'),
      },
      {
        path: 'manage',
        component: () => import('../components/admin/Collection.vue'),
      },
      {
        path: 'manage/delete',
        component: () => import('../components/admin/CollectionDelete.vue'),
      },
      {
        path: 'manage/edit',
        component: () => import('../components/admin/CollectionEdit.vue'),
      },
      {
        path: 'manage/field/new',
        component: () => import('../components/admin/FieldEdit.vue'),
      },
      {
        path: 'manage/field/:id',
        component: () => import('../components/admin/FieldEdit.vue'),
      },
      {
        path: 'manage/field/:id/delete',
        component: () => import('../components/admin/FieldDelete.vue'),
      },
      {
        path: 'manage/import',
        component: () => import('../components/admin/Import.vue'),
      },
      {
        path: 'item/new',
        component: () => import('../components/admin/ItemEdit.vue'),
      },
      {
        path: 'item/:id',
        component: () => import('../components/Item.vue'),
      },
      {
        path: 'item/:id/edit',
        component: () => import('../components/admin/ItemEdit.vue'),
      },
      {
        path: 'item/:id/delete',
        component: () => import('../components/admin/ItemDelete.vue'),
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/profile/',
    component: () => import('../components/user/Profile.vue')
  },
  {
    path: '/resetpassword',
    component: () => import('../views/ResetPassword.vue'),
  },
  {
    path: '/about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
