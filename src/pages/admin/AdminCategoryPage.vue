<script lang="ts" setup>
import { image, API_BASE, useF } from '@/core/api'
import type { Category } from '@/types/models'
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue'

const { data, refresh, loading } = useF('/category')

const form = reactive({ id: null as number | null, name: '', description: '', photo: null as File | null, photoPreview: '' })
const modalElement = ref<HTMLElement | null>(null)
let modalInstance: any = null

// --- Фильтрация и Сортировка ---
const searchQuery = ref('')
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

const filteredCategories = computed(() => {
  let result = (data.value || []) as any[]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => (c.category_name || '').toLowerCase().includes(q) || (c.category_description || '').toLowerCase().includes(q))
  }
  if (sortField.value) result.sort((a, b) => compareValues(a[sortField.value!], b[sortField.value!], sortOrder.value))
  return result
})

onMounted(() => {
  document.title = 'Арт-уголок | ADMIN | Категории товаров'
  if (modalElement.value) {
    const bs = (window as any).bootstrap
    if (bs && bs.Modal) modalInstance = new bs.Modal(modalElement.value)
  }
})
onUnmounted(() => { if (modalInstance) modalInstance.dispose?.() })

const resetForm = () => {
  form.id = null; form.name = ''; form.description = ''; form.photo = null; form.photoPreview = ''
  const fileInput = document.getElementById('category_photo') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const openAddModal = () => {
  resetForm()
  document.getElementById('categoryModalLabel')!.textContent = 'Добавить категорию'
  document.getElementById('saveCategoryBtn')!.textContent = 'Сохранить'
  modalInstance?.show()
}

const openEditModal = (category: Category) => {
  resetForm()
  form.id = category.category_id; form.name = category.category_name; form.description = category.category_description || ''
  form.photoPreview = category.category_photo && category.category_photo !== '***' ? image(category.category_photo) : ''
  document.getElementById('categoryModalLabel')!.textContent = 'Редактировать категорию'
  document.getElementById('saveCategoryBtn')!.textContent = 'Сохранить изменения'
  modalInstance?.show()
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]; form.photo = file
    const reader = new FileReader()
    reader.onload = (e) => { form.photoPreview = e.target?.result as string }
    reader.readAsDataURL(file)
  } else { form.photo = null }
}

const saveCategory = async () => {
  const btn = document.getElementById('saveCategoryBtn') as HTMLButtonElement
  btn.disabled = true; btn.textContent = 'Сохранение...'
  const formData = new FormData()
  formData.append('name', form.name); formData.append('description', form.description)
  if (form.id) formData.append('id', String(form.id))
  if (form.photo) formData.append('photo', form.photo)
  const url = form.id ? '/category/upd' : '/category/add'
  try {
    const response = await fetch(`${API_BASE}${url}`, { method: 'POST', body: formData })
    const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Ошибка сохранения')
    modalInstance?.hide(); resetForm(); refresh()
  } catch (error: any) { alert('Ошибка: ' + error.message); console.error(error) } 
  finally { btn.disabled = false; btn.textContent = form.id ? 'Сохранить изменения' : 'Сохранить' }
}

const deleteCategory = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return
  try {
    const formData = new FormData(); formData.append('id', String(id))
    const response = await fetch(`${API_BASE}/category/del`, { method: 'POST', body: formData })
    if (!response.ok) throw new Error('Ошибка удаления')
    refresh()
  } catch (error: any) { alert('Ошибка: ' + error.message); console.error(error) }
}
</script>

<template>
  <div class="pg">
    <div class="container mt-4 mb-5">
      <router-link :to="{name: 'admin'}" class="fs-5">&lt; Назад</router-link>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0">Управление категориями</h2>
        <button class="btn btn-primary" @click="openAddModal"><i class="bi bi-plus-lg"></i> Добавить категорию</button>
      </div>
      
      <!-- Панель фильтрации -->
      <div class="row g-3 mb-3">
        <div class="col-md-12">
          <input type="text" class="form-control" placeholder="Поиск по названию или описанию..." v-model="searchQuery">
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th width="5%" class="sortable" @click="toggleSort('category_id')">ID {{ getSortIcon('category_id') }}</th>
                  <th width="10%">Фото</th>
                  <th width="25%" class="sortable" @click="toggleSort('category_name')">Название {{ getSortIcon('category_name') }}</th>
                  <th width="40%">Описание</th>
                  <th width="20%" class="text-end">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading"><td colspan="5" class="text-center py-4 text-muted">Загрузка...</td></tr>
                <tr v-else-if="filteredCategories.length === 0"><td colspan="5" class="text-center py-4 text-muted">Категории не найдены</td></tr>
                <tr v-for="cat in filteredCategories" :key="cat.category_id">
                  <td>{{ cat.category_id }}</td>
                  <td>
                    <img v-if="cat.category_photo && cat.category_photo !== '***'" :src="image(cat.category_photo)" width="60" height="60" class="rounded" :alt="cat.category_name" />
                    <span v-else class="text-muted small">Нет фото</span>
                  </td>
                  <td class="fw-semibold">{{ cat.category_name }}</td>
                  <td class="text-muted small">{{ cat.category_description }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" @click="openEditModal(cat)">✎</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteCategory(cat.category_id)">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно (без изменений) -->
    <div class="modal fade" id="categoryModal" tabindex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true" ref="modalElement">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="categoryModalLabel">Добавить категорию</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form @submit.prevent="saveCategory" enctype="multipart/form-data">
          <div class="modal-body">
            <div class="mb-3">
              <label for="category_name" class="form-label">Название <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="category_name" v-model="form.name" required maxlength="64" />
            </div>
            <div class="mb-3">
              <label for="category_description" class="form-label">Описание</label>
              <textarea class="form-control" id="category_description" v-model="form.description" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label for="category_photo" class="form-label">Фото</label>
              <input type="file" class="form-control" id="category_photo" accept="image/*" @change="onFileChange" />
              <div class="form-text" v-if="form.id">Оставьте пустым, чтобы не менять фото.</div>
              <img v-if="form.photoPreview" :src="form.photoPreview" alt="Предпросмотр" class="img-thumbnail mt-2" style="max-width: 150px" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" class="btn btn-success" id="saveCategoryBtn">Сохранить</button>
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