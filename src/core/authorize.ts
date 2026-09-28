import { useUserStore } from '@/stores/user'
import type { SuccesfullAuthorizeData } from '@/types'

export async function authorizeMiddleware() {
  const userStore = useUserStore()
  if (await cookieCheck()) {
    userStore.isAuthorize = true
    const role = await cookieStore.get('role')
    const id = await cookieStore.get('id')
    const token = await cookieStore.get('token')
    if (id && role && token) {
      userStore.id = Number(id.value)
      userStore.role = role.value as SuccesfullAuthorizeData['role']
      userStore.token = token.value as SuccesfullAuthorizeData['token']
    }
  }
}

async function cookieCheck() {
  const token = await cookieStore.get('token')
  return token !== null
}

export function cookieSetAuth(data: SuccesfullAuthorizeData) {
  cookieStore.set('token', data.token)
  cookieStore.set('id', data.id.toString())
  cookieStore.set('role', data.role)
}

export function cookieDelete() {
  cookieStore.delete('token')
  cookieStore.delete('id')
  cookieStore.delete('role')
}

export function createFormData(data: Object) {
  const res = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    res.append(k, String(v))
  })
  return res
}
