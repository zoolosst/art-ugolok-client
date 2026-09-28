<script lang="ts" setup>
import { API_BASE, useF } from '@/core/api'
import type { Order } from '@/types/models'
import { reactive, ref, onMounted, onUnmounted, computed } from 'vue'

const { data: orders, refresh, loading } = useF('/order')

const form = reactive({
  id: null as number | null, summary: 0, date: '', deliver: '', address: '',
  status: 'assembly' as Order['order_status'], payment: 'cash' as Order['order_payment'],
})

const modalElement = ref<HTMLElement | null>(null)
let modalInstance: any = null

// --- Фильтрация и Сортировка ---
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

const filteredOrders = computed(() => {
  let result = (orders.value || []) as any[]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(o => String(o.order_id).includes(q) || (o.order_address || '').toLowerCase().includes(q))
  }
  if (statusFilter.value) result = result.filter(o => o.order_status === statusFilter.value)
  if (sortField.value) result.sort((a, b) => compareValues(a[sortField.value!], b[sortField.value!], sortOrder.value))
  return result
})

onMounted(() => {
  document.title = 'Арт-уголок | ADMIN | Заказы'
  if (modalElement.value) {
    const bs = (window as any).bootstrap
    if (bs?.Modal) modalInstance = new bs.Modal(modalElement.value)
  }
})
onUnmounted(() => { modalInstance?.dispose?.() })

const openViewModal = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/order/id?id=${id}`)
    const data = await response.json()
    const ord = data[0]
    form.id = ord.order_id; form.summary = ord.order_summary; form.date = ord.order_date
    form.deliver = ord.order_deliver === 'shop' ? 'Самовывоз' : 'Доставка'
    form.address = ord.order_address || 'Не требуется (самовывоз)'
    form.status = ord.order_status; form.payment = ord.order_payment
    document.getElementById('ord_id_display')!.textContent = String(ord.order_id)
    document.getElementById('ord_summary')!.textContent = Number(ord.order_summary).toLocaleString()
    document.getElementById('ord_date')!.textContent = ord.order_date
    document.getElementById('ord_deliver')!.textContent = ord.order_deliver === 'shop' ? 'Самовывоз' : 'Доставка'
    document.getElementById('ord_address')!.textContent = ord.order_address || 'Не требуется (самовывоз)'
    modalInstance?.show()
  } catch (error) { console.error('Ошибка загрузки заказа:', error); alert('Не удалось загрузить данные заказа') }
}

const updateOrder = async () => {
  const btn = document.getElementById('saveOrdBtn') as HTMLButtonElement
  btn.disabled = true; btn.textContent = 'Сохранение...'
  const formData = new FormData()
  formData.append('i d', String(form.id)); formData.append('status', form.status); formData.append('payment', form.payment)
  try {
    const response = await fetch(`${API_BASE}/order/upd`, { method: 'POST', body: formData })
    if (!response.ok) throw new Error('Ошибка обновления')
    modalInstance?.hide(); refresh()
  } catch (error: any) { alert('Ошибка: ' + error.message); console.error(error) } 
  finally { btn.disabled = false; btn.textContent = 'Сохранить изменения' }
}

const statusBadgeClass = (status: string) => {
  const map: Record<string, string> = { assembly: 'bg-warning text-dark', assembled: 'bg-info', transit: 'bg-primary', delivered: 'bg-success', rejected: 'bg-danger' }
  return map[status] || 'bg-secondary'
}
const statusText = (status: string) => {
  const map: Record<string, string> = { assembly: 'Сборка', assembled: 'Собран', transit: 'В пути', delivered: 'Доставлен', rejected: 'Отменен' }
  return map[status] || status
}
const deliverText = (deliver: string) => deliver === 'shop' ? 'Самовывоз' : 'Доставка'
const paymentText = (payment: string) => payment === 'cash' ? 'Наличные' : 'Карта/Перевод'
</script>

<template>
  <div class="pg">
    <div class="container mt-4 mb-5">
      <router-link :to="{name: 'admin'}" class="fs-5">&lt; Назад</router-link>
      <h2 class="mb-4">Управление заказами</h2>
      
      <!-- Панель фильтрации -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <input type="text" class="form-control" placeholder="Поиск по ID или адресу..." v-model="searchQuery">
        </div>
        <div class="col-md-6">
          <select class="form-select" v-model="statusFilter">
            <option value="">Все статусы</option>
            <option value="assembly">Сборка</option>
            <option value="assembled">Собран</option>
            <option value="transit">В пути</option>
            <option value="delivered">Доставлен</option>
            <option value="rejected">Отменен</option>
          </select>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th width="5%" class="sortable" @click="toggleSort('order_id')">№ {{ getSortIcon('order_id') }}</th>
                  <th width="15%" class="sortable" @click="toggleSort('order_date')">Дата {{ getSortIcon('order_date') }}</th>
                  <th width="15%" class="sortable" @click="toggleSort('order_summary')">Сумма {{ getSortIcon('order_summary') }}</th>
                  <th width="20%">Доставка</th>
                  <th width="15%" class="sortable" @click="toggleSort('order_status')">Статус {{ getSortIcon('order_status') }}</th>
                  <th width="15%">Оплата</th>
                  <th width="15%" class="text-end">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading"><td colspan="7" class="text-center py-4 text-muted">Загрузка...</td></tr>
                <tr v-else-if="filteredOrders.length === 0"><td colspan="7" class="text-center py-4 text-muted">Заказы не найдены</td></tr>
                <tr v-for="ord in filteredOrders" :key="ord.order_id">
                  <td>{{ ord.order_id }}</td>
                  <td>{{ ord.order_date }}</td>
                  <td class="fw-bold">{{ Number(ord.order_summary).toLocaleString() }} ₽</td>
                  <td>{{ deliverText(ord.order_deliver) }}</td>
                  <td><span class="badge" :class="statusBadgeClass(ord.order_status)">{{ statusText(ord.order_status) }}</span></td>
                  <td>{{ paymentText(ord.order_payment) }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary view-ord-btn" @click="openViewModal(ord.order_id)">⚙ Управление</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно (без изменений) -->
    <div class="modal fade" id="orderModal" tabindex="-1" aria-hidden="true" ref="modalElement">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Заказ #<span id="ord_id_display"></span></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="updateOrder">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h6 class="border-bottom pb-2">Детали заказа</h6>
                  <p><strong>Сумма:</strong> <span id="ord_summary"></span> ₽</p>
                  <p><strong>Дата оформления:</strong> <span id="ord_date"></span></p>
                  <p><strong>Способ доставки:</strong> <span id="ord_deliver"></span></p>
                  <p><strong>Адрес доставки:</strong> <span id="ord_address" class="text-muted"></span></p>
                </div>
                <div class="col-md-6">
                  <h6 class="border-bottom pb-2">Управление</h6>
                  <div class="mb-3">
                    <label class="form-label">Статус заказа</label>
                    <select class="form-select" v-model="form.status">
                      <option value="assembly">Сборка</option><option value="assembled">Собран</option>
                      <option value="transit">В пути</option><option value="delivered">Доставлен</option>
                      <option value="rejected">Отменен</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Статус оплаты</label>
                    <select class="form-select" v-model="form.payment">
                      <option value="cash">Наличные</option><option value="card">Карта / Перевод</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" id="saveOrdBtn">Сохранить изменения</button>
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