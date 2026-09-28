<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore()
const profileNavigation = computed(() =>
  userStore.isAuthorize
    ? userStore.role === 'admin'
      ? { name: 'admin' }
      : { name: 'profile' }
    : { name: 'auth' },
)
</script>

<template>
  <header class="sticky-top">
    <div class="container py-3 py-lg-4">
      <nav class="navbar navbar-expand-lg rounded-pill px-3 px-xl-4 shadow-around">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle4"></div>
        <div class="circle3"></div>
        <div class="container-fluid">
          <!-- Логотип -->
          <router-link
            :to="userStore.role === 'admin' ? { name: 'admin' } : { name: 'main' }"
            class="navbar-brand"
            href="/"
          >
            <img
              src="/src/assets/img/header/logo.svg"
              alt="Логотип"
              class="img-fluid"
              style="max-width: 250px; width: 100%; height: auto; margin-left: 20px"
            />
          </router-link>
          <!-- Кнопка бургер-меню -->
          <button
            class="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Переключатель навигации"
          >
            <div class="col bg-white rounded" style="border: 1px solid">
              <span class="navbar-toggler-icon"></span>
            </div>
          </button>
          <!-- Навигационное меню -->
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto gap-lg-2">
              <template v-if="userStore.role !== 'admin'">
                <router-link :to="{ name: 'rent' }" class="nav-link active" aria-current="page"
                  >Аренда полки</router-link
                >
                <router-link :to="{ name: 'catalog' }" class="nav-link active">Каталог</router-link>
                <router-link :to="{ name: 'deliver' }" class="nav-link active me-5"
                  >О доставке</router-link
                >
              </template>
            </div>
            <!-- Иконки пользователя -->
            <div
              class="d-flex justify-content-center justify-content-lg-end gap-3 mt-3 mt-lg-0 pt-3 pt-lg-0"
            >
              <template v-if="userStore.isAuthorize && userStore.role === 'user'">
                <router-link :to="{ name: 'favourite' }" class="nav-link active p-1">
                  <img
                    src="/src/assets/img/header/mynaui--heart.svg"
                    alt="Избранное"
                    width="28"
                    height="28"
                    class="img-fluid"
                  />
                </router-link>
                <router-link :to="{ name: 'cart' }" class="nav-link active p-1">
                  <img
                    src="/src/assets/img/header/mynaui--cart.svg"
                    alt="Корзина"
                    width="28"
                    height="28"
                    class="img-fluid"
                  />
                </router-link>
              </template>

              <button
                v-if="userStore.isAuthorize && userStore.role === 'admin'"
                @click="userStore.loggout()"
                class="btn btn-danger"
              >
                Выйти из аккаунта
              </button>

              <router-link :to="profileNavigation" class="nav-link active p-1">
                <img
                  src="/src/assets/img/header/mynaui--user-circle.svg"
                  alt="Профиль"
                  width="28"
                  height="28"
                  class="img-fluid"
                />
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped></style>
