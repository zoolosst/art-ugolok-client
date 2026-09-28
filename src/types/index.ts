export interface AuthorizeData {
  email: string
  password: string
}

export interface SuccesfullAuthorizeData {
  token: string
  id: number
  role: 'admin' | 'user'
}

export interface RegisterData extends AuthorizeData {
  confirm: string
  name: string
  surname: string
  phone: string
  birthday: string
  agree: boolean
}

type CatalogSort = 'default' | 'asc' | 'desc'
export interface CatalogFilters {
  cat: number | string
  sort: CatalogSort
  min: number
  max: number
  prompt: string
}

export interface OrderCheckup {
  deliver: 'shop' | 'deliver'
  shipping: 'cdek' | 'pochta'
  address: string
  payment: 'card' | 'cash'
}
