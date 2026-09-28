<script lang="ts" setup>
document.title = 'Арт-уголок | Доставка'
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
      <div class="delivery-wrapper">
        <div class="delivery-container">
          <h1 class="delivery-title p-caveat">О доставке</h1>
          <p class="delivery-subtitle">Как получить ваш заказ быстро и удобно</p>

          <!-- СПОСОБЫ ДОСТАВКИ -->
          <div class="delivery-methods">
            <!-- Самовывоз -->
            <div class="delivery-card">
              <div class="delivery-icon">🏪</div>
              <h2>Самовывоз</h2>
              <p>
                Вы можете забрать заказ самостоятельно в нашем магазине. Этот способ абсолютно
                бесплатный и позволяет сразу получить товар.
              </p>
              <h3>Адрес магазина:</h3>
              <div class="address">📍 г. Красноярск, пр-т Мира, д. 79</div>
              <h3>Как происходит:</h3>
              <ul>
                <li>Оформляете заказ на сайте, выбираете «Самовывоз»</li>
                <li>Ожидаете уведомление о готовности заказа (обычно в течение 24 часов)</li>
                <li>Приезжаете в магазин, называете номер заказа и забираете товар</li>
              </ul>
              <p style="margin-top: 10px; font-size: 0.95rem; color: #6ecaa5">✓ Бесплатно</p>
            </div>

            <!-- Доставка курьером / почтой -->
            <div class="delivery-card">
              <div class="delivery-icon">🚚</div>
              <h2>Доставка</h2>
              <p>
                Заказ отправляется транспортной компанией на выбор. После оформления менеджер
                свяжется с вами для уточнения адреса и расчёта точной стоимости.
              </p>

              <h3>Службы доставки:</h3>
              <ul>
                <li>
                  <strong>СДЭК</strong> — быстрая доставка по России, пункты выдачи и курьер до
                  двери
                </li>
                <li><strong>Почта России</strong> — доступная доставка в любой населённый пункт</li>
              </ul>

              <h3>Что нужно сделать:</h3>
              <ul>
                <li>При оформлении заказа выберите «Доставка курьером»</li>
                <li>Укажите удобную транспортную компанию (СДЭК или Почта России)</li>
                <li>Введите ваш точный адрес (город, улица, дом, квартира, индекс)</li>
              </ul>

              <p style="margin-top: 10px; font-size: 0.95rem; color: #9b8a78">
                📞 После заказа менеджер свяжется с вами, чтобы уточнить адрес и сообщить пункт
                выдачи и примерную дату доставки. Адрес будет сохранён в заказе в блоке "История
                заказов" в вашем профиле.
              </p>
            </div>
          </div>

          <!-- Блок с процессом после заказа -->
          <div class="info-block">
            <h3>📦 Что происходит после оформления заказа?</h3>
            <p>Мы заботимся о том, чтобы вы всегда знали, где находится ваш заказ</p>
            <div class="info-grid">
              <div class="info-item">
                <div class="emoji">✅</div>
                <h4>Подтверждение</h4>
                <p>
                  Менеджер связывается с вами в течение 24 часов для подтверждения заказа и
                  уточнения адреса
                </p>
              </div>
              <div class="info-item">
                <div class="emoji">📦</div>
                <h4>Отправка</h4>
                <p>Заказ передаётся выбранной службе доставки (СДЭК или Почта России)</p>
              </div>
              <div class="info-item">
                <div class="emoji">📍</div>
                <h4>Отслеживание</h4>
                <p>
                  Менеджер отправит вам на почту или номер телефона трек-номер, с помощью которого
                  можно отследить заказ в любой момент
                </p>
              </div>
            </div>
          </div>

          <!-- Доп. информация об адресе в профиле -->
          <div class="info-block" style="background: #fff8e7; margin-top: 30px">
            <h3>📋 Где будет указан адрес доставки?</h3>
            <p>
              После оформления заказа с доставкой, введённый вами адрес сохраняется в
              <strong>истории заказов</strong> в вашем <strong>личном кабинете</strong>. Как только
              с вами свяжется менеджер он поменяет ваш адрес на тот, куда будет отправлен ваш заказ,
              чтобы вы всегда могли вспомнить нужный адрес.
            </p>
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

.delivery-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.delivery-container {
  padding: 30px 0;
  min-height: 60vh;
}

.delivery-title {
  font-family: 'Caveat', sans-serif;
  font-size: 3.2rem;
  color: #4a3728;
  margin-bottom: 10px;
  text-align: center;
}

.delivery-subtitle {
  text-align: center;
  color: #9b8a78;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

/* Карточки способов доставки */
.delivery-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 50px;
}

.delivery-card {
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border: 1px solid #f0e6d8;
}

.delivery-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
}

.delivery-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.delivery-card h2 {
  font-family: 'Caveat', cursive;
  font-size: 1.8rem;
  color: #4a3728;
  margin-bottom: 15px;
}

.delivery-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #6ecaa5;
  margin: 15px 0 10px;
}

.delivery-card p {
  color: #6b5b4f;
  line-height: 1.5;
  margin-bottom: 10px;
}

.delivery-card ul {
  padding-left: 20px;
  color: #6b5b4f;
}

.delivery-card li {
  margin-bottom: 8px;
}

.delivery-card .address {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 12px;
  margin: 15px 0;
  font-family: monospace;
  font-size: 1rem;
}

/* Блок с информацией об отслеживании */
.info-block {
  background: #f5e6f8;
  border-radius: 24px;
  padding: 30px;
  margin-top: 30px;
  text-align: center;
}

.info-block h3 {
  font-family: 'Caveat', cursive;
  font-size: 1.8rem;
  color: #4a3728;
  margin-bottom: 15px;
}

.info-block p {
  color: #6b5b4f;
  max-width: 600px;
  margin: 0 auto;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 25px;
}

.info-item {
  background: white;
  padding: 20px;
  border-radius: 16px;
}

.info-item .emoji {
  font-size: 2rem;
  margin-bottom: 10px;
}

.info-item h4 {
  font-weight: 600;
  color: #4a3728;
  margin-bottom: 8px;
}

.info-item p {
  font-size: 0.85rem;
  color: #9b8a78;
}

/* Как оформить заказ */
.order-steps {
  background: white;
  border-radius: 24px;
  padding: 30px;
  margin-top: 40px;
  border: 1px solid #f0e6d8;
}

.order-steps h3 {
  font-family: 'Caveat', cursive;
  font-size: 1.8rem;
  color: #4a3728;
  text-align: center;
  margin-bottom: 25px;
}

.steps-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.step {
  text-align: center;
}

.step-number {
  width: 40px;
  height: 40px;
  background: #6ecaa5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 auto 12px;
}

.step h4 {
  font-weight: 600;
  margin-bottom: 8px;
}

.step p {
  font-size: 0.85rem;
  color: #9b8a78;
}

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
</style>
