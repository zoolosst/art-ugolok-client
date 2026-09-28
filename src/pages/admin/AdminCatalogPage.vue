<script lang="ts" setup>
import { image, API_BASE, useF } from '@/core/api'
import type { Category } from '@/types/models'
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue'

const { data: products, refresh: refreshProducts, loading: productsLoading } = useF('/p')
const { data: categories } = useF('/category')

const form = reactive({
  id: null as number | null, name: '', description: '', price: null as number | null,
  category_id: null as number | null, photos: [] as File[], photoPreviews: [] as string[],
})

const modalElement = ref<HTMLElement | null>(null)
let modalInstance: any = null

// --- Фильтрация и Сортировка ---
const searchQuery = ref('')
const categoryFilter = ref<number | string>('')
const sortField = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const toggleSort = (field: string) => {
  if (sortField.value === field) sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  else { sortField.value = field; sortOrder.value = 'asc' }
}
const getSortIcon = (field: string) => sortField.value !== field ? '↕' : (sortOrder.value === 'asc' ? '↑' : '↓')
const compareValues = (a: any, b: any, order: 'asc' | 'desc') => {
  if (a === b) return 0; if (a == null) return 1; if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return order === 'asc' ? a - b : b - a
  const strA = String(a).toLowerCase(), strB = String(b).toLowerCase()
  return strA < strB ? (order === 'asc' ? -1 : 1) : (strA > strB ? (order === 'asc' ? 1 : -1) : 0)
}

const filteredProducts = computed(() => {
  let result = (products.value || []) as any[]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => (p.product_name || '').toLowerCase().includes(q) || (p.product_description || '').toLowerCase().includes(q))
  }
  if (categoryFilter.value !== '') result = result.filter(p => p.fk_category === Number(categoryFilter.value))
  if (sortField.value) result.sort((a, b) => compareValues(a[sortField.value!], b[sortField.value!], sortOrder.value))
  return result
})

onMounted(() => {
  document.title = 'Арт-уголок | ADMIN | Каталог товаров'
  if (modalElement.value) {
    const bs = (window as any).bootstrap
    if (bs?.Modal) modalInstance = new bs.Modal(modalElement.value)
  }
})
onUnmounted(() => { modalInstance?.dispose?.() })

const resetForm = () => {
  form.id = null; form.name = ''; form.description = ''; form.price = null; form.category_id = null
  form.photos = []; form.photoPreviews = []
  const fileInput = document.getElementById('product_photos') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const openAddModal = () => {
  resetForm()
  const label = document.getElementById('productModalLabel'); const btn = document.getElementById('saveProductBtn')
  if (label) label.textContent = 'Добавить товар'; if (btn) btn.textContent = 'Сохранить'
  modalInstance?.show()
}

const openEditModal = (product: any) => {
  resetForm()
  form.id = product.product_id; form.name = product.product_name; form.description = product.product_description || ''
  form.price = product.product_price; form.category_id = product.fk_category
  let existingPhotos: string[] = []
  if (product.product_photo) {
    if (typeof product.product_photo === 'string') existingPhotos = product.product_photo.split(',').map((s: string) => s.trim()).filter(Boolean)
    else if (Array.isArray(product.product_photo)) existingPhotos = product.product_photo
  }
  form.photoPreviews = existingPhotos.map((p: string) => image(p))
  const label = document.getElementById('productModalLabel'); const btn = document.getElementById('saveProductBtn')
  if (label) label.textContent = 'Редактировать товар'; if (btn) btn.textContent = 'Сохранить изменения'
  modalInstance?.show()
}

const onFilesChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const newFiles = Array.from(input.files); form.photos.push(...newFiles)
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => { form.photoPreviews.push(e.target?.result as string) }
      reader.readAsDataURL(file)
    })
    input.value = '' 
  }
}

const removePhotoPreview = (index: number) => { form.photoPreviews.splice(index, 1); form.photos.splice(index, 1) }

const saveProduct = async () => {
  const btn = document.getElementById('saveProductBtn') as HTMLButtonElement; if (!btn) return
  btn.disabled = true; btn.textContent = 'Сохранение...'
  const formData = new FormData()
  formData.append('name', form.name); formData.append('description', form.description || '')
  formData.append('price', String(form.price ?? 0)); formData.append('category', String(form.category_id ?? ''))
  if (form.id) formData.append('id', String(form.id))
  form.photos.forEach((photo) => { formData.append('photos[]', photo) })
  const url = form.id ? '/p/upd' : '/p/add'; const fullUrl = `${API_BASE}${url}`
  try {
    const response = await fetch(fullUrl, { method: 'POST', body: formData })
    const result = await response.json(); if (!response.ok) throw new Error(result.message || `Ошибка сервера (${response.status})`)
    modalInstance?.hide(); resetForm(); refreshProducts()
  } catch (error: any) { console.error('Save error:', error); alert('Ошибка: ' + error.message) } 
  finally { btn.disabled = false; btn.textContent = form.id ? 'Сохранить изменения' : 'Сохранить' }
}

const deleteProduct = async (id: number) => {
  if (!confirm('Удалить этот товар?')) return
  try {
    const formData = new FormData(); formData.append('id', String(id))
    const response = await fetch(`${API_BASE}/p/delete`, { method: 'POST', body: formData })
    if (!response.ok) throw new Error('Ошибка удаления')
    refreshProducts()
  } catch (error: any) { alert('Ошибка: ' + error.message); console.error(error) } 
}
</script>

<template>
  <div class="pg">
    <div class="container mt-4 mb-5">
      <router-link :to="{name: 'admin'}" class="fs-5">&lt; Назад</router-link>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Управление товарами</h2>
        <button class="btn btn-primary" @click="openAddModal"><i class="bi bi-plus-lg"></i> Добавить товар</button>
      </div>
      
      <!-- Панель фильтрации -->
      <div class="row g-3 mb-3">
        <div class="col-md-7">
          <input type="text" class="form-control" placeholder="Поиск по названию или описанию..." v-model="searchQuery">
        </div>
        <div class="col-md-5">
          <select class="form-select" v-model="categoryFilter">
            <option value="">Все категории</option>
            <option v-for="cat in categories as Category[]" :key="cat.category_id" :value="cat.category_id">{{ cat.category_name }}</option>
          </select>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th width="5%" class="sortable" @click="toggleSort('product_id')">ID {{ getSortIcon('product_id') }}</th>
                  <th width="10%">Фото</th>
                  <th width="25%" class="sortable" @click="toggleSort('product_name')">Название {{ getSortIcon('product_name') }}</th>
                  <th width="15%" class="sortable" @click="toggleSort('product_price')">Цена {{ getSortIcon('product_price') }}</th>
                  <th width="25%">Категория</th>
                  <th width="20%" class="text-end">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="productsLoading"><td colspan="6" class="text-center py-4 text-muted">Загрузка...</td></tr>
                <tr v-else-if="filteredProducts.length === 0"><td colspan="6" class="text-center py-4 text-muted">Товары не найдены</td></tr>
                <tr v-for="prod in filteredProducts" :key="prod.product_id">
                  <td>{{ prod.product_id }}</td>
                  <td>
                    <img v-if="prod.product_photo && prod.product_photo !== '***'" :src="image(prod.product_photo.split(',')[0].trim())" width="50" height="50" class="rounded" :alt="prod.product_name" />
                    <span v-else class="text-muted small">Нет фото</span>
                  </td>
                  <td class="fw-semibold">{{ prod.product_name }}</td>
                  <td>{{ Number(prod.product_price).toLocaleString() }} ₽</td>
                  <td><span class="badge bg-secondary">{{ prod.category_name || 'Без категории' }}</span></td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" @click="openEditModal(prod)">✎</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(prod.product_id)">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно (без изменений) -->
    <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true" ref="modalElement">
      <div class="modal-dialog modal-lg"><div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="productModalLabel">Добавить товар</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="saveProduct" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-8">
                <div class="mb-3">
                  <label for="product_name" class="form-label">Название <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="product_name" v-model="form.name" required maxlength="128" />
                </div>
                <div class="mb-3">
                  <label for="product_description" class="form-label">Описание</label>
                  <textarea class="form-control" id="product_description" v-model="form.description" rows="4"></textarea>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="product_price" class="form-label">Цена (руб.) <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="product_price" v-model.number="form.price" required min="0" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="product_category" class="form-label">Категория <span class="text-danger">*</span></label>
                    <select class="form-select" id="product_category" v-model="form.category_id" required>
                      <option value="">Выберите категорию...</option>
                      <option v-for="cat in categories as Category[]" :key="cat.category_id" :value="cat.category_id">{{ cat.category_name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="mb-3">
                  <label for="product_photos" class="form-label">Фотографии</label>
                  <input type="file" class="form-control" id="product_photos" accept="image/*" multiple @change="onFilesChange" />
                  <div class="form-text small mt-1" v-if="form.id">Новые фото добавятся к существующим.</div>
                  <div class="mt-3 d-flex flex-wrap gap-2">
                    <div v-for="(src, index) in form.photoPreviews" :key="index" class="position-relative" style="width: 80px; height: 80px;">
                      <img :src="src" alt="Preview" class="img-fluid rounded border" style="width: 100%; height: 100%; object-fit: cover;" />
                      <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 translate-middle bg-danger rounded-circle" style="font-size: 0.5rem; padding: 4px;" @click="removePhotoPreview(index)"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" class="btn btn-success" id="saveProductBtn">Сохранить</button>
          </div>
        </form>
      </div></div>
    </div>
  </div>
</template>

<style scoped>
.pg { min-height: 200vh; }
.table img { object-fit: cover; border-radius: 4px; border: 1px solid #dee2e6; }
.sortable { cursor: pointer; user-select: none; }
.sortable:hover { background-color: #e9ecef; }
</style>