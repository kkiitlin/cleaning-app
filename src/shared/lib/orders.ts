import { AVAILABLE_EXTRAS } from '@/core/store/useOrderStore';
import type { CleaningParams } from '@/core/store/useOrderStore';

/** Доля заказа, которая остаётся исполнителю (комиссия сервиса — 20%) */
export const CLEANER_SHARE = 0.8;

/** Выплата исполнителю за заказ, BYN */
export const getCleanerPayout = (orderPrice: number): number => Math.round(orderPrice * CLEANER_SHARE);

const pad = (value: number): string => String(value).padStart(2, '0');

/** Начало суток: нужно, чтобы считать разницу в днях без учёта времени */
const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/**
 * Форматирует время выезда из ISO-строки: «Сегодня, 15:00», «Завтра, 10:00», «05.10.2026, 12:00»
 */
export const formatOrderTime = (isoTime: string): string => {
  const date = new Date(isoTime);

  // Некорректную строку показываем как есть, а не «Invalid Date»
  if (Number.isNaN(date.getTime())) {
    return isoTime;
  }

  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const dayDiff = Math.round((startOfDay(date) - startOfDay(new Date())) / (24 * 60 * 60 * 1000));

  if (dayDiff === 0) return `Сегодня, ${time}`;
  if (dayDiff === 1) return `Завтра, ${time}`;
  if (dayDiff === -1) return `Вчера, ${time}`;

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${time}`;
};

/** Превращает ID дополнительных услуг в читаемые названия */
export const getExtraTitles = (extras: string[]): string[] =>
  extras.map((extraId) => AVAILABLE_EXTRAS.find((extra) => extra.id === extraId)?.title ?? extraId);

/** Краткое описание объекта уборки: «2 комн., 1 сануз.» */
export const formatCleaningParams = (params: CleaningParams): string =>
  `${params.rooms} комн., ${params.bathrooms} сануз.`;
