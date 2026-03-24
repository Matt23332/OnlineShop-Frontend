import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Admin from '@/components/Admin.vue'
import Home from '@/components/Home.vue'
import Login from '@/components/Login.vue'
import Signup from '@/components/Signup.vue'
import Orders from '@/components/Orders.vue'
import ProductDetails from '@/components/ProductDetails.vue'
import Products from '@/components/Products.vue'
import Profile from '@/components/Profile.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails },
  { path: '/profile', name: 'Profile', component: Profile },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { path: '/login' }
  }

  if ((to.path === '/login' || to.path === '/signup') && auth.isLoggedIn) {
    return { path: '/' }
  }
})

export default router
