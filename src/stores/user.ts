import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthorizeData, RegisterData, SuccesfullAuthorizeData } from '@/types'
import { $f } from '@/core/api'
import { cookieDelete, cookieSetAuth, createFormData } from '@/core/authorize'

export const useUserStore = defineStore('user', () => {
  const isAuthorize = ref(false)
  const role = ref<SuccesfullAuthorizeData['role'] | undefined>()
  const id = ref<SuccesfullAuthorizeData['id'] | undefined>()
  const token = ref<SuccesfullAuthorizeData['token'] | undefined>()

  async function authorize(data: FormData | AuthorizeData) {
    let dataToSend = data
    if (!(data instanceof FormData)) {
      dataToSend = createFormData(data)
    }
    const resp = await $f('/u/auth', {
      method: 'post',
      body: dataToSend as FormData,
    })
    if (resp.info) {
      location.href = '/authorize?lerr=Неверный логин или пароль'
    } else if (resp.token) {
      cookieSetAuth(resp)
      isAuthorize.value = true
      role.value = resp.role
      id.value = resp.id
      token.value = resp.token
      if (resp.role === 'admin') {
        location.href = '/admin'
      } else {
        location.href = '/catalog'
      }
    }
  }

  async function register(data: FormData | RegisterData) {
    let dataToSend = data
    if (!(data instanceof FormData)) {
      dataToSend = createFormData(data)
    }
    if (
      await $f('/u/check', {
        method: 'post',
        body: createFormData({
          email: dataToSend instanceof FormData ? dataToSend.get('email') : dataToSend.email,
        }),
      })
    ) {
      const resp = await $f('/u/reg', {
        method: 'post',
        body: dataToSend as FormData,
      })
      if (resp.token) {
        cookieSetAuth(resp)
        isAuthorize.value = true
        role.value = resp.role
        id.value = resp.id
        token.value = resp.token
        location.href = '/catalog'
      }
    } else {
      location.href = '?rerr=Почта занята'
    }
  }

  async function updateProfile(data: FormData | RegisterData, cb?: () => void) {
    let dataToSend = data
    if (!(data instanceof FormData)) {
      dataToSend = createFormData(data)
      dataToSend.append('user_id', String(id.value))
    }
    await $f('/u/upd', {
      method: 'post',
      body: dataToSend as FormData,
    })
    if (cb) cb()
  }

  function loggout() {
    cookieDelete()
    location.href = '/'
  }

  return { isAuthorize, authorize, register, role, id, loggout, updateProfile, token }
})
