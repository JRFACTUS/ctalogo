import { createRouter, createWebHistory } from "vue-router"
import { auth } from "../services/firebase" // Asegúrate de que la ruta a tu firebase sea correcta

import Home from "../views/Home.vue"
import Admin from "../views/Admin.vue"
import Login from "../views/auth/Login.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: { requiresAuth: true } // 🔒 Marcamos esta ruta como protegida
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🛡️ GUARDIA DE NAVEGACIÓN GLOBAL
router.beforeEach((to, from, next) => {
  // Verificamos si la ruta requiere autenticación revisando su meta
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Obtenemos el usuario actual de Firebase (comprueba si hay sesión activa)
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    // Si la ruta requiere auth y NO hay usuario, redirige al login
    next("/auth/login")
  } else {
    // De lo contrario, permite el paso normal
    next()
  }
})

export default router