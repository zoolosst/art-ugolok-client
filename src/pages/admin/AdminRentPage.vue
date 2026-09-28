<script lang="ts" setup>
import { API_BASE, useF } from '@/core/api'
import type { Rent, Shelf, User } from '@/types/models'
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue'

// --- Загрузка данных ---
const { data: rents, refresh, loading: rentsLoading } = useF('/rent')
const { data: shelves, loading: shelvesLoading } = useF('/shelf')
const { data: users, loading: usersLoading } = useF('/u')

// --- Доступные полки ---
const availableShelves = computed(() => {
  if (!shelves.value) return []
  return (shelves.value as any[]).filter((s: any) => s.shelf_current > 0)
})

// --- Состояние форм ---
const viewForm = reactive({
  id: null as number | null,
  shelfId: '',
  userId: '',
  expired: '',
  status: 'active' as 'active' | 'ended',
  week: 1,
})

const createForm = reactive({
  shelfId: null as number | null,
  week: 1,
  userId: null as number | null,
})

// ==========================================
// 1. ФИЛЬТРАЦИЯ И СОРТИРОВКА ТАБЛИЦЫ
// ==========================================
const searchQuery = ref('')
const statusFilter = ref('')
const sortField = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const toggleSort = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (field: string) => {
  if (sortField.value !== field) return '↕'
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

const compareValues = (a: any, b: any, order: 'asc' | 'desc') => {
  if (a === b) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return order === 'asc' ? a - b : b - a
  const strA = String(a).toLowerCase(), strB = String(b).toLowerCase()
  if (strA < strB) return order === 'asc' ? -1 : 1
  if (strA > strB) return order === 'asc' ? 1 : -1
  return 0
}

const filteredRents = computed(() => {
  let result = (rents.value || []) as any[]
  
  // Поиск
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      String(r.rent_id).includes(q) || 
      String(r.fk_user).includes(q) || 
      String(r.fk_shelf).includes(q)
    )
  }
  
  // Фильтр по статусу
  if (statusFilter.value) {
    result = result.filter(r => r.rent_status === statusFilter.value)
  }
  
  // Сортировка
  if (sortField.value) {
    result.sort((a, b) => compareValues(a[sortField.value!], b[sortField.value!], sortOrder.value))
  }
  
  return result
})

// ==========================================
// 2. ПОИСК ПОЛЬЗОВАТЕЛЕЙ В МОДАЛЬНОМ ОКНЕ
// ==========================================
const userSearchQuery = ref('')
const isUserDropdownOpen = ref(false)

const filteredUsers = computed(() => {
  if (!users.value) return []
  const q = userSearchQuery.value.toLowerCase().trim()
  if (!q) return users.value as User[]
  return (users.value as User[]).filter(u =>
    `${u.user_name} ${u.user_surname}`.toLowerCase().includes(q) ||
    String(u.user_id).includes(q)
  )
})

const selectUser = (user: User) => {
  createForm.userId = user.user_id
  userSearchQuery.value = `${user.user_name} ${user.user_surname} (ID: ${user.user_id})`
  isUserDropdownOpen.value = false
}

// --- Модальные окна ---
const viewModalElement = ref<HTMLElement | null>(null)
const createModalElement = ref<HTMLElement | null>(null)
let viewModalInstance: any = null
let createModalInstance: any = null

onMounted(() => {
  document.title = 'Арт-уголок | ADMIN | Аренды полок'
  const bs = (window as any).bootstrap
  if (!bs?.Modal) return
  if (viewModalElement.value) viewModalInstance = new bs.Modal(viewModalElement.value)
  if (createModalElement.value) createModalInstance = new bs.Modal(createModalElement.value)
})

onUnmounted(() => {
  viewModalInstance?.dispose?.()
  createModalInstance?.dispose?.()
})

// --- Логика просмотра/продления ---
const openViewModal = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/rent/id?id=${id}`)
    const data = await response.json()
    const rent = data[0]

    viewForm.id = rent.rent_id
    viewForm.shelfId = rent.fk_shelf
    viewForm.userId = rent.fk_user
    viewForm.expired = rent.rent_expired
    viewForm.status = rent.rent_status
    viewForm.week = 1

    document.getElementById('rent_id_display')!.textContent = String(rent.rent_id)
    document.getElementById('rent_shelf_display')!.textContent = `ID: ${rent.fk_shelf}`
    document.getElementById('rent_user_display')!.textContent = `ID: ${rent.fk_user}`
    document.getElementById('rent_expired_display')!.textContent = rent.rent_expired
    document.getElementById('rent_status_display')!.textContent = rent.rent_status === 'active' ? 'Активна' : 'Завершена'

    viewModalInstance?.show()
  } catch (error) {
    console.error('Ошибка загрузки аренды:', error)
    alert('Не удалось загрузить данные аренды')
  }
}

// --- Логика создания ---
const openCreateModal = () => {
  createForm.shelfId = null
  createForm.week = 1
  createForm.userId = null
  userSearchQuery.value = ''
  isUserDropdownOpen.value = false
  createModalInstance?.show()
}

const createRent = async () => {
  const btn = document.getElementById('createRentBtn') as HTMLButtonElement
  btn.disabled = true
  btn.textContent = 'Создание...'

  if (!createForm.shelfId || !createForm.userId) {
    alert('Выберите полку и пользователя')
    btn.disabled = false
    btn.textContent = 'Создать аренду'
    return
  }

  const formData = new FormData()
  formData.append('shelf', String(createForm.shelfId))
  formData.append('week', String(createForm.week))
  formData.append('user_id', String(createForm.userId))

  try {
    const response = await fetch(`${API_BASE}/rent`, { method: 'POST', body: formData })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Ошибка создания')
    
    createModalInstance?.hide()
    refresh()
    await refreshShelves()
  } catch (error: any) {
    alert('Ошибка: ' + error.message)
    console.error(error)
  } finally {
    btn.disabled = false
    btn.textContent = 'Создать аренду'
  }
}

const refreshShelves = async () => {
  try {
    const response = await fetch(`${API_BASE}/shelf`)
    shelves.value = await response.json()
  } catch (error) {
    console.error('Ошибка обновления полок:', error)
  }
}

// --- Логика продления ---
const extendRent = async () => {
  const btn = document.getElementById('extendRentBtn') as HTMLButtonElement
  btn.disabled = true
  btn.textContent = 'Продление...'

  const formData = new FormData()
  formData.append('id', String(viewForm.id))
  formData.append('week', String(viewForm.week))

  try {
    const response = await fetch(`${API_BASE}/rent/upd`, { method: 'POST', body: formData })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Ошибка продления')
    }
    viewModalInstance?.hide()
    refresh()
    await refreshShelves()
  } catch (error: any) {
    alert('Ошибка: ' + error.message)
    console.error(error)
  } finally {
    btn.disabled = false
    btn.textContent = 'Продлить'
  }
}

// --- Обработка истекших ---
const processExpired = async () => {
  if (!confirm('Обработать все истекшие аренды?')) return
  try {
    const response = await fetch(`${API_BASE}/rent/process`, { method: 'POST' })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Ошибка обработки')
    alert(result.message || 'Истекшие аренды обработаны')
    refresh()
    await refreshShelves()
  } catch (error: any) {
    alert('Ошибка: ' + error.message)
    console.error(error)
  }
}

// --- Хелперы ---
const statusBadgeClass = (status: string) => status === 'active' ? 'bg-success' : 'bg-secondary'
const statusText = (status: string) => status === 'active' ? 'Активна' : 'Завершена'
</script>

<template>
  <div class="pg">
    <div class="container mt-4 mb-5">
      <router-link :to="{name: 'admin'}" class="fs-5">&lt; Назад</router-link>
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 class="mb-0">Управление арендой полок</h2>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" @click="openCreateModal">
            <i class="bi bi-plus-lg"></i> Создать аренду
          </button>
          <button class="btn btn-warning" @click="processExpired">
            <i class="bi bi-clock-history"></i> Обработать истекшие
          </button>
        </div>
      </div>

      <!-- Панель фильтрации и сортировки -->
      <div class="row g-3 mb-3">
        <div class="col-md-7">
          <input type="text" class="form-control" placeholder="Поиск по ID аренды, пользователя или полки..." v-model="searchQuery">
        </div>
        <div class="col-md-5">
          <select class="form-select" v-model="statusFilter">
            <option value="">Все статусы</option>
            <option value="active">Активна</option>
            <option value="ended">Завершена</option>
          </select>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th width="5%" class="sortable" @click="toggleSort('rent_id')">ID {{ getSortIcon('rent_id') }}</th>
                  <th width="15%" class="sortable" @click="toggleSort('fk_shelf')">Полка (ID) {{ getSortIcon('fk_shelf') }}</th>
                  <th width="15%" class="sortable" @click="toggleSort('fk_user')">Пользователь (ID) {{ getSortIcon('fk_user') }}</th>
                  <th width="20%" class="sortable" @click="toggleSort('rent_expired')">Дата окончания {{ getSortIcon('rent_expired') }}</th>
                  <th width="15%" class="sortable" @click="toggleSort('rent_status')">Статус {{ getSortIcon('rent_status') }}</th>
                  <th width="30%" class="text-end">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="rentsLoading">
                  <td colspan="6" class="text-center py-4 text-muted">Загрузка...</td>
                </tr>
                <tr v-else-if="filteredRents.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">Аренды не найдены</td>
                </tr>
                <tr v-for="rent in filteredRents" :key="rent.rent_id">
                  <td>{{ rent.rent_id }}</td>
                  <td>{{ rent.fk_shelf }}</td>
                  <td>{{ rent.fk_user }}</td>
                  <td>{{ rent.rent_expired }}</td>
                  <td>
                    <span class="badge" :class="statusBadgeClass(rent.rent_status)">
                      {{ statusText(rent.rent_status) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" @click="openViewModal(rent.rent_id)">
                      📋 Просмотр
                    </button>
                    <button v-if="rent.rent_status === 'active'" class="btn btn-sm btn-outline-success" @click="openViewModal(rent.rent_id)">
                      ⏳ Продлить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно просмотра / продления -->
    <div class="modal fade" id="rentModal" tabindex="-1" aria-hidden="true" ref="viewModalElement">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Аренда #<span id="rent_id_display"></span></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label fw-bold">Полка</label><p><span id="rent_shelf_display"></span></p></div>
            <div class="mb-3"><label class="form-label fw-bold">Пользователь</label><p><span id="rent_user_display"></span></p></div>
            <div class="mb-3"><label class="form-label fw-bold">Дата окончания</label><p><span id="rent_expired_display"></span></p></div>
            <div class="mb-3"><label class="form-label fw-bold">Статус</label><p><span id="rent_status_display"></span></p></div>
            <hr />
            <div class="mb-3" v-if="viewForm.status === 'active'">
              <label for="rent_week" class="form-label">Продлить на (недель)</label>
              <input type="number" class="form-control" id="rent_week" v-model.number="viewForm.week" min="1" required />
            </div>
            <p v-else class="text-muted">Аренда завершена, продление невозможно.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            <button v-if="viewForm.status === 'active'" type="button" class="btn btn-success" id="extendRentBtn" @click="extendRent">Продлить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания аренды -->
    <div class="modal fade" id="createRentModal" tabindex="-1" aria-hidden="true" ref="createModalElement">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Создать аренду</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            
            <!-- БЛОК ПОИСКА ПОЛЬЗОВАТЕЛЯ -->
            <div class="mb-3 position-relative">
              <label class="form-label">Пользователь <span class="text-danger">*</span></label>
              <input
                type="text"
                class="form-control"
                v-model="userSearchQuery"
                placeholder="Начните вводить имя, фамилию или ID..."
                @focus="isUserDropdownOpen = true"
                @blur="setTimeout(() => isUserDropdownOpen = false, 200)"
                autocomplete="off"
              />
              <div
                v-if="isUserDropdownOpen"
                class="position-absolute w-100 bg-white border rounded-bottom shadow-sm user-dropdown"
              >
                <div
                  v-for="user in filteredUsers"
                  :key="user.user_id"
                  class="p-2 border-bottom user-dropdown-item"
                  @mousedown.prevent="selectUser(user)"
                >
                  <small>{{ user.user_name }} {{ user.user_surname }} (ID: {{ user.user_id }})</small>
                </div>
                <div v-if="filteredUsers.length === 0" class="p-2 text-muted small text-center">
                  Пользователи не найдены
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label for="shelf_select" class="form-label">Выберите полку <span class="text-danger">*</span></label>
              <select class="form-select" id="shelf_select" v-model="createForm.shelfId" required>
                <option value="">-- Выберите полку --</option>
                <option v-for="shelf in availableShelves" :key="shelf.shelf_id" :value="shelf.shelf_id">
                  Полка #{{ shelf.shelf_id }} (свободно: {{ shelf.shelf_current }})
                </option>
              </select>
              <div class="form-text" v-if="availableShelves.length === 0">Нет доступных полок для аренды.</div>
            </div>
            
            <div class="mb-3">
              <label for="create_week" class="form-label">Количество недель <span class="text-danger">*</span></label>
              <input type="number" class="form-control" id="create_week" v-model.number="createForm.week" min="1" required />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button
              type="button"
              class="btn btn-primary"
              id="createRentBtn"
              @click="createRent"
              :disabled="!createForm.shelfId || !createForm.userId || createForm.week < 1"
            >
              Создать аренду
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg { min-height: 200vh; }
.sortable { cursor: pointer; user-select: none; }
.sortable:hover { background-color: #e9ecef; }

/* Стили для кастомного выпадающего списка поиска */
.user-dropdown {
  z-index: 1050;
  max-height: 220px;
  overflow-y: auto;
  top: 100%;
  left: 0;
  margin-top: -1px;
}
.user-dropdown-item {
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}
.user-dropdown-item:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}
</style>