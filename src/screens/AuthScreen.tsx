import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { useAuthStore } from '@/core/store/useAuthStore';
import { formatBYPhone, validateBYPhone } from '@/shared/lib/phone';
import { APP_NAME } from '@/shared/config/brand';

type AuthStep = 'phone' | 'role';

/** Префикс белорусского номера, который пользователь не может стереть */
const PHONE_PREFIX = '+375 ';

export const AuthScreen = () => {
  const [phone, setPhone] = useState(PHONE_PREFIX);
  const [step, setStep] = useState<AuthStep>('phone');
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  // Номер форматируем на лету: +375 (XX) XXX-XX-XX
  const handlePhoneChange = (value: string) => {
    // Защита префикса: если его стёрли или изменили — возвращаем принудительно
    if (value.length < PHONE_PREFIX.length || !value.startsWith(PHONE_PREFIX)) {
      setPhone(PHONE_PREFIX);
    } else if (value.length < phone.length) {
      // Стирание: принимаем текст как есть и ничего не дописываем обратно —
      // иначе маска возвращает удалённые символы и ввод «замораживается»
      setPhone(value);
    } else {
      const formatted = formatBYPhone(value);
      // Форматтер возвращает '+375' без пробела, пока цифры после префикса не набраны
      setPhone(formatted.startsWith(PHONE_PREFIX) ? formatted : PHONE_PREFIX);
    }

    if (error) setError('');
  };

  const handleSendCode = () => {
    const { isValid, error: phoneError } = validateBYPhone(phone);

    if (!isValid) {
      setError(phoneError ?? 'Введите корректный номер телефона');
      return;
    }

    setError('');
    setStep('role');
  };

  // Роль определяет, какие экраны увидит пользователь (см. RootNavigator)
  const handleLogin = (selectedRole: 'client' | 'cleaner') => {
    setAuth(phone, selectedRole);
  };

  return (
    <Screen className="px-4 justify-center">
      <Card className="p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {APP_NAME} 🧹
        </Text>
        <Text className="text-gray-500 mb-6 text-center text-sm">
          {step === 'phone' ? 'Введите номер телефона для входа' : 'Выберите режим входа'}
        </Text>

        {error ? <Text className="text-red-500 mb-3 text-sm text-center">{error}</Text> : null}

        {step === 'phone' ? (
          <View className="gap-4">
            <TextInput
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="+375 (29) 000-00-00"
              keyboardType="phone-pad"
              maxLength={19}
              className="bg-gray-100 p-4 rounded-xl text-base text-gray-900 border border-gray-200"
            />
            <Button title="Далее" onPress={handleSendCode} />
          </View>
        ) : (
          <View className="gap-3">
            <Text className="text-center text-sm font-semibold text-gray-900">{phone}</Text>
            <Text className="text-xs text-gray-500 text-center mb-1">
              Выберите, в каком качестве войти:
            </Text>

            <Button title="👤 Войти как Клиент" onPress={() => handleLogin('client')} />

            <Button
              title="🧹 Войти как Клинер (Исполнитель)"
              className="bg-green-600 active:bg-green-700"
              onPress={() => handleLogin('cleaner')}
            />

            <TouchableOpacity onPress={() => setStep('phone')} className="mt-2">
              <Text className="text-center text-gray-500 text-sm">← Изменить номер</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    </Screen>
  );
};
