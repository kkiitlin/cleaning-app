const DAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export function getAvailableDays(count = 7): Date[] {
  const days: Date[] = [];
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }

  return days;
}

export function getTimeSlots(day: Date, now = new Date()): string[] {
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const twoHoursLater = new Date(nowStart.getTime() + 2 * 60 * 60 * 1000);

  const slots: string[] = [];
  for (let hour = 9; hour <= 20; hour++) {
    const slot = new Date(dayStart);
    slot.setHours(hour, 0, 0, 0);

    const isToday = dayStart.getTime() === nowStart.getTime();
    if (isToday && slot < twoHoursLater) {
      continue;
    }

    slots.push(`${String(hour).padStart(2, '0')}:00`);
  }

  return slots;
}

export function toIso(day: Date, slot: string): string {
  const [hours, minutes] = slot.split(':').map(Number);
  const date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes, 0, 0);
  return date.toISOString();
}

export function formatDayChip(day: Date): string {
  const dayIndex = day.getDay();
  const date = day.getDate();
  const month = day.getMonth() + 1;
  const dateString = `${date < 10 ? '0' : ''}${date}`;
  const monthString = `${month < 10 ? '0' : ''}${month}`;

  if (dayIndex === 0) return 'Сегодня';
  if (dayIndex === 1) return 'Завтра';

  return `${DAYS_SHORT[dayIndex]}, ${dateString}.${monthString}`;
}
