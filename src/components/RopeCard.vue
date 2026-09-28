<script lang="ts" setup>
import { image } from '@/core/api';
import type { Category } from '@/types/models';

defineProps<{
   data: Category
}>()

</script>

<template>

   <div @click="$router.push({ name: 'catalog', query: { cat: data.category_id } })" class="category-card">
      <div class="card-img-wrapper">
         <img :src="image(data.category_photo)" :alt="data.category_name" loading="lazy" />
      </div>
      <div class="card-content">
         <h5 class="card-title">{{ data.category_name }}</h5>
         <p class="card-text">{{ data.category_description }}</p>
      </div>
   </div>
</template>

<style scoped>
.category-card {
  top: 0;
  flex: 0;
  background-color: #F4EDEA;
  padding: 2rem;
  height: fit-content;
  position: relative;
  
  /* ВАЖНО: синхронизируем время с каруселью, чтобы подъем был плавным */
  transition: scale 0.2s ease, 
              top 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  /* ========================================= */
  /* 1. СТАТИЧНОЕ СОСТОЯНИЕ (после анимации)   */
  /* ========================================= */
  &:first-child, &:last-child {
    top: -2rem;

    &::before {
      background-image: url('../assets/img/main/skrepka2.png');
    }
  }
  
  &:first-child::before {
    transform: scaleX(-1);
  }

  /* ========================================= */
  /* 2. ДИНАМИЧЕСКОЕ СОСТОЯНИЕ (во время сдвига) */
  /* ========================================= */

  /* --- СДВИГ ВЛЕВО (кнопка "Вперед") --- */
  
  /* Уходящая карточка первая. Новая первая - это следующий sibling за ней */
  .slide-left-leave-active + & {
    top: -2rem;
    &::before {
      background-image: url('../assets/img/main/skrepka2.png');
    }
  }

  /* Заходящая карточка становится новой последней */
  .slide-left-enter-active {
    top: -2rem;
    &::before {
      background-image: url('../assets/img/main/skrepka2.png');
    }
  }

  /* --- СДВИГ ВПРАВО (кнопка "Назад") --- */

  /* Уходящая карточка последняя. Новая последняя - это sibling ПЕРЕД ней.
     Используем :has() для выбора элемента, за которым следует уходящий */
  &:has(+ .slide-right-leave-active) {
    top: -2rem;
    &::before {
      background-image: url('../assets/img/main/skrepka2.png');
    }
  }

  /* Заходящая карточка становится новой первой */
  .slide-right-enter-active {
    top: -2rem;
    &::before {
      background-image: url('../assets/img/main/skrepka2.png');
      transform: scaleX(-1); /* Зеркалируем скрепку для первой карточки */
    }
  }

  /* ========================================= */
  /* БАЗОВЫЕ СТИЛИ (псевдоэлемент, hover и т.д.) */
  /* ========================================= */
  &::before {
    content: '';
    background-image: url('../assets/img/main/skrepka1.png');
    width: 100%;
    background-repeat: no-repeat;
    background-position: top center;
    height: 100%;
    position: absolute;
    left: 0;
    top: -6rem;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
}

.category-card:hover {
  scale: 115%;
  cursor: pointer;
  box-shadow: 0 0 0.5rem color-mix(black, transparent 70%);

  &::before {
    opacity: 0;
  }
}

.card-img-wrapper {
   
   img {
      max-height: 12rem;
      height: auto;
      max-width: 10rem;
      width: auto;
   }

   box-shadow: 0 0.5rem 0.5rem -0.25rem color-mix(black, transparent 70%);
}

.card-content {
   margin-top: 1rem;

   h5 {
      text-decoration: underline;
   }

   p {
      margin-top: 0.5rem;
      line-height: 90%;
      font-size: medium;
   }
}
</style>