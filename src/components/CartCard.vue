<script lang="ts" setup>
import { $f, image } from '@/core/api'
import { createFormData } from '@/core/authorize'
import { useUserStore } from '@/stores/user'
import type { Product } from '@/types/models'

const userStore = useUserStore()

const props = defineProps<{
  item: Product
}>()

const emits = defineEmits(['cart'])

const handleCart = async () => {
  if (userStore.token) {
    await $f('/p/cart', {
      method: 'post',
      body: createFormData({ token: userStore.token, id: props.item.product_id }),
    })
    emits('cart')
  }
}
</script>

<template>
  <div class="item-card" :data-id="item.product_id">
    <img class="item-image" onerror="this.src = 'https://placehold.co/500x375?text=Нет+фото'" :src="image(item.product_photo.split(',')[0]?.trim() as string)" :alt="item.product_name" />
    <div class="item-info">
      <div class="cart-item-title">{{ item.product_name }}</div>
      <div class="cart-item-price">{{ item.product_price.toLocaleString('ru-RU') }} ₽</div>
    </div>
    <button class="btn btn-outline-danger btn-sm remove-btn" @click="handleCart">Удалить</button>
  </div>
</template>

<style scoped>
/* Карточка товара */
.item-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e0;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  background-color: #edf2f7;
  border: 1px solid #f1f5f9;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.item-price {
  font-weight: 600;
  font-size: 1.15rem;
  white-space: nowrap;
  margin-right: 15px;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #de7575;
  padding: 8px;
  border-radius: 50%;
}

.delete-btn:hover {
  color: #e53e3e;
  background-color: #fff5f5;
}
</style>
