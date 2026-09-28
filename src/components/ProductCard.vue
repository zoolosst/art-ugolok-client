<script lang="ts" setup>
import { $f, image } from '@/core/api'
import type { Product } from '@/types/models'

import FavIcon from '@/assets/img/heart-solid.svg'
import NotFavIcon from '@/assets/img/header/mynaui--heart.svg'
import { computed, ref } from 'vue'
import { createFormData } from '@/core/authorize'
import { useUserStore } from '@/stores/user'
import ModalComponent from './ModalComponent.vue'

const userStore = useUserStore()

const props = withDefaults(
  defineProps<{
    item: Product
    likedList: Product[]
    inCartList: Product[]
  }>(),
  { inCartList: () => [], likedList: () => [] },
)

const emits = defineEmits(['cart', 'like'])

const checkIn = (stash: Product[], findIdx: number) =>
  stash.findIndex((p) => p.product_id === findIdx) != -1

const liked = computed(() => checkIn(props.likedList, props.item.product_id))
const cart = computed(() => checkIn(props.inCartList, props.item.product_id))

const handleLike = async () => {
  if (userStore.token) {
    await $f('/p/favorite', {
      method: 'post',
      body: createFormData({ token: userStore.token, id: props.item.product_id }),
    })
    emits('like')
  }
}
const handleCart = async () => {
  if (userStore.token) {
    await $f('/p/cart', {
      method: 'post',
      body: createFormData({ token: userStore.token, id: props.item.product_id }),
    })
    emits('cart')
  }
}

const isProductModalOpen = ref(false)
const openProductModal = () => isProductModalOpen.value = true
const closeProductModal = () => {
  isProductModalOpen.value = false
  photo_ind.value = 0
}

const photo_ind = ref(0);
const photos = computed(() => {
  return props.item.product_photo.split(',');
})
const photo = computed(() => {
  return image(photos.value[photo_ind.value]?.trim() as string);
})
</script>

<template>
  <ModalComponent :is-open="isProductModalOpen" @close="closeProductModal">
    <div style="
      position: absolute;
      top: 1rem;
      right: 1rem;
    ">
      <button class="product-card__btn" @click="closeProductModal">
        Закрыть
      </button>
    </div>
    <div class="product-grid">
      <!-- Левая часть: Фото -->
      <div class="product-image-wrap">
        <div v-if="photos.length > 1" style="
          position: absolute;
          display: flex;
          justify-content: space-between;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
          padding-inline: 1rem;
        ">
          <button class="page-btn" @click="photo_ind -= 1" :disabled="photos[photo_ind - 1] === undefined">‹</button>
          <button class="page-btn" @click="photo_ind += 1" :disabled="photos[photo_ind + 1] === undefined">›</button>
        </div>
        <img :src="photo" onerror="this.src = 'https://placehold.co/500x375?text=Нет+фото'" :alt="item.product_name" class="product-main-img" />
      </div>
      <!-- Правая часть: Информация -->
      <div class="product-info-wrap">
        <h2 class="product-title">{{ item.product_name }}</h2>
        <div class="product-meta">
          <span class="category-badge">
            {{ item.category_name }}
          </span>
          <div class="product-price-block">
            <span class="price-label">Стоимость:</span>
            <span class="price-value">{{ item.product_price }} ₽</span>
          </div>
        </div>
        <div class="description-block">
          <h3 class="desc-title">Описание товара</h3>
          <p class="desc-text">{{ item.product_description }}</p>
        </div>
        <div class="action-buttons">
          <button v-if="userStore.isAuthorize" style="font-size: 1.25rem;" @click.stop="handleCart"
            class="product-card__btn" :class="{ active: cart }">
            {{ cart ? 'Убрать из корзины' : 'Добавить в корзину' }}
          </button>
          <button class="btn-action btn-fav" @click.stop="handleLike" v-if="userStore.isAuthorize" style="flex: 0;">
            <img :src="liked ? FavIcon : NotFavIcon" alt="Избранное" width="24" height="24" style="fill: red;" />
          </button>
        </div>
      </div>
    </div>
    <template #options>
      <div class=""></div>
    </template>
  </ModalComponent>

  <div class="product-card-wrapper">
    <div class="product-card" :data-id="item.product_id" @click="openProductModal">
      <div class="product-card__image-wrapper">
        <button class="fav-btn" @click.stop="handleLike" v-if="userStore.isAuthorize" style="
            background: white;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            z-index: 20;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
          <img :src="liked ? FavIcon : NotFavIcon" alt="Избранное" width="18" height="18" />
        </button>
        <img :src="image(photos[0] as string)" :alt="item.product_name" class="product-card__image"
          onerror="this.src = 'https://placehold.co/500x375?text=Нет+фото'" />
      </div>
      <div class="product-card__content">
        <h3 class="product-card__title">{{ item.product_name }}</h3>
        <p class="product-card__desc">{{ item.product_description || 'Ручная работа' }}</p>
        <div class="product-card__bottom">
          <span class="product-card__price">{{ Number(item.product_price).toLocaleString('ru-RU') }} ₽</span>
          <button v-if="userStore.isAuthorize" @click.stop="handleCart" class="product-card__btn"
            :class="{ active: cart }">
            {{ cart ? 'Убрать из корзины' : 'Добавить в корзину' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card-wrapper {
  position: relative;
  padding-top: 0;
  min-height: 380px;
}

.product-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: none;
  z-index: 1;
  width: 100%;
  cursor: pointer;
}

.product-card-wrapper:hover .product-card {
  transform: scale(1.18);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
  z-index: 100;

  p {
    text-wrap: initial;
  }
}

.product-card__image-wrapper {
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
}

.product-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.product-card-wrapper:hover .product-card__image {
  transform: scale(1.08);
}

.product-card__content {
  padding: 12px 12px 16px;
  transition: all 0.3s ease;
  background: #fff;
}

.product-card__title {
  font-family: 'Caveat', cursive;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 6px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card__desc {
  font-family: 'Manege', sans-serif;
  font-size: 0.9rem;
  color: #9b8a78;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card__hover-description {
  font-family: 'Manege', sans-serif;
  font-size: 0.8rem;
  color: #4a5568;
  background: #e2e8f0;
  padding: 0 10px;
  border-radius: 8px;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.4;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    max-height 0.4s ease,
    opacity 0.3s ease,
    margin 0.2s ease,
    padding 0.2s ease;
}

.product-card-wrapper:hover .product-card__hover-description {
  max-height: 120px;
  opacity: 1;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
}

.product-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.product-card__price {
  font-family: 'Manege', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #6ecaa5;
}

.product-card__btn {
  background: #6eca8d;
  border: none;
  border-radius: 40px;
  padding: 8px 18px;
  font-family: 'Manege', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: lowercase;
}

.active {
  background: #1e7d3e;
}

.product-card__btn:hover {
  background: #52a585;
  transform: translateY(-2px);
}

/* Сетка макета */
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  /* gap: 40px; */
  align-items: start;
}

/* Изображение */
.product-image-wrap {
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #edf2f7;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-main-img:hover {
  transform: scale(1.05);
}

/* Заголовок и мета-данные */
.product-title {
  font-family: 'Caveat';
  font-size: 2.8rem;
  color: #2d3748;
  margin-bottom: 20px;
  line-height: 1.1;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px dashed #e2e8f0;
}

.category-badge {
  background: #f3e5f5;
  color: #993ead;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.price-label {
  font-size: 14px;
  color: #a0aec0;
  text-transform: uppercase;
  font-weight: 600;
  margin-right: 10px;
}

.price-value {
  font-size: 2rem;
  font-weight: 700;
  color: #6ecaa5;
}

/* Описание */
.description-block {
  margin-bottom: 35px;
}

.desc-title {
  font-family: 'Caveat';
  font-size: 1.8rem;
  color: #4a5568;
  margin-bottom: 12px;
}

.desc-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  white-space: pre-line;
  /* Сохраняет переносы строк из БД */
}

/* Кнопки действий */
.action-buttons {
  display: flex;
  gap: 15px;
}

.btn-action {
  flex: 1;
  padding: 14px 20px;
  border-radius: 30px;
  border: none;
  font-family: 'Caveat';
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-cart {
  background: #6ecaa5;
  color: white;
}

.btn-cart:hover {
  background: #52a585;
  transform: translateY(-2px);
}

.btn-fav {
  background: #fff;
  color: #db7b56;
  border: 2px solid #db7b56;
  width: fit-content;
}

.btn-fav:hover {
  background: #db7b56;
  color: white;
  transform: translateY(-2px);
}

/* Адаптив для мобильных */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .product-image-wrap {
    max-height: 300px;
  }

  .product-title {
    font-size: 2.2rem;
  }

  .action-buttons {
    flex-direction: column;
  }

}

.product-info-wrap {
  --pad: 2rem;
  padding: var(--pad);
}

.page-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  background: #6ecaa5;
  color: white;
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
