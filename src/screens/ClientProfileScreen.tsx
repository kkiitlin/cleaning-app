import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/core/store/useAuthStore';
import { useOrderStore } from '@/core/store/useOrderStore';

// Заглушки профиля: в MVP данные клиента не подгружаются с бэкенда
const CLIENT_NAME = 'Клиент';
const CLIENT_CITY = 'Минск';

export const ClientProfileScreen = () => {
  const phone = useAuthStore((state) => state.phone);
  const logout = useAuthStore((state) => state.logout);

  const getClientOrders = useOrderStore((state) => state.getClientOrders);
  // Подписка на список заказов, чтобы статистика обновлялась при изменениях
  const orders = useOrderStore((state) => state.orders);

  // Клиента определяем по номеру, под которым он вошёл (как в ClientOrdersScreen)
  const clientPhone = phone ?? 'Номер не указан';

  const clientOrders = useMemo(
    () => getClientOrders(clientPhone),
    [getClientOrders, clientPhone, orders]
  );

  const completedOrdersCount = clientOrders.filter(
    (order) => order.status === 'completed'
  ).length;

  return (
    <Screen className="px-4 py-4">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-900 mb-6">Профиль 👤</Text>

        {/* Аватар-заглушка */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
            <Text className="text-3xl">👤</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{CLIENT_NAME}</Text>
          <Text className="text-gray-500 text-sm">Заказчик уборки</Text>
        </View>

        {/* Личные данные */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">
            Личные данные
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Имя</Text>
            <Text className="font-semibold text-gray-900">{CLIENT_NAME}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Город</Text>
            <Text className="font-semibold text-gray-900">{CLIENT_CITY}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Телефон</Text>
            <Text className="font-semibold text-gray-900">{clientPhone}</Text>
          </View>
        </Card>

        {/* Статистика заказов клиента */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">
            Статистика
          </Text>

          <View className="flex-row gap-3">
            <View className="items-center flex-1 bg-gray-50 rounded-xl py-3 border border-gray-100">
              <Text className="text-xs text-gray-500">Всего заказов</Text>
              <Text className="text-2xl font-bold text-gray-900 mt-1">{clientOrders.length}</Text>
            </View>

            <View className="items-center flex-1 bg-gray-50 rounded-xl py-3 border border-gray-100">
              <Text className="text-xs text-gray-500">Выполнено</Text>
              <Text className="text-2xl font-bold text-green-600 mt-1">
                {completedOrdersCount}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Выход из аккаунта — всегда прижат к низу экрана */}
      <View className="pt-2">
        <Button
          title="Выйти из аккаунта"
          className="bg-red-500 active:bg-red-600"
          onPress={logout}
        />
        <Text className="text-xs text-gray-400 text-center mt-2">
          Выход удалит сессию на этом устройстве — заказы и история останутся.
        </Text>
      </View>
    </Screen>
  );
};
