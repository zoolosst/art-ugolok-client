// Интерфейсы для таблиц базы данных artugolok

// Типы для перечислений (ENUM)
type OrderDeliver = 'shop' | 'deliver'
type OrderStatus = 'assembly' | 'transit' | 'rejected' | 'delivered' | 'assembled'
type OrderPayment = 'cash' | 'card'
type RentStatus = 'active' | 'ended'
type RequestStatus = 'new' | 'agreed' | 'rejected'
type UserRole = 'user' | 'admin'

// Таблица cart-items
export interface CartItem {
  cart_item_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  fk_user: number // int, FOREIGN KEY -> users.user_id
  fk_product: number // int, FOREIGN KEY -> products.product_id
}

// Таблица categories
export interface Category {
  category_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  category_name: string // varchar(64)
  category_photo: string // varchar(256) – путь к файлу
  category_description: string // text
}

// Таблица favorites
export interface Favorite {
  favorite_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  fk_user: number // int, FOREIGN KEY -> users.user_id
  fk_product: number // int, FOREIGN KEY -> products.product_id
}

// Таблица order-items
export interface OrderItem {
  order_item_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  fk_product: number // int, FOREIGN KEY -> products.product_id
  fk_order: number // int, FOREIGN KEY -> orders.order_id
}

// Таблица orders
export interface Order {
  order_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  fk_user: number // int, FOREIGN KEY -> users.user_id
  order_summary: number // int – общая сумма заказа
  order_date: string // date (можно использовать Date, но обычно строки)
  order_deliver: OrderDeliver // enum('shop','deliver')
  order_status: OrderStatus // enum('assembly','transit','rejected','delivered','assembled'), default 'assembly'
  order_payment: OrderPayment // enum('cash','card')
  order_address: string // text
}

// Таблица products
export interface Product {
  product_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  product_photo: string // varchar(256) – путь к файлу
  product_name: string // varchar(128)
  product_description: string // text
  product_price: number // int
  fk_category: number // int, FOREIGN KEY -> categories.category_id
  category_name?: string
}

// Таблица rents
export interface Rent {
  rent_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  fk_user: number // int, FOREIGN KEY -> users.user_id
  fk_shelf: number // int, FOREIGN KEY -> shelfs.shelf_id
  rent_expired: string // date – дата окончания аренды
  rent_status: RentStatus // enum('active','ended')
}

// Таблица requests
export interface Request {
  request_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  request_contact: string // varchar(128) – контактные данные
  request_link: string // text – ссылка на товар
  request_comment: string // text – комментарий
  fk_user: number // int, FOREIGN KEY -> users.user_id
  request_brand: string // varchar(50) – бренд
  request_status: RequestStatus // enum('new','agreed','rejected'), default 'new'
}

// Таблица shelfs
export interface Shelf {
  shelf_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  fk_stillage: number // int, FOREIGN KEY -> stillages.stillage_id
  shelf_price: number // int – цена за полку
  shelf_8price: number // int – цена за 8 часов? (судя по названию)
  shelf_current: number // int, default 0 – текущее количество занятых мест
  shelf_max: number // int, default 0 – максимальное количество мест
}

// Таблица stillages
export interface Stillage {
  stillage_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  stillage_width: number // int – ширина в мм
  stillage_height: number // int – высота в мм
  stillage_depth: number // int – глубина в мм
}

// Таблица users
export interface User {
  user_id: number // int, PRIMARY KEY, AUTO_INCREMENT
  user_name: string // varchar(64)
  user_surname: string // varchar(64)
  user_phone: string // varchar(20) – номер телефона
  user_birthday: string // date – дата рождения
  user_hash: string // text – хеш пароля
  user_email: string // varchar(64)
  user_role: UserRole // enum('user','admin'), default 'user'
}
