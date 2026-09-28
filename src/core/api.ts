import { ref } from 'vue'

export const API_BASE = import.meta.env.VITE_API_URL

interface FetchOptions {
  body?: FormData
  method: 'get' | 'post'
}

function image(path: string) {
  return `${API_BASE}/${path}`
}

async function $f(path: string, fetchOptions: FetchOptions = { method: 'get' }) {
  const body = fetchOptions.body as BodyInit

  // console.dir(body, path);

  const data = await fetch(API_BASE + path, {
    body,
    method: fetchOptions.method,
  })
    .then((res) => res.json())
    .catch((err) => console.error(err))
  return data
}

function useF(path: string, fetchOptions: FetchOptions = { method: 'get' }) {
  const data = ref()
  const error = ref()
  const loading = ref(false)

  async function handleFetch(newPath?: string) {
    const currentPath = newPath ?? path
    const body = fetchOptions.body as BodyInit

    // console.dir(body, path);

    fetch(API_BASE + currentPath, {
      body,
      method: fetchOptions.method,
    })
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => console.error(err))
  }
  const refresh = handleFetch

  try {
    loading.value = true
    handleFetch()
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }

  return {
    data,
    error,
    loading,
    refresh,
  }
}

export { useF, $f, image }
