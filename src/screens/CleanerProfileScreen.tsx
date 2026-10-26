import { ScrollView, Text, View } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/core/store/useAuthStore';

// Заглушки профиля: в MVP данные исполнителя не подгружаются с бэкенда
const CLEANER_NAME = 'Клинер';
const CLEANER_RATING = '5.0';

export const CleanerProfileScreen = () => {
  const phone = useAuthStore((state) => state.phone);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Screen className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-900 mb-6">Профиль 🧹</Text>

        {/* Аватар-заглушка */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-3">
            <Text className="text-3xl">🧑‍🔧</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{CLEANER_NAME}</Text>
          <Text className="text-gray-500 text-sm">Исполнитель уборки</Text>
        </View>

        {/* Данные исполнителя */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">
            Данные исполнителя
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Имя</Text>
            <Text className="font-semibold text-gray-900">{CLEANER_NAME}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Рейтинг</Text>
            <Text className="font-semibold text-amber-600">⭐ {CLEANER_RATING}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Телефон</Text>
            <Text className="font-semibold text-gray-900">{phone ?? 'Не указан'}</Text>
          </View>
        </Card>

        {/* Выход из аккаунта */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-2">Аккаунт</Text>
          <Text className="text-xs text-gray-500 mb-4">
            Выход удалит сохранённую сессию на этом устройстве. Лента заказов и статистика
            останутся на месте.
          </Text>

          <Button
            title="Выйти из аккаунта"
            className="bg-red-500 active:bg-red-600"
            onPress={logout}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
};
