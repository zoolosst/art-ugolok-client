<script lang="ts" setup>
import { $f } from '@/core/api'
import { createFormData } from '@/core/authorize'
import { useUserStore } from '@/stores/user'
import { reactive, computed } from 'vue'

const userStore = useUserStore()

const formData = reactive({
  brand: '',
  link: '',
  contact: '',
  comment: '',
})

// Состояние ошибок для каждого поля
const errors = reactive({
  brand: '',
  link: '',
  contact: '',
})

// Отслеживание взаимодействия с полями (чтобы не показывать ошибки до первого фокуса)
const touched = reactive({
  brand: false,
  link: false,
  contact: false,
})

// Проверка конкретного поля
const validateField = (field: 'brand' | 'link' | 'contact') => {
  touched[field] = true
  if (formData[field].trim() === '') {
    errors[field] = 'Это поле обязательно для заполнения'
  } else {
    errors[field] = ''
  }
}

// Проверка всех обязательных полей
const validateAll = () => {
  validateField('brand')
  validateField('link')
  validateField('contact')
}

// Общая валидность формы
const isFormValid = computed(() => {
  return formData.brand.trim() !== '' && 
         formData.link.trim() !== '' && 
         formData.contact.trim() !== ''
})

const handleSend = async () => {
  validateAll()
  
  // Если форма не валидна, прерываем отправку
  if (!isFormValid.value) return

  console.log(
    await $f('/req/add', {
      method: 'post',
      body: createFormData({ ...formData, token: userStore.token }),
    }),
  )
  location.href = '/profile'
}

document.title = 'Арт-уголок | Аренда'
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
    <div class="circle1"></div>
    <div class="circle2"></div>
    <div class="circle4"></div>
    <div class="circle3"></div>
    
    <main>
      <!-- БЛОК 1 — ЖЁЛТЫЙ -->
      <div class="full-width-block-white">
        <div class="first-block-wrapper">
          <div class="corner-tl"></div>
          <div class="corner-tr"></div>
          <div class="corner-bl"></div>
          <div class="corner-br"></div>
          <div class="deco-line-top"></div>
          <div class="deco-line-bottom"></div>
          <div class="section-header">
            <h1 class="section-title">Почему выбирают нас?</h1>
          </div>
          <div class="row g-4 justify-content-center">
            <div class="col-md-4">
              <div class="square-card">
                <div class="card-icon">📦</div>
                <h3 class="card-title">Готовая витрина</h3>
                <p class="card-desc">Освещение, ценники, уборка — вы просто привозите работы</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="square-card">
                <div class="card-icon">📸</div>
                <h3 class="card-title">Фотосессия товаров</h3>
                <p class="card-desc">Бесплатная профессиональная съёмка для портфолио</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="square-card">
                <div class="card-icon">📈</div>
                <h3 class="card-title">Продвижение</h3>
                <p class="card-desc">Упоминания в соцсетях и среди лояльной аудитории</p>
              </div>
            </div>
          </div>
          <div class="block1-button">
            <button class="btn-scroll"
              onclick="document.getElementById('form-block').scrollIntoView({ behavior: 'smooth' })">
              📝 Оставить заявку на аренду
            </button>
          </div>
        </div>
      </div>

      <!-- БЛОК 2 -->
      <div class="second-block">
        <div class="airy-container">
          <h2 class="second-title">Наши полки для вашей аренды</h2>
          <div class="price-wrapper">
            <div class="price-info">
              <div class="price-text">
                <p>🔹 Минимальный срок аренды — 4 недели.</p>
                <p>💰 Цена указана за неделю, в скобках — при аренде от 8 недель.</p>
                <p>📊 Комиссия от продаж в пользу магазина — 10%.</p>
                <p>📦 Есть возможность разместить штучный товар — от 50руб. в неделю.</p>
              </div>
            </div>
            <div class="shelves-photo">
              <img src="/src/assets/img/shelfs.jpg" alt="Наши стеллажи и полки" />
            </div>
          </div>
        </div>
      </div>

      <!-- БЛОК 3 — ЖЁЛТЫЙ -->
      <div class="third-block">
        <div class="airy-container">
          <h2 class="instruction-title">📋 Инструкция как заполнить форму</h2>
          <div class="row g-4 justify-content-center" id="cards-container">
            <div class="col-md-4">
              <div class="instruction-card" data-card="0">
                <div class="instruction-number">1</div>
                <h3 class="card-title">Выберите полку</h3>
                <ul>
                  <li>ознакомьтесь с фотографией стеллажей</li>
                  <li>выберите номер и размер полки</li>
                  <li>расскажите, что вас заинтересовало</li>
                </ul>
              </div>
            </div>
            <div class="col-md-4">
              <div class="instruction-card" data-card="1">
                <div class="instruction-number">2</div>
                <h3 class="card-title">Оставьте заявку</h3>
                <ul>
                  <li>название бренда</li>
                  <li>расскажите о процессе и материалах</li>
                  <li>укажите преимущества ваших товаров</li>
                  <li>где ещё представлены ваши работы</li>
                </ul>
              </div>
            </div>
            <div class="col-md-4">
              <div class="instruction-card" data-card="2">
                <div class="instruction-number">3</div>
                <h3 class="card-title">Ждите ответ</h3>
                <ul>
                  <li>мы обработаем вашу заявку</li>
                  <li>свяжемся в ближайшее время</li>
                  <li>обсудим детали сотрудничества</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- БЛОК 4 — ФОРМА -->
      <div class="fourth-block" id="form-block">
        <div class="airy-container">
          <div class="form-header">
            <h2 class="form-title">Оставить заявку на аренду</h2>
            <div class="form-subtitle">Заполните эту форму, чтобы начать сотрудничать с нами</div>
          </div>
          <div class="form-card">
            <!-- Добавлен @submit.prevent для корректной обработки Vue -->
            <form @submit.prevent="handleSend">
              <div class="form-row">
                <div class="form-group" :class="{ 'has-error': touched.brand && errors.brand }">
                  <label>Название бренда / мастерской <span class="required-mark">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Например: WoodArt"
                    v-model="formData.brand" 
                    @blur="validateField('brand')"
                    @input="touched.brand && validateField('brand')"
                  />
                  <transition name="fade-slide">
                    <div v-if="touched.brand && errors.brand" class="error-message">{{ errors.brand }}</div>
                  </transition>
                </div>
                
                <div class="form-group" :class="{ 'has-error': touched.link && errors.link }">
                  <label>Ссылка на портфолио <span class="required-mark">*</span></label>
                  <input 
                    type="url" 
                    placeholder="https://vk.com/... или сайт"
                    v-model="formData.link" 
                    @blur="validateField('link')"
                    @input="touched.link && validateField('link')"
                  />
                  <transition name="fade-slide">
                    <div v-if="touched.link && errors.link" class="error-message">{{ errors.link }}</div>
                  </transition>
                </div>
              </div>

              <div class="form-group" :class="{ 'has-error': touched.contact && errors.contact }">
                <label>Дополнительные контакты <span class="required-mark">*</span></label>
                <input 
                  type="text"
                  placeholder="Номер телефона (удобное время связи), ссылку на профиль в соцсетях"
                  v-model="formData.contact" 
                  @blur="validateField('contact')"
                  @input="touched.contact && validateField('contact')"
                />
                <transition name="fade-slide">
                  <div v-if="touched.contact && errors.contact" class="error-message">{{ errors.contact }}</div>
                </transition>
              </div>

              <div class="form-group">
                <label>Комментарий</label>
                <textarea 
                  rows="3"
                  placeholder="Расскажите немного о себе, о процессе, материалах..."
                  v-model="formData.comment"
                ></textarea>
              </div>

              <button type="submit" class="btn-submit" v-if="userStore.isAuthorize">
                Отправить заявку →
              </button>
              
              <div v-else class="auth-prompt">
                Чтобы отправить заявку необходимо
                <router-link :to="{ name: 'auth' }"> Зарегистрироваться </router-link>
                или
                <router-link :to="{ name: 'auth' }"> Войти </router-link>
              </div>

              <div class="form-note">Мы свяжемся с вами в течение 24 часов</div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ===== СТИЛИ ВАЛИДАЦИИ ===== */
.required-mark {
  color: #e74c3c;
  font-weight: bold;
  margin-left: 2px;
}

.form-group.has-error input,
.form-group.has-error textarea {
  border-color: #e74c3c;
  background-color: #fff8f8;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-group.has-error label {
  color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 8px;
  padding-left: 18px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.error-message::before {
  content: '⚠';
  font-size: 0.9rem;
}

.auth-prompt {
  text-align: center;
  font-size: 1.05rem;
  color: #6a3e6a;
  margin-top: 18px;
}

/* Анимация для появления ошибок */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== ОСТАЛЬНЫЕ СТИЛИ (БЕЗ ИЗМЕНЕНИЙ) ===== */
.second-block { padding: 60px 0; position: relative; z-index: 1; }
.second-title { font-family: 'Manege', 'Inter', sans-serif; font-size: 2.5rem; font-weight: 400; color: #4a3728; text-align: center; margin-bottom: 40px; }
.price-wrapper { display: flex; flex-wrap: wrap; gap: 40px; align-items: center; justify-content: space-between; }
.price-info { flex: 1; background: #fff8e7; border-radius: 24px; padding: 30px; border: 1px solid #f5d76e; }
.price-text p { font-size: 1.1rem; color: #4a3728; margin-bottom: 12px; line-height: 1.5; }
.shelves-photo { flex: 1; text-align: center; }
.shelves-photo img { max-height: 500px; border-radius: 24px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); object-fit: cover; }

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: #fef7f3; overflow-x: hidden; }
.bg-circles { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
.bg-circles .circle { position: absolute; border-radius: 50%; background: rgba(196, 168, 130, 0.08); }
.c1 { width: 300px; height: 300px; top: -100px; left: -100px; background: rgba(196, 168, 130, 0.06); }
.c2 { width: 450px; height: 450px; bottom: -150px; right: -150px; background: rgba(196, 168, 130, 0.05); }
.c3 { width: 200px; height: 200px; top: 30%; right: 10%; background: rgba(200, 180, 140, 0.07); }
.c4 { width: 150px; height: 150px; bottom: 20%; left: 5%; background: rgba(180, 150, 110, 0.06); }
.c5 { width: 80px; height: 80px; top: 15%; left: 20%; background: rgba(196, 168, 130, 0.1); }
.c6 { width: 120px; height: 120px; bottom: 30%; right: 20%; background: rgba(200, 180, 140, 0.08); }
.c7 { width: 60px; height: 60px; top: 50%; left: 15%; background: rgba(196, 168, 130, 0.09); }
.c8 { width: 250px; height: 250px; top: 60%; right: -80px; background: rgba(180, 150, 110, 0.05); }
.c9 { width: 40px; height: 40px; top: 20%; left: 35%; background: rgba(200, 180, 140, 0.12); }
.c10 { width: 55px; height: 55px; bottom: 15%; left: 25%; background: rgba(196, 168, 130, 0.1); }
.c11 { width: 35px; height: 35px; top: 45%; right: 30%; background: rgba(180, 150, 110, 0.11); }
.airy-container { max-width: 1100px; margin: 0 auto; padding: 0 40px; position: relative; z-index: 1; }
.section-header { text-align: center; margin-bottom: 40px; }
.section-title { font-family: 'Manege', 'Inter', sans-serif; font-size: 2.7rem; font-weight: 400; color: #4a3728; }
.square-card, .instruction-card { transition: all 0.3s ease; cursor: pointer; }
.square-card:hover { transform: translateY(-6px); }

.full-width-block-white { background: #fffdf5; padding: 30px 0 40px; position: relative; z-index: 1; }
.first-block-wrapper { position: relative; max-width: 1100px; margin: 0 auto; padding: 30px 40px; }
.corner-tl, .corner-tr, .corner-bl, .corner-br { position: absolute; width: 50px; height: 50px; pointer-events: none; border-color: #f5d76e; }
.corner-tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; border-radius: 14px 0 0 0; border-color: #f5d76e; }
.corner-tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; border-radius: 0 14px 0 0; border-color: #f5d76e; }
.corner-bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; border-radius: 0 0 0 14px; border-color: #f5d76e; }
.corner-br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; border-radius: 0 0 14px 0; border-color: #f5d76e; }
.deco-line-top, .deco-line-bottom { position: absolute; left: 50%; transform: translateX(-50%); width: 100px; height: 2px; background: linear-gradient(90deg, transparent, #f5d76e, #f5d76e, #f5d76e, transparent); }
.deco-line-top { top: 10px; }
.deco-line-bottom { bottom: 10px; }
.square-card { background: #fff8e7; border-radius: 20px; padding: 22px 18px; text-align: center; border: 1px solid #f5d76e; display: flex; flex-direction: column; justify-content: center; height: 100%; box-shadow: 0 15px 30px -12px rgba(245, 215, 110, 0.15); }
.square-card:hover { box-shadow: 0 20px 35px -12px rgba(245, 215, 110, 0.3); }
.card-icon { font-size: 44px; margin-bottom: 20px; filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.08)); }
.square-card:hover .card-icon { filter: drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.12)); }
.square-card .card-title { font-size: 1.45rem; font-weight: 550; color: #8b6914; margin-bottom: 12px; position: relative; display: inline-block; padding-bottom: 6px; }
.square-card .card-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: repeating-linear-gradient(45deg, #f5d76e, #f5d76e 6px, transparent 6px, transparent 12px); border-radius: 2px; }
.square-card .card-desc { font-size: 1.05rem; color: #a0823a; line-height: 1.45; margin-top: 8px; }
.btn-scroll { font-family: 'Caveat', sans-serif; display: inline-block; padding: 13px 34px; font-size: 1.4rem; font-weight: 500; color: #fff; background: #f5d76e; border: none; border-radius: 50px; cursor: pointer; transition: all 0.3s ease; margin-top: 35px; }
.btn-scroll:hover { background: #e8c85a; transform: translateY(-2px); }
.block1-button { text-align: center; }

.third-block { background: #fffdf5; padding: 60px 0; position: relative; z-index: 1; }
.instruction-title { font-family: 'Manege', 'Inter', sans-serif; font-size: 2.2rem; font-weight: 400; color: #4a3728; text-align: center; margin-bottom: 50px; }
.instruction-card { background: #fff8e7; border-radius: 24px; padding: 30px 26px; border: 1px solid #f5d76e; height: 100%; transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1); box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.05); }
.instruction-card.user-hover, .instruction-card.auto-active { transform: scale(1.02) translateY(-8px); box-shadow: 0 25px 40px -15px rgba(245, 215, 110, 0.25); background: #fff; border-color: #f5d76e; }
.instruction-card.user-hover .instruction-number, .instruction-card.auto-active .instruction-number { background: #f5d76e; transform: scale(1.1); color: #8b6914; }
.instruction-card.user-hover .card-title, .instruction-card.auto-active .card-title { color: #000000; }
.instruction-card.user-hover li::before, .instruction-card.auto-active li::before { transform: translateX(4px); color: #f5d76e; }
.instruction-card.user-hover li, .instruction-card.auto-active li { color: #000000; }
.instruction-card.user-hover li::before, .instruction-card.auto-active li::before { color: #000000; }
.instruction-number { width: 54px; height: 54px; background: #f5d76e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manege', monospace; font-size: 1.85rem; font-weight: 500; color: #8b6914; margin-bottom: 20px; transition: all 0.3s ease; }
.instruction-card .card-title { font-size: 1.55rem; font-weight: 500; color: #8b6914; margin-bottom: 20px; transition: color 0.3s ease; }
.instruction-card ul { padding-left: 0; list-style: none; margin: 0; }
.instruction-card li { font-size: 1.05rem; color: #a0823a; margin-bottom: 14px; padding-left: 28px; position: relative; line-height: 1.45; }
.instruction-card li::before { content: '→'; position: absolute; left: 0; color: #f5d76e; font-size: 1.1rem; transition: transform 0.3s ease; }

.fourth-block { padding: 60px 0; position: relative; z-index: 1; }
.form-header { text-align: center; margin-bottom: 40px; margin-top: 30px; }
.form-title { font-family: 'Manege', 'Inter', sans-serif; font-size: 2.5rem; font-weight: 400; color: #4a3728; margin-bottom: 16px; }
.form-subtitle { font-size: 1.15rem; color: #9b8a78; }
.form-card { background: #f5e6f5; border-radius: 32px; padding: 42px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04); border: 1px solid #d4a0d4; max-width: 720px; margin: 0 auto; }
.form-group { margin-bottom: 26px; }
.form-group label { display: block; font-size: 1.1rem; font-weight: 500; color: #6a3e6a; margin-bottom: 8px; transition: color 0.3s ease; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 14px 18px; font-size: 1.05rem; border: 1px solid #d4a0d4; border-radius: 60px; background: #fff; outline: none; transition: all 0.3s ease; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #b87ab8; box-shadow: 0 0 0 3px rgba(180, 122, 180, 0.15); }
.form-group textarea { border-radius: 24px; resize: vertical; }
.form-row { display: flex; gap: 20px; margin-bottom: 26px; }
.form-row .form-group { flex: 1; margin-bottom: 0; }
.btn-submit { font-family: 'Caveat', sans-serif; display: block; width: 100%; padding: 15px; font-size: 1.4rem; font-weight: 500; color: #fff; background: #6db86d; border: none; border-radius: 60px; cursor: pointer; transition: all 0.3s ease; margin-top: 18px; }
.btn-submit:hover { background: #5aa05a; transform: translateY(-2px); }
.form-note { text-align: center; font-size: 1rem; color: #9b8a78; margin-top: 22px; }

@media (max-width: 768px) {
  .airy-container { padding: 0 20px; }
  .first-block-wrapper { padding: 20px 20px; }
  .corner-tl, .corner-tr, .corner-bl, .corner-br { width: 35px; height: 35px; }
  .form-row { flex-direction: column; gap: 0; }
  .form-card { padding: 24px; }
  .form-header { margin-top: 0; }
  .c2 { width: 300px; height: 300px; }
  .c1 { width: 200px; height: 200px; }
  .price-wrapper { flex-direction: column; }
  .price-info { width: 100%; }
  .shelves-photo { width: 100%; }
}
</style>