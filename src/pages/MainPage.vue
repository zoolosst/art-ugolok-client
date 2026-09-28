<script lang="ts" setup>
import RopeCarousel from '@/components/RopeCarousel.vue';
import { useF, image } from '@/core/api'

const { data: categories, loading: catLoading } = useF('/category')

document.title = 'Арт-уголок'
</script>

<template>
  <main>
    <div class="container">
      <!-- БЛОК 1 -->
      <div class="row style mt-md-2 justify-content-center">
        <div class="col-md-4 col-sm-4 align-items-center d-flex flex-column">
          <img src="/src/assets/img/main/index-block1.jpg" alt="" style="max-width: 300px" />
        </div>
        <div class="col-md-6 col-sm-8 d-flex align-items-center flex-column text-center">
          <h1 class="bold">
            Уникальные
            <span class="text-special" style="color: #ba81c7; -webkit-text-stroke: 0.1px #993ead">рукодельные
              игрушки</span>
          </h1>
          <p class="mt-md-3">
            Арт-Уголок - яркий атмосферный магазинчик подарков, сувениров и просто интересных вещей
            ручной работы! Мы уверены, что вы сможете найти идеальный подарок для себя и своих
            близких.
          </p>
          <router-link :to="{ name: 'catalog' }"><button class="btn btn-green rounded-pill mt-4">Посмотреть
              товары</button></router-link>
        </div>
      </div>

      <!-- БЛОК 2 -->
      <div class="row style mt-md-2 justify-content-center">
        <div class="col-md-6 col-sm-8 d-flex align-items-center flex-column text-center">
          <h1 class="bold">
            <span class="text-special" style="color: #59b38f; -webkit-text-stroke: 0.1px #30916a">Создаёте
            </span>
            креативные творения?
          </h1>
          <p class="mt-md-3">
            У нас вы можете забронировать полку для демонстрации собственных творений в нашем
            магазине! Он находится в самом центре Красноярска, так что каждый узнает о вас.
          </p>
          <router-link :to="{ name: 'rent' }"><button class="btn btn-purple rounded-pill mt-4">
              Узнать условия бронирования
            </button></router-link>
        </div>
        <div class="col-md-4 col-sm-4 align-items-center d-flex flex-column">
          <img src="/src/assets/img/main/index-block2.jpg" alt="" style="max-width: 340px; rotate: 15deg" />
        </div>
      </div>

      <!-- КАТЕГОРИИ ТОВАРОВ -->
      <div class="justify-content-center align-items-center text-center d-flex flex-column">
        <div style="height: 75px; overflow: hidden">
          <div class="circle5"></div>
        </div>
        <hr class="custom-hr" />
        <h2>Категории товаров</h2>
      </div>
      <div class="row mt-md-2 style">
        <rope-carousel :categories="categories" />
      </div>

      <!-- КОНТАКТЫ -->
      <div class="justify-content-center align-items-center text-center d-flex flex-column">
        <hr class="custom-hr" style="background-color: #f0e164" />
        <h2>Контакты</h2>
      </div>
      <div class="row mt-md-2 style">
        <div class="col-md-6 col-sm-6 justify-content-end">
          <div class="notes-wrapper">
            <div class="pink-note">
              <img src="/src/assets/img/main/pink-zametka.svg" alt="" style="max-width: 300px" />
            </div>
            <div class="note-item yellow-note">
              <div class="note-text">
                <p class="p-miama left">Часы работы</p>
                <br />
                <p class="text-center">ЕЖЕДНЕВНО с 11:00 до 21:00</p>
                <p class=""><small>*график работы в праздники смотрите в наших соц.сетях</small></p>
              </div>
              <img src="/src/assets/img/main/yellow-zametka.svg" alt="" style="width: 100%; max-width: 400px" />
            </div>
            <div class="pink-note2">
              <img src="/src/assets/img/main/pink-zametka.svg" alt="" style="max-width: 300px; transform: scaleX(-1)" />
            </div>
            <div class="note-item green-zametka">
              <div class="note-text">
                <p class="p-miama right">Адрес</p>
                <br />
                <p class="text-center">г. Красноярск, ул. Проспект Мира, дом 79, цокольный этаж</p>
              </div>
              <img src="/src/assets/img/main/green-zametka.svg" alt="" style="width: 100%; max-width: 370px" />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-4 phone-container d-flex flex-column">
          <p class="p-miama" style="text-decoration: underline; font-size: 30px">Мы на карте</p>
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A3a7673912f4fd0ab8e7aa0187c3d32fe7867fa2bababe7aca48739091ee6d8b2&amp;source=constructor"
            class=" " frameborder="0" style="width: 600px; height: 400px; border: 10px solid #a4d3c0">
          </iframe>
        </div>
      </div>

      <!-- СОЦИАЛЬНЫЕ СЕТИ -->
      <div class="justify-content-center align-items-center text-center d-flex flex-column">
        <hr class="custom-hr" style="background-color: #993ead" />
        <h2>Социальные сети</h2>
      </div>
      <div class="row mt-md-2 style justify-content-center">
        <!-- КАРТОЧКА 1 -->
        <div class="col-md-4">
          <a href="https://vk.com/art_ygolok24" class="flip-link-wrapper">
            <div class="flip-inner">
              <!-- ЛИЦЕВАЯ СТОРОНА -->
              <div class="flip-front card-left text-center">
                <img src="/src/assets/img/main/vk.svg" alt="" style="max-width: 70px" />
                <p class="h5 mb-2">Вконтакте</p>
                <p>
                  <small>Следите за новинками быстрее всех! Здесь приятная атмосфера, качественные
                    фотографии, а также видео с “Секретами закулисья”, где авторы показывают - как
                    они создают свои работы. Скорее заходи!</small>
                </p>
                <img src="/src/assets/img/main/click.svg" alt="" style="max-width: 45px" class="ms-auto d-block mt-2" />
              </div>
              <!-- ОБРАТНАЯ СТОРОНА -->
              <div class="flip-back left">
                <img src="/src/assets/img/main/vk-qr-код.jpg" alt="" />
              </div>
            </div>
          </a>
        </div>

        <!-- КАРТОЧКА 2: МАКС -->
        <div class="col-md-4">
          <!-- Обернули в ссылку -->
          <a href="https://max.ru/join/DawvDdpdkuuYGmaOtJyGpxDZRWs6YnyEG-CuO4ML0EA" class="flip-link-wrapper">
            <div class="flip-inner">
              <!-- ЛИЦЕВАЯ СТОРОНА -->
              <div class="flip-front card-right text-center">
                <img src="/src/assets/img/main/MAX.svg" alt="" style="max-width: 70px" />
                <p class="h5 mb-2">Макс</p>
                <p>
                  <small>Эксклюзивные розыгрыши, которые мы проводим время от времени, чтобы порадовать
                    вас! Интересные новинки магазина, актуальная информация и добродушеая атмосфера,
                    будем рады вас здесь видеть.</small>
                </p>
                <img src="/src/assets/img/main/click.svg" alt="" style="max-width: 45px" class="ms-auto d-block mt-2" />
              </div>
              <!-- ОБРАТНАЯ СТОРОНА -->
              <div class="flip-back right">
                <!-- Замените путь на вашу картинку для задней стороны -->
                <img src="/src/assets/img/main/max-qr-code.png" alt="" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>
