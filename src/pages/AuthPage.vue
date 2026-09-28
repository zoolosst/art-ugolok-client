<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import type { AuthorizeData, RegisterData } from '@/types'
import { reactive, computed, watch, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { vMaska } from 'maska/vue'

const route = useRoute()
const userStore = useUserStore()

// --- Данные форм ---
const authFormData = reactive<AuthorizeData>({
  email: '',
  password: '',
})

const regFormData = reactive<RegisterData>({
  birthday: '',
  confirm: '',
  email: '',
  name: '',
  password: '',
  phone: '',
  surname: '',
  agree: false,
})

// --- Состояние валидации (для каждого поля) ---
const validation = reactive({
  authEmail: { valid: false, message: '', show: false },
  authPassword: { valid: false, message: '', show: false },
  regEmail: { valid: false, message: '', show: false },
  regPhone: { valid: false, message: '', show: false },
  regName: { valid: false, message: '', show: false },
  regSurname: { valid: false, message: '', show: false },
  regPassword: { valid: false, message: '', show: false },
  regConfirm: { valid: false, message: '', show: false },
  regAgree: { valid: false, message: '', show: false },
})

// --- Вспомогательные функции валидации ---

function validateEmail(value: string, field: 'authEmail' | 'regEmail') {
  const hasCyrillic = /[а-яА-ЯёЁ]/.test(value)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = !hasCyrillic && emailRegex.test(value)
  const message = !value
    ? ''
    : hasCyrillic
      ? 'Можно использовать только латиницу'
      : !emailRegex.test(value)
        ? 'Некорректный Email'
        : '✓ Корректно'
  validation[field].valid = isValid && value.length > 0
  validation[field].message = message
  validation[field].show = value.length > 0
  return validation[field].valid
}

function validatePhone(value: string) {
  const isValid = value.length === 18
  validation.regPhone.valid = isValid
  validation.regPhone.message = isValid ? '✓ Номер корректен' : 'Введите полный номер'
  validation.regPhone.show = value.length > 0
  return isValid
}

function validateName(value: string, field: 'regName' | 'regSurname') {
  // Только буквы (включая кириллицу) и пробелы
  const cleaned = value.replace(/[^а-яА-ЯёЁ\s]/g, '')
  const isValid = cleaned.length > 0 && cleaned === value // не содержит запрещённых символов
  validation[field].valid = isValid
  validation[field].message = isValid ? '✓ Корректно' : 'Только буквы'
  validation[field].show = value.length > 0
  return isValid
}

function validatePassword(value: string) {
  const isValid = value.length >= 6
  validation.regPassword.valid = isValid
  validation.regPassword.message = isValid ? '✓ Корректно' : `Мин. 6 симв. (сейчас ${value.length})`
  validation.regPassword.show = value.length > 0
  return isValid
}

function validateConfirm(value: string, password: string) {
  const isValid = value.length > 0 && value === password
  validation.regConfirm.valid = isValid
  validation.regConfirm.message = isValid
    ? '✓ Совпадает'
    : value.length === 0
      ? ''
      : 'Пароли не совпадают'
  validation.regConfirm.show = value.length > 0
  return isValid
}

function validateAuthPassword(value: string) {
  const isValid = value.length >= 6
  validation.authPassword.valid = isValid
  validation.authPassword.message = isValid
    ? '✓ Корректно'
    : `Мин. 6 симв. (сейчас ${value.length})`
  validation.authPassword.show = value.length > 0
  return isValid
}

// --- Обработчики ввода ---
const onAuthEmailInput = (value: string) => validateEmail(value, 'authEmail')
const onAuthPasswordInput = (value: string) => validateAuthPassword(value)
const onRegEmailInput = (value: string) => validateEmail(value, 'regEmail')
const onRegPhoneInput = (value: string) => validatePhone(value)
const onRegNameInput = (value: string) => validateName(value, 'regName')
const onRegSurnameInput = (value: string) => validateName(value, 'regSurname')
const onRegPasswordInput = (value: string) => {
  validatePassword(value)
  // при изменении пароля нужно перепроверить подтверждение, если оно уже введено
  if (regFormData.confirm) validateConfirm(regFormData.confirm, value)
}
const onRegConfirmInput = (value: string) => validateConfirm(value, regFormData.password)
const onAgreeChange = (checked: boolean) => {
  validation.regAgree.valid = checked
  validation.regAgree.show = true
  validation.regAgree.message = checked ? '✓ Согласие получено' : 'Необходимо согласие'
}

// --- Вычисляемые свойства для кнопок ---
const isAuthValid = computed(() => {
  return validation.authEmail.valid && validation.authPassword.valid
})

const isRegValid = computed(() => {
  return (
    validation.regEmail.valid &&
    validation.regPhone.valid &&
    validation.regName.valid &&
    validation.regSurname.valid &&
    validation.regPassword.valid &&
    validation.regConfirm.valid &&
    validation.regAgree.valid &&
    regFormData.birthday.trim() !== ''
  )
})

// При инициализации проверить согласие
watch(
  () => regFormData.agree,
  (val) => onAgreeChange(val),
)


onMounted(() => {
  document.title = 'Арт-уголок | Авторизация'
  document.body.style.overflowX = 'hidden'
})
onBeforeMount(() => {
  document.body.style.overflowX = ''
})
</script>

<template>
  <div id="pg">
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
    <main class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-6">
          <div class="auth-card">
            <!-- Табы -->
            <ul class="nav auth-tabs" id="authTab">
              <li class="nav-item">
                <a
                  class="nav-link auth-tab-link active"
                  id="login-tab"
                  data-bs-toggle="tab"
                  href="#login"
                  >Вход</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link auth-tab-link"
                  id="register-tab"
                  data-bs-toggle="tab"
                  href="#register"
                  >Регистрация</a
                >
              </li>
            </ul>

            <div class="tab-content">
              <!-- ВХОД -->
              <div class="tab-pane fade show active" id="login">
                <h3 class="auth-form-title">С возвращением! 👋</h3>
                <p class="auth-form-subtitle">Введите данные для доступа</p>

                <div v-if="route.query.lerr" class="text-danger">{{ route.query.lerr }}</div>

                <form novalidate @submit.prevent="userStore.authorize(authFormData)">
                  <div class="mb-3 auth-input-wrap">
                    <input
                      type="email"
                      class="form-control auth-custom-input"
                      :class="{
                        'is-valid-custom': validation.authEmail.valid && validation.authEmail.show,
                        'is-invalid-custom':
                          !validation.authEmail.valid && validation.authEmail.show,
                      }"
                      placeholder="Email"
                      v-model="authFormData.email"
                      @input="onAuthEmailInput(authFormData.email)"
                      required
                    />
                    <span
                      class="auth-hint"
                      :class="{
                        visible: validation.authEmail.show,
                        success: validation.authEmail.valid,
                        error: !validation.authEmail.valid,
                      }"
                      >{{ validation.authEmail.message }}</span
                    >
                  </div>

                  <div class="mb-4 auth-input-wrap">
                    <input
                      type="password"
                      id="login-pass"
                      class="form-control auth-custom-input"
                      :class="{
                        'is-valid-custom':
                          validation.authPassword.valid && validation.authPassword.show,
                        'is-invalid-custom':
                          !validation.authPassword.valid && validation.authPassword.show,
                      }"
                      placeholder="Пароль"
                      minlength="6"
                      v-model="authFormData.password"
                      @input="onAuthPasswordInput(authFormData.password)"
                      required
                    />
                    <span
                      class="auth-hint"
                      :class="{
                        visible: validation.authPassword.show,
                        success: validation.authPassword.valid,
                        error: !validation.authPassword.valid,
                      }"
                      >{{ validation.authPassword.message }}</span
                    >
                  </div>

                  <button
                    type="submit"
                    id="login-btn"
                    class="auth-btn-primary"
                    name="auth"
                    :disabled="!isAuthValid"
                  >
                    Войти
                  </button>
                </form>

                <div class="text-center mt-3">
                  <p style="font-size: 18px">
                    Еще не зарегистрированы?
                    <a
                      href="#register"
                      class="btn btn-link text-success fw-bold"
                      onclick="document.querySelector('#register-tab').click()"
                    >
                      Зарегистрироваться
                    </a>
                  </p>
                </div>
              </div>

              <!-- РЕГИСТРАЦИЯ -->
              <div class="tab-pane fade" id="register">
                <h3 class="auth-form-title">Создать аккаунт ✨</h3>
                <p class="auth-form-subtitle">Заполните форму ниже</p>

                <div v-if="route.query.rerr" class="text-danger">{{ route.query.rerr }}</div>

                <form @submit.prevent="userStore.register(regFormData)">
                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <input
                        type="text"
                        class="form-control auth-custom-input"
                        :class="{
                          'is-valid-custom': validation.regName.valid && validation.regName.show,
                          'is-invalid-custom': !validation.regName.valid && validation.regName.show,
                        }"
                        placeholder="Имя"
                        v-model="regFormData.name"
                        @input="onRegNameInput(regFormData.name)"
                        required
                      />
                    </div>
                    <div class="col-6">
                      <input
                        type="text"
                        class="form-control auth-custom-input"
                        :class="{
                          'is-valid-custom':
                            validation.regSurname.valid && validation.regSurname.show,
                          'is-invalid-custom':
                            !validation.regSurname.valid && validation.regSurname.show,
                        }"
                        placeholder="Фамилия"
                        v-model="regFormData.surname"
                        @input="onRegSurnameInput(regFormData.surname)"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3 auth-input-wrap">
                    <input
                      type="email"
                      class="form-control auth-custom-input"
                      :class="{
                        'is-valid-custom': validation.regEmail.valid && validation.regEmail.show,
                        'is-invalid-custom': !validation.regEmail.valid && validation.regEmail.show,
                      }"
                      placeholder="Email"
                      v-model="regFormData.email"
                      @input="onRegEmailInput(regFormData.email)"
                      required
                    />
                    <span
                      class="auth-hint"
                      :class="{
                        visible: validation.regEmail.show,
                        success: validation.regEmail.valid,
                        error: !validation.regEmail.valid,
                      }"
                      >{{ validation.regEmail.message }}</span
                    >
                  </div>

                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <input
                        type="tel"
                        class="form-control auth-custom-input"
                        :class="{
                          'is-valid-custom': validation.regPhone.valid && validation.regPhone.show,
                          'is-invalid-custom':
                            !validation.regPhone.valid && validation.regPhone.show,
                        }"
                        placeholder="+7 (___) ___-__-__"
                        maxlength="18"
                        v-model="regFormData.phone"
                        v-maska="'+7 (###) ###-##-##'"
                        @input="onRegPhoneInput(regFormData.phone)"
                        required
                      />
                      <span
                        class="auth-hint"
                        :class="{
                          visible: validation.regPhone.show,
                          success: validation.regPhone.valid,
                          error: !validation.regPhone.valid,
                        }"
                        >{{ validation.regPhone.message }}</span
                      >
                    </div>
                    <div class="col-6">
                      <input
                        type="date"
                        class="form-control auth-custom-input"
                        v-model="regFormData.birthday"
                        placeholder="Дата рождения"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3 auth-input-wrap">
                    <input
                      type="password"
                      id="reg-pass-1"
                      class="form-control auth-custom-input"
                      :class="{
                        'is-valid-custom':
                          validation.regPassword.valid && validation.regPassword.show,
                        'is-invalid-custom':
                          !validation.regPassword.valid && validation.regPassword.show,
                      }"
                      placeholder="Пароль"
                      minlength="6"
                      v-model="regFormData.password"
                      @input="onRegPasswordInput(regFormData.password)"
                      required
                    />
                    <span
                      class="auth-hint"
                      :class="{
                        visible: validation.regPassword.show,
                        success: validation.regPassword.valid,
                        error: !validation.regPassword.valid,
                      }"
                      >{{ validation.regPassword.message }}</span
                    >
                  </div>

                  <div class="mb-3 auth-input-wrap">
                    <input
                      type="password"
                      id="reg-pass-2"
                      class="form-control auth-custom-input"
                      :class="{
                        'is-valid-custom':
                          validation.regConfirm.valid && validation.regConfirm.show,
                        'is-invalid-custom':
                          !validation.regConfirm.valid && validation.regConfirm.show,
                      }"
                      placeholder="Повторите пароль"
                      minlength="6"
                      v-model="regFormData.confirm"
                      @input="onRegConfirmInput(regFormData.confirm)"
                      required
                    />
                    <span
                      class="auth-hint"
                      :class="{
                        visible: validation.regConfirm.show,
                        success: validation.regConfirm.valid,
                        error: !validation.regConfirm.valid,
                      }"
                      >{{ validation.regConfirm.message }}</span
                    >
                  </div>

                  <!-- ЧЕКБОКС СОГЛАШЕНИЯ -->
                  <div class="mb-4 form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      v-model="regFormData.agree"
                      id="agreementCheck"
                      @change="onAgreeChange(regFormData.agree)"
                      required
                    />
                    <label
                      class="form-check-label auth-agreement-label"
                      for="agreementCheck"
                      style="font-size: 16px"
                    >
                      Я согласен с
                      <a
                        href="#login"
                        data-bs-toggle="modal"
                        data-bs-target="#termsModal"
                        style="color: #1a181b"
                        >условиями обработки данных</a
                      >
                    </label>
                    <span
                      v-if="validation.regAgree.show && !validation.regAgree.valid"
                      class="text-danger d-block"
                      >{{ validation.regAgree.message }}</span
                    >
                  </div>

                  <button
                    type="submit"
                    id="reg-btn"
                    name="reg"
                    class="auth-btn-primary"
                    :disabled="!isRegValid"
                  >
                    Зарегистрироваться
                  </button>
                </form>

                <div class="row text-center mt-3">
                  <p class="text-muted" style="font-size: 18px">
                    Уже есть аккаунт?
                    <a
                      class="btn btn-link p-0 text-success fw-bold"
                      onclick="document.querySelector('#login-tab').click()"
                      >Войти</a
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Модальное окно соглашения -->
  <div class="modal fade" id="termsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold">Соглашение пользователя</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body pt-0">
          <p class="text-muted">
            Настоящее соглашение регулирует отношения между пользователем и сервисом «Арт-Уголок».
          </p>
          <p>1. Регистрируясь, вы подтверждаете достоверность предоставленных данных.</p>
          <p>2. Мы обязуемся не передавать ваши личные данные третьим лицам без согласия.</p>
          <p>3. Администрация вправе блокировать аккаунт при нарушении правил сообщества.</p>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button type="button" class="btn auth-btn-primary w-auto px-4" data-bs-dismiss="modal">
            Понятно
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ваши стили из предыдущего файла — без изменений */
#pg {
  min-height: 130vh;
}
input {
  -webkit-text-stroke: 0.3px #1a181b;
}
.auth-card {
  background: linear-gradient(135deg, #fde3dc, #fcdaff);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 4rem auto;
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.auth-form-title {
  text-align: center;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}
.auth-form-subtitle {
  text-align: center;
  color: #5a6c7d;
  font-size: 1rem;
  margin-bottom: 25px;
}
.auth-custom-input {
  padding: 10px 14px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  color: #333;
}
.auth-custom-input:focus {
  border-color: #88b09e;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(136, 176, 158, 0.2);
  outline: none;
}
.auth-custom-input.is-valid-custom {
  border-color: #198754;
  background-color: rgba(232, 245, 233, 0.9);
}
.auth-custom-input.is-invalid-custom {
  border-color: #dc3545;
  background-color: rgba(248, 215, 218, 0.9);
}
.auth-btn-primary {
  background: linear-gradient(135deg, #88b09e, #7aa892);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  width: 100%;
  transition: transform 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.auth-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(136, 176, 158, 0.5);
}
.auth-btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.auth-input-wrap {
  position: relative;
  overflow: visible;
}
.auth-hint {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  padding: 6px 12px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  z-index: 100;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  pointer-events: none;
}
.auth-hint.visible {
  opacity: 1;
  visibility: visible;
}
.auth-hint.success {
  color: #198754;
  background: #e6fffa;
  border-color: #b2f5ea;
}
.auth-hint.error {
  color: #dc3545;
  background: #fff5f5;
  border-color: #fed7d7;
}
.auth-tabs {
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}
.auth-tab-link {
  border: none;
  color: #5a6c7d;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 10px 10px 0 0;
  transition: color 0.2s;
}
.auth-tab-link:hover {
  color: #2c3e50;
}
.auth-tab-link.active {
  color: #2d3748;
  font-weight: 700;
  border-bottom: 3px solid #88b09e;
  background: transparent;
}
.auth-agreement-label {
  cursor: pointer;
  user-select: none;
  font-size: 0.9rem;
  color: #444;
}
.auth-agreement-label a {
  color: #6ecaa5;
  text-decoration: underline;
  font-weight: 600;
}
@media (max-width: 576px) {
  .auth-hint {
    position: static;
    transform: none;
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
    text-align: center;
  }
  .auth-card {
    padding: 25px;
  }
}
</style>
