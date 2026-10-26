import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAuthStore } from '@/core/store/useAuthStore';

// Тип для дополнительных услуг
export interface ExtraService {
  id: string;
  title: string;
  price: number; // Стоимость в BYN
}

// Список доступных дополнительных услуг в Беларуси
export const AVAILABLE_EXTRAS: ExtraService[] = [
  { id: 'fridge', title: 'Помыть холодильник', price: 20 },
  { id: 'oven', title: 'Помыть духовку', price: 18 },
  { id: 'balcony', title: 'Уборка балкона', price: 25 },
  { id: 'windows', title: 'Мытье окон (1 шт)', price: 15 },
];

// Параметры уборки — то, из чего складывается заказ
export interface CleaningParams {
  rooms: number;
  bathrooms: number;
  extras: string[]; // ID выбранных услуг из AVAILABLE_EXTRAS
}

export type OrderStatus = 'new' | 'accepted' | 'in_progress' | 'completed';

/**
 * Объединённый заказ: клиент его создаёт, клинер исполняет.
 * Один и тот же объект видят обе стороны, поэтому стейт у приложения общий.
 */
export interface Order {
  id: string;
  cleaningParams: CleaningParams;
  address: string;
  time: string; // Дата и время выезда в формате ISO
  price: number; // Сумма заказа в BYN
  clientPhone: string;
  cleanerName: string | null; // null, пока заказ никто не принял
  status: OrderStatus;
}

// Данные, которые передаёт клиент: id, статус и исполнителя присваивает стор
export interface NewOrder {
  cleaningParams: CleaningParams;
  address: string;
  time: string;
  price: number;
  clientPhone?: string; // Если не указан — подставим телефон авторизованного пользователя
}

interface OrderState {
  // Конструктор заказа клиента (OrderBuilder -> Address -> Checkout)
  roomsCount: number;
  bathroomsCount: number;
  selectedExtras: string[]; // Массив ID выбранных услуг
  address: string;
  totalPrice: number;

  setRoomsCount: (count: number) => void;
  setBathroomsCount: (count: number) => void;
  toggleExtra: (extraId: string) => void;
  setAddress: (address: string) => void;
  resetOrder: () => void;

  // Общий список заказов: и клиент, и клинер работают с одним массивом
  orders: Order[];

  // Публикация оплаченного заказа в ленте исполнителей; возвращает id заказа
  createOrder: (order: NewOrder) => string;
  // Отклик клинера: заказ закрепляется за исполнителем
  acceptOrder: (orderId: string, cleanerName: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // Срез заказов конкретного клиента (история заказов)
  getClientOrders: (clientPhone: string) => Order[];
  // Срез свободных заказов для ленты исполнителей
  getAvailableOrders: () => Order[];
}

// Моковые заказы всегда «в будущем» относительно текущего момента
const scheduledTime = (hoursFromNow: number): string => {
  const date = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
};

// Тестовые заказы по Минску
const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    cleaningParams: { rooms: 2, bathrooms: 1, extras: ['fridge'] },
    address: 'г. Минск, ул. Немига, 12, кв. 45',
    time: scheduledTime(2),
    price: 65,
    clientPhone: '+375 (29) 111-22-33',
    cleanerName: null,
    status: 'new',
  },
  {
    id: 'ord-102',
    cleaningParams: { rooms: 3, bathrooms: 2, extras: ['windows', 'oven'] },
    address: 'г. Минск, пр-т Независимости, 85, кв. 12',
    time: scheduledTime(5),
    price: 115,
    clientPhone: '+375 (29) 444-55-66',
    cleanerName: null,
    status: 'new',
  },
];

// Базовые тарифы в BYN
const BASE_PRICE = 45; // Базовая стоимость выезда
const ROOM_PRICE = 15; // Стоимость за каждую комнату
const BATHROOM_PRICE = 20; // Стоимость за каждый санузел

// Вспомогательная функция для расчета итоговой цены
const calculateTotal = (rooms: number, bathrooms: number, extras: string[]): number => {
  const extrasTotal = extras.reduce((sum, extraId) => {
    const item = AVAILABLE_EXTRAS.find((e) => e.id === extraId);
    return sum + (item ? item.price : 0);
  }, 0);

  return BASE_PRICE + rooms * ROOM_PRICE + bathrooms * BATHROOM_PRICE + extrasTotal;
};

/** Инициализатор стора заказов: тело вынесено отдельно, чтобы обернуть его в persist */
const orderStoreInitializer: StateCreator<OrderState> = (set, get) => ({
  roomsCount: 1,
  bathroomsCount: 1,
  selectedExtras: [],
  address: '',
  totalPrice: calculateTotal(1, 1, []),

  setRoomsCount: (count) =>
    set((state) => {
      const newCount = Math.max(1, count); // Не меньше 1 комнаты
      return {
        roomsCount: newCount,
        totalPrice: calculateTotal(newCount, state.bathroomsCount, state.selectedExtras),
      };
    }),

  setBathroomsCount: (count) =>
    set((state) => {
      const newCount = Math.max(1, count); // Не меньше 1 санузла
      return {
        bathroomsCount: newCount,
        totalPrice: calculateTotal(state.roomsCount, newCount, state.selectedExtras),
      };
    }),

  toggleExtra: (extraId) =>
    set((state) => {
      const exists = state.selectedExtras.includes(extraId);
      const newExtras = exists
        ? state.selectedExtras.filter((id) => id !== extraId)
        : [...state.selectedExtras, extraId];

      return {
        selectedExtras: newExtras,
        totalPrice: calculateTotal(state.roomsCount, state.bathroomsCount, newExtras),
      };
    }),

  setAddress: (address) => set({ address }),

  resetOrder: () =>
    set({
      roomsCount: 1,
      bathroomsCount: 1,
      selectedExtras: [],
      address: '',
      totalPrice: calculateTotal(1, 1, []),
    }),

  // Заказы обеих ролей живут в одном массиве
  orders: MOCK_ORDERS,

  createOrder: (order) => {
    const id = `ord-${Date.now()}`;

    const newOrder: Order = {
      id,
      cleaningParams: order.cleaningParams,
      address: order.address,
      time: order.time,
      price: order.price,
      // Телефон клиента можно не передавать — возьмём из авторизации
      clientPhone: order.clientPhone ?? useAuthStore.getState().phone ?? 'Номер не указан',
      cleanerName: null,
      status: 'new',
    };

    set((state) => ({ orders: [newOrder, ...state.orders] }));

    return id;
  },

  // Принять можно только свободный заказ — иначе отклик игнорируем
  acceptOrder: (orderId, cleanerName) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId && order.status === 'new'
          ? { ...order, status: 'accepted', cleanerName }
          : order
      ),
    })),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),

  // Возвращаем копии, чтобы экраны не мутировали стейт напрямую
  getClientOrders: (clientPhone) =>
    get().orders.filter((order) => order.clientPhone === clientPhone).map((order) => ({ ...order })),

  getAvailableOrders: () =>
    get()
      .orders.filter((order) => order.status === 'new')
      .map((order) => ({ ...order })),
});

/** В AsyncStorage храним только саму базу заказов (черновик корзины не сохраняем) */
type PersistedOrderState = Pick<OrderState, 'orders'>;

/** Ключ, под которым заказы лежат в AsyncStorage */
export const ORDERS_STORAGE_KEY = 'order-storage';

export const useOrderStore = create<OrderState>()(
  persist(orderStoreInitializer, {
    name: ORDERS_STORAGE_KEY,
    storage: createJSONStorage<PersistedOrderState>(() => AsyncStorage),
    version: 1,
    partialize: (state): PersistedOrderState => ({ orders: state.orders }),
  })
);