import MainPage from '@/pages/MainPage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import AuthPage from '@/pages/AuthPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import DeliverPage from '@/pages/DeliverPage.vue'
import RentPage from '@/pages/RentPage.vue'
import FavorPage from '@/pages/FavorPage.vue'
import CartPage from '@/pages/CartPage.vue'
import AdminPage from '@/pages/admin/AdminPage.vue'
import AdminCatalogPage from '@/pages/admin/AdminCatalogPage.vue'
import AdminCategoryPage from '@/pages/admin/AdminCategoryPage.vue'
import AdminOrderPage from '@/pages/admin/AdminOrderPage.vue'
import AdminRequestPage from '@/pages/admin/AdminRequestPage.vue'
import AdminRentPage from '@/pages/admin/AdminRentPage.vue'

import { createRouter, createWebHistory } from 'vue-router'
import { authorizeMiddleware } from '@/core/authorize'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Main
    { path: '/', name: 'main', component: MainPage },
    // Catalog
    { path: '/catalog', name: 'catalog', component: CatalogPage },
    // Profile
    { path: '/profile', name: 'profile', component: ProfilePage },
    // Deliver
    { path: '/deliver', name: 'deliver', component: DeliverPage },
    // Rent
    { path: '/rent', name: 'rent', component: RentPage },
    // Favourite
    { path: '/favourite', name: 'favourite', component: FavorPage },
    // Cart
    { path: '/cart', name: 'cart', component: CartPage },
    // Auth/Reg
    { path: '/authorize', name: 'auth', component: AuthPage },
    // Admin
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
    { path: '/admin/catalog', name: 'admin-catalog', component: AdminCatalogPage },
    { path: '/admin/categories', name: 'admin-category', component: AdminCategoryPage },
    { path: '/admin/orders', name: 'admin-order', component: AdminOrderPage },
    { path: '/admin/requests', name: 'admin-request', component: AdminRequestPage },
    { path: '/admin/rent', name: 'admin-rent', component: AdminRentPage },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Если есть сохранённая позиция (например, при нажатии "назад") — возвращаем её
    if (savedPosition) {
      return savedPosition
    }
    // В остальных случаях прокручиваем страницу вверх
    return { top: 0 }
  },
})

router.beforeEach(authorizeMiddleware)

export default router
