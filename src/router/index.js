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
        path: 'item/new',
        component: () => import('../components/admin/Item.vue'),
      },
      {
        path: 'item/:id',
        component: () => import('../components/Item.vue'),
      },
      {
        path: 'item/:id/edit',
        component: () => import('../components/admin/Item.vue'),
      },
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
