<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Порог появления кнопки (в пикселях)
const SCROLL_THRESHOLD = 300

const showScrollTopBtn = ref(false)

// Функция обработки скролла с простой защитой от частых вызовов
let scrollTimeout: number | null = null
const handleScroll = () => {
  if (scrollTimeout) return
  
  scrollTimeout = window.setTimeout(() => {
    showScrollTopBtn.value = window.scrollY > SCROLL_THRESHOLD
    scrollTimeout = null
  }, 100) // Проверка раз в 100мс
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})


</script>

<template>
  <transition name="fade">
    <div v-if="showScrollTopBtn" class="position-fixed bottom-0 end-0 p-5" style="z-index: 1000; cursor: pointer;">
      <div @click="scrollToTop" class="scrolltop">
        <img src="/src/assets/img/main/btn-up.svg" alt="" style="max-width: 50px" />
      </div>
    </div>
  </transition>

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-col">
        <a href="/"
          ><img src="/src/assets/img/header/logo.svg" alt="Логотип" class="footer-logo"
        /></a>
      </div>
      <div class="footer-col">
        <a href="/rent">Аренда полки</a>
        <a href="/catalog">Каталог</a>
        <a href="/deliver">О доставке</a>
        <a href="/favourite">Избранное</a>
      </div>
      <div class="footer-col">
        <div class="footer-title">Контакты</div>
        <a href="tel:+73912345678">+7 (391) 234-56-78</a>
        <a href="mailto:art-ugolok@mail.ru">art-ugolok@mail.ru</a>
        <span>г. Красноярск, пр-т Мира, д. 79</span>
        <span>Ежедневно с 11:00 до 21:00</span>
      </div>
    </div>
    <div class="footer-copy">© 2026 Арт-Уголок. Все права защищены.</div>
  </footer>
</template>

<style scoped>
.footer {
  background: #f5e6f8;
  padding: 16px 20px 8px;
  margin-top: 50px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-col a,
.footer-col span {
  color: #1a1a2e;
  text-decoration: none;
  font-family: 'Manege', sans-serif;
  font-size: 0.95rem;
}

.footer-col a:hover {
  color: #6ecaa5;
}

.footer-logo {
  max-width: 140px;
}

.footer-title {
  font-family: 'Caveat', cursive;
  font-size: 1.3rem;
  font-weight: 600;
  color: #3d2b1f;
  margin-bottom: 4px;
}

.footer-copy {
  text-align: center;
  font-size: 0.7rem;
  color: #4a5568;
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  font-family: 'Manege', sans-serif;
}

@media (max-width: 800px) {
  .delivery-methods {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .steps-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .delivery-title {
    font-size: 2rem;
  }
}

@media (max-width: 700px) {
  .footer-inner {
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: 16px;
  }

  .footer-col {
    align-items: center;
  }
}

.scrolltop {
  outline-style: solid;
  border-radius: 4px;
  outline-color: transparent;
  outline-offset: -0.5rem;
  transition: all 0.2s ease;
  &:hover{
    outline-color: #6ecaa5;
    outline-width: 0.25rem;
    outline-offset: 1.5rem;
  } 
}
</style>
