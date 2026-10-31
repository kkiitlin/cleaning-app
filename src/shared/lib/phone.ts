/**
 * Форматирует введенную строку в формат белорусского номера: +375 (XX) XXX-XX-XX
 */
export const formatBYPhone = (value: string): string => {
  // Оставляем только цифры
  const cleaned = value.replace(/\D/g, '');

  // Если пользователь начал вводить 375, убираем префикс для удобства
  let raw = cleaned;
  if (raw.startsWith('375')) {
    raw = raw.slice(3);
  }

  // Ограничиваем длину 9 цифрами (код оператора + номер)
  raw = raw.slice(0, 9);

  let result = '+375';
  if (raw.length > 0) {
    result += ` (${raw.slice(0, 2)}`;
  }
  if (raw.length >= 2) {
    result += `) ${raw.slice(2, 5)}`;
  }
  if (raw.length > 5) {
    result += `-${raw.slice(5, 7)}`;
  }
  if (raw.length > 7) {
    result += `-${raw.slice(7, 9)}`;
  }

  return result;
};

/**
 * Проверяет корректность белорусского номера телефона
 */
export const validateBYPhone = (formattedPhone: string): { isValid: boolean; error?: string } => {
  const digits = formattedPhone.replace(/\D/g, '');

  if (digits.length !== 12) {
    return { isValid: false, error: 'Введите полный номер телефона' };
  }

  // Коды операторов РБ: 25 (Life), 29 (A1/МТС), 33 (МТС), 44 (A1), 17 (Городской Минск)
  const operatorCode = digits.slice(3, 5);
  const validCodes = ['25', '29', '33', '44', '17'];

  if (!validCodes.includes(operatorCode)) {
    return { isValid: false, error: 'Некорректный код оператора (25, 29, 33, 44, 17)' };
  }

  return { isValid: true };
};