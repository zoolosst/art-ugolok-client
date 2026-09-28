<script lang="ts" setup>
import ProductCard from '@/components/ProductCard.vue'
import { useF } from '@/core/api'
import { createFormData } from '@/core/authorize'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const { data: liked, refresh: refreshLiked } = useF('/p/favorite', {
  method: 'post',
  body: createFormData({ token: userStore.token, method: 'get' }),
})
const { data: cart, refresh: refreshCart } = useF('/p/cart', {
  method: 'post',
  body: createFormData({ token: userStore.token, method: 'get' }),
})

document.title = 'Арт-уголок | Избранное'
</script>

<template>
  <div>
    <div class="bg-circles">
      <div class="circle c1"></div>
      <div class="circle c2"></div>
      <div class="circle c3"></div>
      <div class="circle c4"></div>
      <div class="circle c5"></div>
      <div class="circle c6"></div>
      <div class="circle c7"></div>
      <div class="circle c8"></div>
      <div class="circle c9"></div>
      <div class="circle c10"></div>
      <div class="circle c11"></div>
    </div>
    <main>
      <div class="favourites-wrapper">
        <div class="favourites-container">
          <h1 class="favourites-title p-caveat">Избранное</h1>
          <p class="favourites-subtitle">Товары, которые вам понравились</p>

          <div id="favourites-grid-container" class="favourites-grid" v-if="cart && liked">
            <ProductCard
              v-for="(item, idx) in liked"
              :item="item"
              :key="idx"
              :liked-list="liked"
              :in-cart-list="cart"
              @cart="refreshCart"
              @like="refreshLiked"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
body {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  font-family: 'Manege', sans-serif;
  color: #2d3748;
}

main {
  min-height: 200vh;
}

.favourites-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.favourites-container {
  padding: 30px 0;
  min-height: 60vh;
}

.favourites-title {
  font-family: 'Caveat', sans-serif;
  font-size: 3.2rem;
  color: #4a3728;
  margin-bottom: 10px;
  text-align: center;
}

.favourites-subtitle {
  text-align: center;
  color: #9b8a78;
  margin-bottom: 35px;
  font-size: 1.1rem;
}

.favourites-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

/* ОБЁРТКА КАРТОЧКИ — relative */
.product-card-wrapper {
  position: relative;
  padding-top: 0;
  min-height: 380px;
}

/* САМА КАРТОЧКА — absolute */
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
}

/* ОЧЕНЬ СИЛЬНОЕ УВЕЛИЧЕНИЕ КАРТОЧКИ ПРИ НАВЕДЕНИИ */
.product-card-wrapper:hover .product-card {
  transform: scale(1.18);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
  z-index: 100;
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

.remove-fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.remove-fav-btn:hover {
  transform: scale(1.08);
}

.remove-fav-btn img {
  width: 16px;
  height: 16px;
  pointer-events: none;
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

/* НОВОЕ ПОЛЕ С ОПИСАНИЕМ — ПРОСТО СЕРЫЙ ФОН */
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
  background: #6ecaa5;
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

.product-card__btn:hover {
  background: #52a585;
  transform: translateY(-2px);
}

.empty-favourites {
  text-align: center;
  padding: 50px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  border: 1px dashed #f5d76e;
  grid-column: 1/-1;
}

.empty-favourites p {
  font-size: 1.2rem;
  color: #9b8a78;
  margin-bottom: 15px;
}

.empty-favourites .btn-catalog {
  background: #ba81c7;
  color: white;
  border: none;
  border-radius: 40px;
  padding: 10px 25px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.empty-favourites .btn-catalog:hover {
  background: #9f64ac;
  transform: translateY(-2px);
}

@media (max-width: 1100px) {
  .favourites-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .product-card-wrapper:hover .product-card {
    transform: scale(1.12);
  }
}

@media (max-width: 800px) {
  .favourites-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .product-card-wrapper:hover .product-card {
    transform: scale(1.1);
  }
}

@media (max-width: 576px) {
  .favourites-wrapper {
    padding: 0 15px;
  }

  .favourites-container {
    padding: 20px 0;
  }

  .favourites-title {
    font-size: 2rem;
  }

  .favourites-subtitle {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  .favourites-grid {
    gap: 12px;
  }

  .product-card__content {
    padding: 8px 8px 12px;
  }

  .product-card__title {
    font-size: 0.9rem;
    white-space: normal;
  }

  .product-card__desc {
    font-size: 0.8rem;
    white-space: normal;
  }

  .product-card__price {
    font-size: 0.9rem;
  }

  .product-card__btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .product-card__hover-description {
    font-size: 0.7rem;
  }

  .product-card-wrapper:hover .product-card {
    transform: scale(1.05);
  }
}
</style>
