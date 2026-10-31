import { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import type { CleanerTabParamList } from '@/core/navigation/CleanerTabNavigator';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Order, OrderStatus, useOrderStore } from '@/core/store/useOrderStore';
import { useAuthStore } from '@/core/store/useAuthStore';
import {
  CLEANER_ACTIVE_STATUSES,
} from '@/shared/lib/orderStatus';
import {
  formatCleaningParams,
  formatOrderTime,
  getCleanerPayout,
  getExtraTitles,
} from '@/shared/lib/orders';

// Лента — вкладка таб-навигатора исполнителя, но детали заказа
// открываются в корневом стеке поверх табов.
type Props = CompositeScreenProps<
  BottomTabScreenProps<CleanerTabParamList, 'CleanerFeed'>,
  NativeStackScreenProps<RootStackParamList>
>;

/** Заказ считается «в работе», пока закреплён за исполнителем и не завершён */


export const CleanerFeedScreen = ({ navigation }: Props) => {
  // Подписки на стор раздельные, чтобы не тянуть весь стейт целиком
  const orders = useOrderStore((state) => state.orders);
  const getAvailableOrders = useOrderStore((state) => state.getAvailableOrders);
  const phone = useAuthStore((state) => state.phone);
  const logout = useAuthStore((state) => state.logout);

  // Лента исполнителя: только свободные заказы (статус new)
  const availableOrders = useMemo(() => getAvailableOrders(), [getAvailableOrders, orders]);

  // Текущий заказ исполнителя: закреплён за номером, под которым он вошёл
  const activeOrder = useMemo(
    () =>
      orders.find((order) => order.cleanerName === phone && CLEANER_ACTIVE_STATUSES.includes(order.status)) ??
      null,
    [orders, phone]
  );

  // История выполненных заказов этого исполнителя
  const completedOrders = useMemo(
    () => orders.filter((order) => order.cleanerName === phone && order.status === 'completed'),
    [orders, phone]
  );

  const earnings = completedOrders.reduce((sum, order) => sum + getCleanerPayout(order.price), 0);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <Card>
      <View className="flex-row justify-between items-start mb-2">
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text className="text-blue-700 font-semibold text-xs">{formatOrderTime(item.time)}</Text>
        </View>
        <Text className="text-xl font-bold text-green-600">+{getCleanerPayout(item.price)} BYN</Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-1">{item.address}</Text>
      <Text className="text-gray-500 mb-3 text-sm">
        Объект: {formatCleaningParams(item.cleaningParams)}
      </Text>

      {item.cleaningParams.extras.length > 0 && (
        <View className="bg-gray-50 p-2 rounded-lg mb-3">
          <Text className="text-xs text-gray-500 mb-1">Доп. работы:</Text>
          <Text className="text-sm font-medium text-gray-700">
            • {getExtraTitles(item.cleaningParams.extras).join(', ')}
          </Text>
        </View>
      )}

      <Button
        title="Подробнее и отклик"
        onPress={() => navigation.navigate('CleanerOrderDetail', { orderId: item.id })}
      />
    </Card>
  );

  const renderHeader = () => (
    <View className="mb-4">
      {/* Шапка исполнителя */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-1 pr-3">
          <Text className="text-2xl font-bold text-gray-900">Заказы в Минске 🧹</Text>
          <Text className="text-gray-500 text-sm">Статус: На линии</Text>
          <Text className="text-xs text-gray-400 mt-1">
            Исполнитель: {phone ?? 'номер не указан'}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} className="bg-gray-200 px-3 py-2 rounded-xl">
          <Text className="text-xs font-semibold text-gray-700">Выйти</Text>
        </TouchableOpacity>
      </View>

      {/* Сводка по заработку */}
      <Card className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-gray-500">Выполнено заказов</Text>
          <Text className="text-lg font-bold text-gray-900">{completedOrders.length}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500">Заработано</Text>
          <Text className="text-lg font-bold text-green-600">{earnings} BYN</Text>
        </View>
      </Card>

      {/* Активный заказ: единственный способ вернуться к нему после отклика */}
      {activeOrder && (
        <Card className="border-amber-200 bg-amber-50">
          <Text className="text-xs font-semibold text-amber-700 mb-1">Ваш текущий заказ</Text>
          <Text className="text-base font-bold text-gray-900">{activeOrder.address}</Text>
          <Text className="text-sm text-gray-600 mb-3">
            {formatOrderTime(activeOrder.time)} · +{getCleanerPayout(activeOrder.price)} BYN
          </Text>
          <Button
            title="Открыть заказ"
            className="bg-amber-500 active:bg-amber-600"
            onPress={() => navigation.navigate('CleanerOrderDetail', { orderId: activeOrder.id })}
          />
        </Card>
      )}

      <Text className="text-xl font-bold text-gray-900 mb-3">Доступные заказы</Text>
    </View>
  );

  return (
    <Screen className="px-4 py-4">
      <FlatList
        data={availableOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-gray-400 text-base">Доступных заказов пока нет</Text>
          </View>
        }
      />
    </Screen>
  );
};
