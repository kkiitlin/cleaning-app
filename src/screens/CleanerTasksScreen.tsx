import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Order, OrderStatus, useOrderStore } from '@/core/store/useOrderStore';
import { useAuthStore } from '@/core/store/useAuthStore';
import {
  CLEANER_STATUS_TITLES,
  STATUS_STYLES,
} from '@/shared/lib/orderStatus';
import {
  formatCleaningParams,
  formatOrderTime,
  getCleanerPayout,
  getExtraTitles,
} from '@/shared/lib/orders';

/** Задачи исполнителя: закреплённые за ним и уже завершённые заказы */
const TASK_STATUSES: OrderStatus[] = ['accepted', 'in_progress', 'completed'];

export const CleanerTasksScreen = () => {
  // Подписки раздельные, чтобы не тянуть весь стейт целиком
  const orders = useOrderStore((state) => state.orders);
  const phone = useAuthStore((state) => state.phone);

  // Исполнителя определяем по номеру, под которым он вошёл
  const cleanerName = phone ?? 'Номер не указан';

  // Сначала активные задачи, затем завершённые; внутри группы — по времени выезда
  const tasks = useMemo(() => {
    return orders
      .filter((order) => order.cleanerName === cleanerName && TASK_STATUSES.includes(order.status))
      .sort((a, b) => {
        const aActive = a.status === 'completed' ? 1 : 0;
        const bActive = b.status === 'completed' ? 1 : 0;

        if (aActive !== bActive) {
          return aActive - bActive;
        }

        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });
  }, [orders, cleanerName]);

  const activeTasksCount = tasks.filter((order) => order.status !== 'completed').length;
  const earnings = tasks
    .filter((order) => order.status === 'completed')
    .reduce((sum, order) => sum + getCleanerPayout(order.price), 0);

  const renderTask = ({ item }: { item: Order }) => (
    <Card>
      <View className="flex-row justify-between items-start mb-2">
        <View className={`px-3 py-1 rounded-full ${STATUS_STYLES[item.status].badge}`}>
          <Text className={`text-xs font-semibold ${STATUS_STYLES[item.status].text}`}>
            {CLEANER_STATUS_TITLES[item.status]}
          </Text>
        </View>
        <Text className="text-lg font-bold text-green-600">+{getCleanerPayout(item.price)} BYN</Text>
      </View>

      <Text className="text-base font-bold text-gray-900 mb-1">{item.address}</Text>
      <Text className="text-sm text-gray-500 mb-1">{formatOrderTime(item.time)}</Text>
      <Text className="text-sm text-gray-500">
        Объект: {formatCleaningParams(item.cleaningParams)}
      </Text>

      {item.cleaningParams.extras.length > 0 && (
        <Text className="text-sm text-gray-700 mt-2">
          • {getExtraTitles(item.cleaningParams.extras).join(', ')}
        </Text>
      )}

      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <Text className="text-xs text-gray-500">Клиент: {item.clientPhone}</Text>
        <Text className="text-xs text-gray-400">Заказ {item.id}</Text>
      </View>
    </Card>
  );

  const renderHeader = () => (
    <View className="mb-2">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Мои задачи 🧰</Text>
        <Text className="text-gray-500 text-sm">Исполнитель: {cleanerName}</Text>
      </View>

      <Card className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-gray-500">В работе</Text>
          <Text className="text-lg font-bold text-gray-900">{activeTasksCount}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500">Заработано</Text>
          <Text className="text-lg font-bold text-green-600">{earnings} BYN</Text>
        </View>
      </Card>
    </View>
  );

  return (
    <Screen className="px-4 py-4">
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card className="items-center py-8">
            <Text className="text-lg font-bold text-gray-900 mb-2">Задач пока нет</Text>
            <Text className="text-gray-500 text-sm text-center">
              Откликнитесь на заказ во вкладке «Лента заказов» — он появится здесь.
            </Text>
          </Card>
        }
      />
    </Screen>
  );
};
