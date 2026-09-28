<script lang="ts" setup>
import { API_BASE, useF } from '@/core/api'
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue'

const { data: requests, refresh, loading } = useF('/req')

const form = reactive({
  id: null as number | null, userId: '', contact: '', link: '', comment: '',
  status: 'new' as 'new' | 'agreed' | 'rejected',
})

const modalElement = ref<HTMLElement | null>(null)
let modalInstance: any = null

// --- Фильтрация и Сортировка ---
const searchQuery = ref('')
const statusFilter = ref('')
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

const filteredRequests = computed(() => {
  let result = (requests.value || []) as any[]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      `${r.user_name || ''} ${r.user_surname || ''}`.toLowerCase().includes(q) ||
      (r.request_contact || '').toLowerCase().includes(q) ||
      (r.request_comment || '').toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) result = result.filter(r => r.request_status === statusFilter.value)
  if (sortField.value) result.sort((a, b) => compareValues(a[sortField.value!], b[sortField.value!], sortOrder.value))
  return result
})

onMounted(() => {
  document.title = 'Арт-уголок | ADMIN | Заявки'
  if (modalElement.value) {
    const bs = (window as any).bootstrap
    if (bs?.Modal) modalInstance = new bs.Modal(modalElement.value)
  }
})
onUnmounted(() => { modalInstance?.dispose?.() })

const openViewModal = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/req/id?id=${id}`)
    const data = await response.json()
    const req = data[0]
    form.id = req.request_id
    form.userId = req.user_name ? `${req.user_name} ${req.user_surname} (ID: ${req.fk_user})` : `ID: ${req.fk_user}`
    form.contact = req.request_contact || ''; form.link = req.request_link || ''; form.comment = req.request_comment || ''
    form.status = req.request_status
    document.getElementById('req_id_display')!.textContent = String(req.request_id)
    document.getElementById('req_link')!.setAttribute('href', form.link)
    document.getElementById('req_link')!.textContent = form.link || 'Ссылка не указана'
    modalInstance?.show()
  } catch (error) { console.error('Ошибка загрузки заявки:', error); alert('Не удалось загрузить данные заявки') }
}

const updateStatus = async () => {
  const btn = document.getElementById('saveReqBtn') as HTMLButtonElement
  btn.disabled = true; btn.textContent = 'Сохранение...'
  const formData = new FormData()
  formData.append('i d', String(form.id)); formData.append('status', form.status)
  try {
    const response = await fetch(`${API_BASE}/req/upd`, { method: 'POST', body: formData })
    if (!response.ok) throw new Error('Ошибка обновления')
    modalInstance?.hide(); refresh()
  } catch (error: any) { alert('Ошибка: ' + error.message); console.error(error) } 
  finally { btn.disabled = false; btn.textContent = 'Обновить статус' }
}

const statusBadgeClass = (status: string) => ({ new: 'bg-info', agreed: 'bg-success', rejected: 'bg-danger' }[status] || 'bg-secondary')
const statusText = (status: string) => ({ new: 'Новая', agreed: 'Согласовано', rejected: 'Отклонено' }[status] || status)
</script>

<template>
  <div class="pg">
    <div class="container mt-4 mb-5">
      <router-link :to="{name: 'admin'}" class="fs-5">&lt; Назад</router-link>
      <h2 class="mb-4">Заявки мастеров</h2>
      
      <!-- Панель фильтрации -->
      <div class="row g-3 mb-3">
        <div class="col-md-7">
          <input type="text" class="form-control" placeholder="Поиск по имени, контакту или комментарию..." v-model="searchQuery">
        </div>
        <div class="col-md-5">
          <select class="form-select" v-model="statusFilter">
            <option value="">Все статусы</option>
            <option value="new">Новая</option>
            <option value="agreed">Согласовано</option>
            <option value="rejected">Отклонено</option>
          </select>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th width="5%" class="sortable" @click="toggleSort('request_id')">ID {{ getSortIcon('request_id') }}</th>
                  <th width="20%">Дата / Пользователь</th>
                  <th width="20%">Контакт</th>
                  <th width="25%">Комментарий</th>
                  <th width="15%" class="sortable" @click="toggleSort('request_status')">Статус {{ getSortIcon('request_status') }}</th>
                  <th width="15%" class="text-end">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading"><td colspan="6" class="text-center py-4 text-muted">Загрузка...</td></tr>
                <tr v-else-if="filteredRequests.length === 0"><td colspan="6" class="text-center py-4 text-muted">Заявки не найдены</td></tr>
                <tr v-for="req in filteredRequests" :key="req.request_id">
                  <td>{{ req.request_id }}</td>
                  <td><small>{{ req.user_name ? `${req.user_name} ${req.user_surname}` : 'Гость' }} (ID: {{ req.fk_user }})</small></td>
                  <td>{{ req.request_contact }}</td>
                  <td><small class="text-muted">{{ req.request_comment ? req.request_comment.substring(0, 50) + '...' : '' }}</small></td>
                  <td><span class="badge" :class="statusBadgeClass(req.request_status)">{{ statusText(req.request_status) }}</span></td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary view-req-btn" @click="openViewModal(req.request_id)">👁 Просмотр</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно (без изменений) -->
    <div class="modal fade" id="requestModal" tabindex="-1" aria-hidden="true" ref="modalElement">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Просмотр заявки #<span id="req_id_display"></span></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="updateStatus">
            <div class="modal-body">
              <div class="mb-3"><label class="form-label text-muted small">Мастер (ID)</label><input type="text" class="form-control" :value="form.userId" readonly /></div>
              <div class="mb-3"><label class="form-label">Контакт для связи</label><input type="text" class="form-control" :value="form.contact" readonly /></div>
              <div class="mb-3"><label class="form-label">Ссылка на портфолио/соцсети</label><a id="req_link" :href="form.link" target="_blank" class="form-control-plaintext text-primary">{{ form.link || 'Ссылка не указана' }}</a></div>
              <div class="mb-3"><label class="form-label">Комментарий</label><textarea class="form-control" rows="3" :value="form.comment" readonly></textarea></div>
              <hr />
              <div class="mb-3">
                <label for="req_status" class="form-label fw-bold">Изменить статус заявки</label>
                <select class="form-select" id="req_status" v-model="form.status">
                  <option value="new">Новая</option><option value="agreed">Согласовано</option><option value="rejected">Отклонено</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" id="saveReqBtn">Обновить статус</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg { min-height: 200vh; }
.sortable { cursor: pointer; user-select: none; }
.sortable:hover { background-color: #e9ecef; }
</style>