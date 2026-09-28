<script lang="ts" setup>
import CartCard from '@/components/CartCard.vue'
import { $f, useF } from '@/core/api'
import { createFormData } from '@/core/authorize'
import { useUserStore } from '@/stores/user'
import type { OrderCheckup } from '@/types'
import type { Product } from '@/types/models'
import { computed, reactive } from 'vue'
const userStore = useUserStore()
const { data: cart, refresh: refreshCart } = useF('/p/cart', {
  method: 'post',
  body: createFormData({ token: userStore.token, method: 'get' }),
})

const summary = computed(() => {
  let result = 0
  ;((cart.value ?? []) as Product[]).forEach(
    (p) => (result += parseInt(p.product_price as unknown as string)),
  )
  return result
})

const orderCheckup = reactive<OrderCheckup>({
  deliver: 'shop',
  address: '',
  shipping: 'pochta',
  payment: 'card',
})

const handleOrder = async () => {
  await $f('/u/order', {
    method: 'post',
    body: createFormData({ ...orderCheckup, token: userStore.token }),
  })
  location.href = '/profile'
}

document.title = 'Арт-уголок | Корзина'
</script>

<template>
  <div class="page-wrapper container">
    <!-- КОНТЕНТ -->
    <main class="main-container">
      <h1 class="page-title p-caveat">Ваша корзина</h1>

      <div class="cart-layout">
        <div class="cart-left-col">
          <router-link :to="{ name: 'catalog' }" class="continue-shopping p-manege">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Продолжить покупки
          </router-link>

          <div id="cart-items-container" style="display: flex; flex-direction: column; gap: 15px">
            <transition-group name="slide-down">
              <CartCard v-for="(item, idx) in cart" :item="item" :key="idx" @cart="refreshCart" />
            </transition-group>
          </div>
        </div>

        <aside class="summary-card p-manege">
          <div class="summary-title">Итого</div>

          <div class="summary-row">
            <span>Товары</span>
            <span id="cart-total">{{ summary }} руб.</span>
          </div>

          <div class="selection-group">
            <span class="selection-label">Способ получения</span>
            <div class="radio-options">
              <label
                class="radio-option"
                :class="{ active: orderCheckup.deliver === 'shop' }"
                onclick="handleDeliveryChange('pickup')"
              >
                <input
                  v-model="orderCheckup.deliver"
                  type="radio"
                  name="delivery"
                  value="shop"
                  checked
                />
                Самовывоз из магазина
              </label>
              <label
                class="radio-option"
                :class="{ active: orderCheckup.deliver === 'deliver' }"
                onclick="handleDeliveryChange('courier')"
              >
                <input
                  v-model="orderCheckup.deliver"
                  type="radio"
                  name="delivery"
                  value="deliver"
                />
                Доставка курьером
              </label>
            </div>

            <!-- Блок с сообщением о доставке (анимированный) -->
            <!-- <div id="delivery-info-text" class="delivery-info-box">
                     <div class="delivery-message">
                        Стоимость доставки рассчитывается индивидуально в соответствии с габаритами заказа и местом
                        отправления. Менеджер свяжется с вами для уточнения деталей.
                     </div>
                  </div> -->

            <!-- Отдельный блок для выбора службы доставки и адреса -->
            <transition name="slide-down">
              <div
                id="delivery-details-block"
                class="delivery-details-block"
                v-if="orderCheckup.deliver === 'deliver'"
              >
                <div class="selection-group" style="margin-bottom: 12px">
                  <span class="selection-label" style="font-size: 0.95rem"
                    >Транспортная компания</span
                  >
                  <div class="radio-options">
                    <label
                      class="radio-option"
                      :class="{ active: orderCheckup.shipping === 'pochta' }"
                      style="padding: 6px 12px; font-size: 0.9rem"
                      onclick="selectShipping('pochta')"
                    >
                      <input
                        v-model="orderCheckup.shipping"
                        type="radio"
                        name="shipping"
                        value="pochta"
                      />
                      Почта России
                    </label>
                    <label
                      class="radio-option"
                      :class="{ active: orderCheckup.shipping === 'cdek' }"
                      style="padding: 6px 12px; font-size: 0.9rem"
                      onclick="selectShipping('cdek')"
                    >
                      <input
                        v-model="orderCheckup.shipping"
                        type="radio"
                        name="shipping"
                        value="cdek"
                      />
                      СДЭК
                    </label>
                  </div>
                </div>
                <div>
                  <label
                    for="delivery-address"
                    style="font-size: 0.85rem; color: #4a5568; margin-bottom: 5px; display: block"
                    >Адрес доставки:</label
                  >
                  <input
                    type="text"
                    id="delivery-address"
                    class="form-control"
                    placeholder="Введите город, улицу, номер дома"
                    v-model="orderCheckup.address"
                    style="background: #fff; border: 1px solid #cbd5e0; font-size: 0.9rem"
                  />
                </div>
              </div>
            </transition>
          </div>

          <div class="selection-group">
            <span class="selection-label">Способ оплаты</span>
            <div class="radio-options">
              <label
                class="radio-option"
                :class="{ active: orderCheckup.payment === 'card' }"
                onclick="handlePaymentChange(this)"
              >
                <input
                  type="radio"
                  v-model="orderCheckup.payment"
                  name="payment"
                  value="card"
                  checked
                />
                Переводом по номеру
              </label>
              <label
                class="radio-option"
                :class="{ active: orderCheckup.payment === 'cash' }"
                onclick="handlePaymentChange(this)"
              >
                <input type="radio" v-model="orderCheckup.payment" name="payment" value="cash" />
                Наличными при получении
              </label>
            </div>
          </div>

          <div class="summary-row total">
            <span>К оплате за товары</span>
            <span id="checkout-total">{{ summary }} руб.</span>
          </div>
          <button
            id="checkout-btn"
            class="checkout-btn"
            :disabled="
              (orderCheckup.deliver === 'deliver' && orderCheckup.address == '') ||
              (cart as Product[]).length === 0
            "
            @click="handleOrder"
          >
            Оформить заказ
          </button>

          <div class="secure-payment">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Безопасная оплата
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Базовые настройки */
body {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  font-family: 'Manege', sans-serif;
  color: #2d3748;
}

.page-wrapper {
  min-height: 200vh;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 15px;
}

.main-container {
  padding-top: 20px;
  padding-bottom: 60px;
}

/* Заголовок */
.page-title {
  font-family: 'Caveat', cursive;
  font-size: 3.5rem;
  font-weight: normal;
  margin-bottom: 20px;
}

/* Сетка корзины */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

/* Ссылка "Продолжить покупки" */
.continue-shopping {
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 15px;
}

.continue-shopping:hover {
  color: #3182ce;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

/* Начальное состояние при появлении и конечное при исчезновении */
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Правая колонка (Итого) */
.summary-card {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 25px;
  position: sticky;
  top: 90px;
}

.summary-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1rem;
  color: #718096;
}

.summary-row.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px dashed #edf2f7;
  font-weight: 800;
  font-size: 1.2rem;
  color: #2d3748;
}

/* Выбор опций (Доставка/Оплата) */
.selection-group {
  margin-bottom: 15px;
}

.selection-label {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
  color: #718096;
}

.radio-option:hover {
  background: #f8fafc;
  border-color: #cbd5e0;
}

.radio-option.active {
  background: #f0fdf4;
  border-color: #a8d5ba;
  color: #2f855a;
  font-weight: 600;
}

.radio-option input[type='radio'] {
  accent-color: #a8d5ba;
  width: 15px;
  height: 15px;
  margin: 0;
}

/* Инфо о доставке */
.delivery-info-box {
  margin-top: 8px;
  padding: 10px;
  background: #fffff0;
  border: 1px solid #fefcbf;
  border-radius: 8px;
  border-left: 3px solid #ecc94b;
  font-size: 1rem;
  color: #744210;
  line-height: 1.4;

  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s ease;
}

.delivery-info-box.visible {
  opacity: 1;
  max-height: 200px;
  margin-bottom: 10px;
}

/* Блок с выбором ТК и адресом */
.delivery-details-block {
  margin-top: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #e2e8f0;
}

.delivery-details-block .radio-options {
  flex-direction: row;
  gap: 15px;
}

.delivery-details-block .radio-option {
  padding: 6px 12px;
  font-size: 0.9rem;
}

/* Кнопка оформления */
.checkout-btn {
  width: 100%;
  background: #a8d5ba;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}

.checkout-btn:hover {
  background: #95c7aa;
}

.checkout-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 0.7rem;
  color: #a0aec0;
}

/* Адаптив */
@media (max-width: 950px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 600px) {
  .item-card {
    flex-wrap: wrap;
  }

  .item-price {
    margin-right: auto;
  }

  .page-title {
    font-size: 2.5rem;
  }
}
</style>
