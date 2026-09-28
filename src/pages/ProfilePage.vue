<script lang="ts" setup>
import { useF } from '@/core/api'
import { useUserStore } from '@/stores/user'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { vMaska } from 'maska/vue'
import { dateFormat } from '@/core/utils'
import type { Order } from '@/types/models'

const id = document.cookie
  .split(';')
  .find((f) => f.includes('id'))
  ?.split('=')[1]
const { data, refresh } = useF(`/u/id?id=${id}`)
const { data: rents } = useF(`/rent/user?uid=${id}`)
const { data: orders } = useF(`/order/user?uid=${id}`)

const userStore = useUserStore()

const editProfile = ref()
watch(data, (newVal) => {
  editProfile.value = { ...newVal[0] }
})

const ordersData = computed(() =>
  orders.value.map((p: { products_in: string }) => {
    p.products_in = JSON.parse(p.products_in)
    return p
  }),
)

const statusMap: Record<Order['order_status'], string> = {
  assembled: 'Собрано',
  assembly: 'В сборке',
  delivered: 'Доставлено',
  rejected: 'Отменено',
  transit: 'В доставке',
}

const paymentMap: Record<Order['order_payment'], string> = {
  card: '💳 Картой',
  cash: '💵 При получении',
}

onMounted(() => {
  document.body.style.backgroundSize = 'cover'
  document.title = 'Арт-уголок | Профиль'
})
onBeforeUnmount(() => {
  document.body.style.backgroundSize = ''
})
</script>

<template>
  <main>
    <div class="wrapper">
      <h1>Личный кабинет</h1>

      <!-- ВЕРХНЯЯ ЧАСТЬ -->
      <div class="top-section">
        <!-- 1. ПРОФИЛЬ (Старый дизайн) -->
        <div class="profile-card" v-if="data">
          <div class="grid-2">
            <div>
              <span class="label">Имя</span>
              <div class="value" id="view-name">{{ data[0].user_name }}</div>
            </div>
            <div>
              <span class="label">Фамилия</span>
              <div class="value" id="view-surname">{{ data[0].user_surname }}</div>
            </div>

            <div class="full">
              <span class="label">Дата рождения</span>
              <div class="value" id="view-dob">{{ dateFormat(data[0].user_birthday) }}</div>
            </div>

            <div>
              <span class="label">Почта</span>
              <div class="value" id="view-email">{{ data[0].user_email }}</div>
            </div>
            <div>
              <span class="label">Телефон</span>
              <div class="value" id="view-phone">{{ data[0].user_phone }}</div>
            </div>
          </div>

          <div class="btn-wrap">
            <button class="btn-edit" data-bs-toggle="modal" data-bs-target="#editProfileModal">
              Редактировать данные
            </button>
            <button class="btn-danger" @click="userStore.loggout()">Выйти из аккаунта</button>
          </div>
        </div>

        <!-- 2. АРЕНДА ПОЛОК -->
        <aside class="shelves-sidebar">
          <div class="shelves-header">
            <h3 class="shelves-title">Мои полки</h3>
          </div>
          <div v-if="rents && rents.length < 1" class="p-2">
            <p class="p-2">
              Для аренды полки необходимо
              <router-link :to="{ name: 'rent' }">отправить заявку</router-link>
              и дождаться ответа менеджера
            </p>
          </div>
          <div class="shelves-list" v-else>
            <div class="shelf-item" v-for="(rent, index) in rents" :key="index">
              <span
                class="shelf-status"
                :class="rent.rent_status === 'active' ? 'st-active' : 'st-soon'"
              >
                {{ rent.rent_status === 'active' ? 'Активна' : 'Закончена' }}
              </span>
              <div class="shelf-number">Полка {{ `${rent.fk_stillage}-${rent.fk_shelf}` }}</div>
              <div class="shelf-date">Действует до: {{ dateFormat(rent.rent_expired) }}</div>
            </div>
          </div>
        </aside>
      </div>

      <!-- НИЖНЯЯ ЧАСТЬ: ЗАКАЗЫ -->
      <div class="orders-block" v-if="orders">
        <h2 class="section-title">История заказов</h2>
        <p v-if="orders.length < 1">Вы ещё не сделали ни одного заказа :(</p>
        <!-- Заказ 1 -->
        <div class="order-row" v-for="(order, idx) in ordersData" :key="idx">
          <div class="or-meta">
            <span class="or-id">Заказ {{ order.order_id }}</span>
            <span class="or-date">{{ dateFormat(order.order_date) }}</span>
            <span class="badge b-wait">{{
              statusMap[order.order_status as Order['order_status']]
            }}</span>
          </div>
          <div class="or-items">
            <div v-for="(prod, idxx) in order['products_in']" :key="idxx">
              {{ prod.product_name }}<span class="item-price">{{ prod.price }} ₽</span>
            </div>
          </div>
          <div class="or-total-box">
            <span class="or-total">{{ order.order_summary }} ₽</span>
            <span class="or-pay">{{
              paymentMap[order.order_payment as Order['order_payment']]
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО (Старый стиль - все поля сразу) -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" style="font-family: 'Caveat'; font-size: 1.8rem">
              Редактировать профиль
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="editProfile != undefined">
            <form id="profileForm" @submit.prevent>
              <div class="mb-3">
                <label class="form-label">Имя</label>
                <input
                  name="name"
                  type="text"
                  class="form-control"
                  id="input-name"
                  v-model="editProfile.user_name"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Фамилия</label>
                <input
                  name="surname"
                  type="text"
                  class="form-control"
                  id="input-surname"
                  v-model="editProfile.user_surname"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  class="form-control"
                  id="input-email"
                  v-model="editProfile.user_email"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Телефон</label>
                <input
                  name="phone"
                  type="tel"
                  class="form-control"
                  id="input-phone"
                  placeholder="+7 (___) ___-__-__"
                  v-model="editProfile.user_phone"
                  v-maska="'+7 (###) ###-##-##'"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Дата рождения</label>
                <input
                  name="birthday"
                  type="date"
                  v-model="editProfile.user_birthday"
                  class="form-control"
                  id="input-dob"
                />
              </div>
              <!-- Пароля нет -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light rounded-pill" data-bs-dismiss="modal">
              Отмена
            </button>
            <button
              type="submit"
              name="update"
              class="btn btn-save rounded-pill"
              data-bs-dismiss="modal"
              @click="userStore.updateProfile(editProfile, refresh)"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.wrapper {
  max-width: 1140px;
  margin: 0 auto;
  padding: 20px 15px 60px;
}

h1 {
  font-family: 'Caveat';
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 30px;
}

/* --- ВЕРХНЯЯ ЧАСТЬ (СЕТКА) --- */
.top-section {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
  margin-bottom: 50px;
}

/* 1. ЛЕВЫЙ БЛОК: ПРОФИЛЬ (Старый стиль) */
.profile-card {
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  border: 2px solid #f5cbff;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.full {
  grid-column: 1 / -1;
}

.label {
  display: block;
  font-size: 14px;
  color: #a0aec0;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 600;
}

.value {
  font-size: 1.2rem;
  font-weight: 500;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.btn-wrap {
  margin-top: 40px;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-edit {
  font-family: 'Caveat';
  font-size: 24px;
  padding: 12px 40px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  background: #6ecaa5;
  color: #fff;
  box-shadow: 0 4px 15px rgba(110, 202, 165, 0.4);
  transition: 0.3s;
}

.btn-edit:hover {
  background: #52a585;
  transform: translateY(-2px);
}

.btn-danger {
  font-family: 'Caveat';
  font-size: 24px;
  padding: 12px 40px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  background: #db7b56;
  color: #fff;
  box-shadow: 0 4px 15px rgba(107, 42, 8, 0.4);
  transition: 0.3s;
}

.btn-danger:hover {
  background: #6a2c1a;
  transform: translateY(-2px);
}

/* 2. ПРАВЫЙ БЛОК: АРЕНДА ПОЛОК */
.shelves-sidebar {
  position: sticky;
  top: 100px;
  background: #fff;
  border-radius: 24px;
  border: 2px solid #ba81c7;
  box-shadow: 0 10px 40px rgba(186, 129, 199, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 600px;
}

.shelves-header {
  padding: 20px;
  border-bottom: 2px dashed #f3e5f5;
  text-align: center;
}

.shelves-title {
  font-family: 'Caveat';
  font-size: 2.2rem;
  color: #993ead;
  margin: 0;
}

.shelves-list {
  overflow-y: auto;
  padding: 20px;
  flex-grow: 1;
  max-height: 360px;
}

.shelves-list::-webkit-scrollbar {
  width: 6px;
}

.shelves-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 10px;
}

.shelf-item {
  background: #fdfdfd;
  border: 1px solid #edf2f7;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;
}

.shelf-item:last-child {
  margin-bottom: 0;
}

.shelf-status {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 8px;
}

.st-active {
  background: #6ecaa5;
  color: white;
}

.st-soon {
  background: #e53e3e;
  color: #ffffff;
}

.shelf-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 5px;
}

.shelf-date {
  font-size: 13px;
  color: #718096;
}

.shelf-price {
  font-size: 14px;
  font-weight: 600;
  color: #993ead;
  margin-top: 8px;
}

/* 3. НИЖНИЙ БЛОК: ЗАКАЗЫ */
.orders-block {
  background: transparent;
}

.section-title {
  font-family: 'Caveat';
  font-size: 2.5rem;
  margin-bottom: 25px;
  color: #2d3748;
}

.order-row {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 20px;
  border: 1px solid #46b264;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  gap: 30px;
  align-items: center;
  transition: 0.2s;
}

.order-row:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}

.or-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.or-id {
  font-weight: 700;
  font-size: 1.2rem;
}

.or-date {
  font-size: 16px;
  color: #718096;
}

.badge {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  width: fit-content;
  margin-top: 5px;
}

.b-ok {
  background: #6ecaa5;
  color: white;
}

.b-wait {
  background: #f0e164;
  color: #744210;
}

.b-cancel {
  background: #e53e3e;
  color: white;
}

/* Крупный шрифт товаров */
.or-items {
  border-left: 2px solid #edf2f7;
  padding-left: 25px;
  font-size: 18px;
  color: #2d3748;
  line-height: 1.6;
  font-weight: 500;
}

.item-price {
  color: #718096;
  font-size: 15px;
  font-weight: normal;
  margin-left: 10px;
}

.or-total-box {
  text-align: right;
}

.or-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  display: block;
  margin-bottom: 8px;
}

.or-pay {
  font-size: 18px;
  color: #a0aec0;
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 8px;
}

/* Модалка (Старый стиль) */
.modal-content {
  border-radius: 24px;
  border: none;
}

.modal-header {
  border-bottom: 1px solid #edf2f7;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
}

.form-control {
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 1.1rem;
}

.form-control:focus {
  border-color: #6ecaa5;
  box-shadow: 0 0 0 3px rgba(110, 202, 165, 0.2);
}

.btn-save {
  background: #6ecaa5;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 30px;
  font-size: 1.1rem;
}

.btn-save:hover {
  background: #52a585;
}

/* Адаптив */
@media (max-width: 992px) {
  .top-section {
    grid-template-columns: 1fr;
  }

  .shelves-sidebar {
    position: static;
    max-height: none;
    order: -1;
    margin-bottom: 30px;
  }

  .order-row {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: left;
    padding: 20px;
  }

  .or-items {
    border-left: none;
    padding-left: 0;
    border-top: 1px dashed #edf2f7;
    padding-top: 15px;
    font-size: 16px;
  }

  .or-total-box {
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
