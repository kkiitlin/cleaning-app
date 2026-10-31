import type { OrderStatus } from '@/core/store/useOrderStore';

/** Названия статусов для клиента */
export const CLIENT_STATUS_TITLES: Record<OrderStatus, string> = {
  new: 'Ищем клинера',
  accepted: 'Клинер назначен',
  in_progress: 'Уборка идёт',
  awaiting_confirmation: 'Подтвердите выполнение',
  completed: 'Заказ выполнен',
  cancelled: 'Отменён',
};

/** Названия статусов для клинера */
export const CLEANER_STATUS_TITLES: Record<OrderStatus, string> = {
  new: 'Свободный заказ',
  accepted: 'Закреплён за вами',
  in_progress: 'Уборка идёт',
  awaiting_confirmation: 'Ждёт подтверждения клиента',
  completed: 'Выполнен',
  cancelled: 'Отменён',
};

/** Цвета бейджа и текста статуса (классы Tailwind) */
export const STATUS_STYLES: Record<OrderStatus, { badge: string; text: string }> = {
  new: { badge: 'bg-blue-100', text: 'text-blue-700' },
  accepted: { badge: 'bg-amber-100', text: 'text-amber-700' },
  in_progress: { badge: 'bg-purple-100', text: 'text-purple-700' },
  awaiting_confirmation: { badge: 'bg-orange-100', text: 'text-orange-700' },
  completed: { badge: 'bg-green-100', text: 'text-green-700' },
  cancelled: { badge: 'bg-gray-100', text: 'text-gray-500' },
};

/** Заказ «в работе» у клинера: после завершения уборки клинер свободен для нового заказа */
export const CLEANER_ACTIVE_STATUSES: OrderStatus[] = ['accepted', 'in_progress'];

/** Заказ «в работе» у клиента: пока не выполнен и не отменён */
export const CLIENT_ACTIVE_STATUSES: OrderStatus[] = [
  'new',
  'accepted',
  'in_progress',
  'awaiting_confirmation',
];