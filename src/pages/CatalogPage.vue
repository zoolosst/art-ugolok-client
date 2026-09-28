<script lang="ts" setup>
import ProductCard from '@/components/ProductCard.vue'
import { useF } from '@/core/api'
import { createFormData } from '@/core/authorize'
import { useUserStore } from '@/stores/user'
import type { CatalogFilters } from '@/types'
import type { Product } from '@/types/models'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const userStore = useUserStore()

const filters = reactive<CatalogFilters>({
  cat: 0,
  sort: 'default',
  min: 0,
  max: 100000,
  prompt: '',
})

const route = useRoute()

const { data: categoreis } = useF('/category')
const filteredUrl = computed(
  () =>
    `/p/filter?min=${filters.min}&max=${filters.max}${filters.cat !== 0 ? `&cat=${filters.cat}` : ''}${filters.sort !== 'default' ? `&ord=${filters.sort}` : ''}${filters.prompt.trim() !== '' ? `&s=${filters.prompt}` : ''}`,
)
const { data: products, loading: prodLoading, refresh } = useF(filteredUrl.value)
const { data: liked, refresh: refreshLiked } = useF('/p/favorite', {
  method: 'post',
  body: createFormData({ token: userStore.token, method: 'get' }),
})
const { data: cart, refresh: refreshCart } = useF('/p/cart', {
  method: 'post',
  body: createFormData({ token: userStore.token, method: 'get' }),
})

watch(filteredUrl, (newUrl) => {
  refresh(newUrl)
  console.log(newUrl)
})

onMounted(() => {
  if (route.query.cat) {
    filters.cat = route.query.cat as unknown as number
  }
  document.title = 'Арт-уголок | Каталог'
})

const page = ref(1);
const pageMax = 8;
const pageData = computed(() => {
  return (products.value as Product[]).filter((v, id) => id < page.value * pageMax && id >= (page.value - 1) * pageMax )
})

const pageBtns = computed(() => {
  const result = [];
  for(let i = 1; i < (products.value.length / pageMax) + 1; i++){
    result.push(i);
  }
  return result
})

const toggleCategory = (id: number) => (filters.cat = id)
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
      <div class="catalog-wrapper">
        <div class="catalog-container">
          <h1 class="catalog-title p-caveat">Каталог</h1>
          <p class="catalog-subtitle">Уникальные подарки ручной работы</p>

          <!-- ФИЛЬТРЫ -->
          <div class="filters-container">
            <div class="search-box">
              <input type="text" id="searchInput" placeholder="🔍 Поиск по названию..." v-model="filters.prompt" />
            </div>
            <div class="filter-group">
              <label>Сортировка</label>
              <select id="sortSelect" v-model="filters.sort">
                <option value="default">По умолчанию</option>
                <option value="asc">Название (А → Я)</option>
                <option value="desc">Название (Я → А)</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Цена от</label>
              <input type="number" id="priceMin" placeholder="0" v-model="filters.min" />
            </div>
            <div class="filter-group">
              <label>Цена до</label>
              <input type="number" id="priceMax" placeholder="100000" v-model="filters.max" />
            </div>
          </div>

          <!-- КАТЕГОРИИ -->
          <div class="category-buttons" id="categoryContainer">
            <button class="category-btn" @click="toggleCategory(0)" :class="{ active: filters.cat === 0 }"
              data-category="all">
              Все
            </button>
            <button v-for="(cat, index) in categoreis" @click="toggleCategory(cat.category_id)" :key="index"
              class="category-btn" :class="{ active: filters.cat === cat.category_id }"
              :data-category="cat.category_id">
              {{ cat.category_name }}
            </button>
          </div>

          <!-- ТОВАРЫ -->
          <div id="catalog-grid-container" class="catalog-grid" v-if="products">
            <ProductCard v-for="(prod, index) in pageData"
              :liked-list="userStore.isAuthorize ? (liked as Product[]) : []"
              :in-cart-list="userStore.isAuthorize ? (cart as Product[]) : []" @cart="refreshCart" @like="refreshLiked"
              :item="(prod as Product)" :key="index" />
            <div v-if="prodLoading" style="text-align: center; grid-column: 1/-1; padding: 40px">
              Загрузка...
            </div>
            <div v-if="products.length === 0" style="font-size: larger;">Ничего не найдено :(</div>
          </div>

          <!-- ПАГИНАЦИЯ -->
          <div class="pagination-wrapper" v-if="(products.length / pageMax) > 1" id="paginationWrapper">
            <div class="pagination">
              <button class="page-btn prev-btn" id="prevPageBtn" @click="page -= 1" :disabled="page === 1">‹</button>
              <div class="page-numbers" id="pageNumbers">
                <button class="page-btn" :class="{'page-btn-act': value === page }" @click="page = value" :disabled="value === page" v-for="value in pageBtns" :key="value">{{ value }}</button>
              </div>
              <button class="page-btn next-btn" id="nextPageBtn" @click="page += 1" :disabled="page >= (products.length / pageMax)">›</button>
            </div>
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

.catalog-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.catalog-container {
  padding: 30px 0;
  min-height: 60vh;
}

.catalog-title {
  font-family: 'Caveat', sans-serif;
  font-size: 3.2rem;
  color: #4a3728;
  margin-bottom: 10px;
  text-align: center;
}

.catalog-subtitle {
  text-align: center;
  color: #9b8a78;
  margin-bottom: 35px;
  font-size: 1.1rem;
}

/* ФИЛЬТРЫ */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 35px;
  background: #f3f3f3;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-box {
  flex: 2;
  min-width: 200px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-family: 'Manege', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
}

.search-box input:focus {
  border-color: #6ecaa5;
  box-shadow: 0 0 0 2px rgba(110, 202, 165, 0.2);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 150px;
}

.filter-group label {
  font-size: 0.75rem;
  color: #9b8a78;
  letter-spacing: 0.5px;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 40px;
  font-family: 'Manege', sans-serif;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  outline: none;
}

.price-range {
  display: flex;
  gap: 10px;
  align-items: center;
}

.price-range input {
  width: 100px;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
  justify-content: center;
}

.category-btn {
  background: #f0f0f0;
  border: none;
  border-radius: 40px;
  padding: 8px 24px;
  font-family: 'Manege', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4a5568;
}

.category-btn.active {
  background: #6ecaa5;
  color: white;
}

.category-btn:hover {
  background: #6ecaa5;
  color: white;
  transform: translateY(-2px);
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 25px;
}

.empty-catalog {
  text-align: center;
  padding: 50px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  border: 1px dashed #f5d76e;
  grid-column: 1/-1;
}

/* ПАГИНАЦИЯ */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  justify-content: center;
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

.page-numbers {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-number {
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  background: transparent;
  border: none;
  border-radius: 40px;
  font-family: 'Manege', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4a5568;
}

.page-number:hover {
  background: #f0f0f0;
}

.page-number.active {
  background: #6ecaa5;
  color: white;
}

.page-dots {
  color: #9b8a78;
  padding: 0 4px;
}

@media (max-width: 1100px) {
  .catalog-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .product-card-wrapper:hover .product-card {
    transform: scale(1.12);
  }
}

@media (max-width: 800px) {
  .catalog-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .price-range {
    flex-wrap: wrap;
  }
}

@media (max-width: 576px) {
  .catalog-wrapper {
    padding: 0 15px;
  }

  .catalog-container {
    padding: 20px 0;
  }

  .catalog-title {
    font-size: 2rem;
  }

  .catalog-grid {
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

  .product-card__btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .product-card-wrapper:hover .product-card {
    transform: scale(1.05);
  }

  .pagination {
    padding: 6px 12px;
    gap: 4px;
  }

  .page-btn,
  .page-number {
    width: 34px;
    height: 34px;
    font-size: 0.9rem;
  }
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

main {
  min-height: 150vh;
}

.page-btn-act {
  background-color: #6ecaa5;
  color: white;
}
</style>
