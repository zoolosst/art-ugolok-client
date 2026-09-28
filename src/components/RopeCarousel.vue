<script lang="ts" setup>
import type { Category } from '@/types/models.ts';
import RopeCard from './RopeCard.vue';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
   categories: Category[]
}>()

const activeCursor = ref(0);
const cardsOnScreen = 4
const visibleCategories = computed(() => props.categories.filter((v, id) => id >= activeCursor.value && id < (activeCursor.value + cardsOnScreen)))

// Добавляем ref для отслеживания направления перелистывания
const direction = ref<'left' | 'right'>('right');

const transitionName = computed(() => `slide-${direction.value}`);

const nextPage = () => {
   if (activeCursor.value + cardsOnScreen < props.categories.length) {
      direction.value = 'left'; // При клике "вперед" новые карточки едут слева
      activeCursor.value += 1;
   }
};

const prevPage = () => {
   if (activeCursor.value > 0) {
      direction.value = 'right'; // При клике "назад" новые карточки едут справа
      activeCursor.value -= 1;
   }
};

onMounted(() => {
   document.body.style.overflowX = 'hidden'
})

const onBeforeLeave = (el: Element) => {
   const elem = el as HTMLElement;
   const rect = elem.getBoundingClientRect();
   const container = elem.parentElement;

   if (container) {
      const containerRect = container.getBoundingClientRect();

      elem.style.position = 'absolute';
      elem.style.top = `${rect.top - containerRect.top}px`;
      elem.style.left = `${rect.left - containerRect.left}px`;
      elem.style.width = `${rect.width}px`;
      elem.style.margin = '0';
      elem.style.boxSizing = 'border-box'; // Фиксируем модель расчета ширины
   }
};
</script>

<template>
   <div class="rope-carousel">
      <div class="rope"></div>
      <div style="position: relative;">
         <div class="btns-container">
            <button class="page-btn prev-btn" id="prevPageBtn"
               :disabled="activeCursor - 1 + cardsOnScreen < cardsOnScreen" @click="prevPage">‹</button>
            <button class="page-btn next-btn" id="nextPageBtn"
               :disabled="activeCursor + 1 + cardsOnScreen > categories.length" @click="nextPage">›</button>
         </div>
      </div>
      <transition-group :name="transitionName" class="cards-container" tag="div" @before-leave="onBeforeLeave">
         <RopeCard :data="cat" v-for="cat in visibleCategories" :key="cat.category_id" />
      </transition-group>
   </div>
</template>

<style scoped>
.rope-carousel {
   height: 50vh;
}

.rope {
   position: absolute;
   width: 100%;
   height: 25%;
   left: 0;
   transform: translateY(-100%);
   overflow: hidden;

   &::before {
      content: '';
      position: inherit;
      width: 100%;
      height: 100%;
      outline: solid 0.1rem #D18F64;
      transform: translateY(-35%);
      outline-offset: 2rem;
      border-radius: 50%;
   }

   pointer-events: none;
}

.cards-container {
   display: flex;
   /* justify-content: space-evenly; */
   justify-content: center;
   gap: 2.5rem;
   position: relative;
}

.cards-container>* {
   flex-shrink: 0;
}

.page-btn {
   background: #f0f0f0;
   border: none;
   border-radius: 50%;
   width: 60px;
   height: 60px;
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

.btns-container {
   position: absolute;
   z-index: 100;
   display: flex;
   pointer-events: none;
   justify-content: space-between;
   left: 0;
   /* top: 50%; */

   transform: translateY(200%);
   width: 100%;

   .page-btn {
      pointer-events: all;
   }
}

/* ================= */
/* АНИМАЦИИ ПЕРЕХОДА */
/* ================= */

/* 1. Базовое время и плавность для всех состояний */
.slide-left-enter-active,
.slide-right-enter-active,
.slide-left-move,
.slide-right-move {
   transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 2. Для уходящих карточек указываем ТОЛЬКО transform и opacity */
.slide-left-leave-active,
.slide-right-leave-active {
   position: absolute;
   /* Убираем 'all', чтобы избежать анимации свойств top/left из inline-стилей */
   transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* --- Перелистывание ВЛЕВО (кнопка "Вперед") --- */
.slide-left-enter-from {
   top: -4em;
   opacity: 0;
   transform: translateX(100%);
}

.slide-left-leave-to {
   top: -4em;
   opacity: 0;
   transform: translateX(-100%);
}

/* Убираем уезжающую карточку из потока, чтобы она не "толкала" остальные */
.slide-left-leave-active {
   position: absolute;
}

/* --- Перелистывание ВПРАВО (кнопка "Назад") --- */
.slide-right-enter-from {
   top: -4em;
   opacity: 0;
   transform: translateX(-100%);
}

.slide-right-leave-to {
   top: -4em;
   opacity: 0;
   transform: translateX(100%);
}

.slide-right-leave-active {
   position: absolute;
}
</style>