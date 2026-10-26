import { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import type { ClientTabParamList } from '@/core/navigation/ClientTabNavigator';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Order, OrderStatus, useOrderStore } from '@/core/store/useOrderStore';
import { useAuthStore } from '@/core/store/useAuthStore';
import { formatCleaningParams, formatOrderTime, getExtraTitles } from '@/shared/lib/orders';

// Список заказов — вкладка клиента, но кнопка «Заказать уборку»
// открывает конструктор заказа в корневом стеке.
type Props = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, 'ClientOrders'>,
  NativeStackScreenProps<RootStackParamList>
>;

/** Русские названия статусов заказа для клиента */
const STATUS_TITLES: Record<OrderStatus, string> = {
  new: 'Ищем клинера',
  accepted: 'Клинер назначен',
  in_progress: 'Уборка идёт',
  completed: 'Заказ выполнен',
};

const STATUS_STYLES: Record<OrderStatus, { badge: string; text: string }> = {
  new: { badge: 'bg-blue-100', text: 'text-blue-700' },
  accepted: { badge: 'bg-amber-100', text: 'text-amber-700' },
  in_progress: { badge: 'bg-purple-100', text: 'text-purple-700' },
  completed: { badge: 'bg-green-100', text: 'text-green-700' },
};

/** Заказ ещё в работе, пока не завершён */
const ACTIVE_STATUSES: OrderStatus[] = ['new', 'accepted', 'in_progress'];

export const ClientOrdersScreen = ({ navigation }: Props) => {
  // Подписки раздельные, чтобы не тянуть весь стейт целиком
  const orders = useOrderStore((state) => state.orders);
  const getClientOrders = useOrderStore((state) => state.getClientOrders);
  const phone = useAuthStore((state) => state.phone);

  // Клиента определяем по номеру, под которым он вошёл
  const clientPhone = phone ?? 'Номер не указан';

  // Сначала активные заказы, затем завершённые (и те и другие — по времени выезда)
  const clientOrders = useMemo(() => {
    const own = getClientOrders(clientPhone);

    return own.sort((a, b) => {
      const aActive = ACTIVE_STATUSES.includes(a.status) ? 0 : 1;
      const bActive = ACTIVE_STATUSES.includes(b.status) ? 0 : 1;

      if (aActive !== bActive) {
        return aActive - bActive;
      }

      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
  }, [getClientOrders, clientPhone, orders]);

  const activeOrdersCount = clientOrders.filter((order) =>
    ACTIVE_STATUSES.includes(order.status)
  ).length;

  const renderOrder = ({ item }: { item: Order }) => {
    const extraTitles = getExtraTitles(item.cleaningParams.extras);

    return (
      <Card>
        <View className="flex-row justify-between items-start mb-2">
          <View className={`px-3 py-1 rounded-full ${STATUS_STYLES[item.status].badge}`}>
            <Text className={`text-xs font-semibold ${STATUS_STYLES[item.status].text}`}>
              {STATUS_TITLES[item.status]}
            </Text>
          </View>
          <Text className="text-lg font-bold text-gray-900">{item.price} BYN</Text>
        </View>

        <Text className="text-base font-bold text-gray-900 mb-1">{item.address}</Text>
        <Text className="text-sm text-gray-500 mb-1">{formatOrderTime(item.time)}</Text>
        <Text className="text-sm text-gray-500">
          Объект: {formatCleaningParams(item.cleaningParams)}
        </Text>

        {extraTitles.length > 0 && (
          <Text className="text-sm text-gray-700 mt-2">• {extraTitles.join(', ')}</Text>
        )}

        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            {item.cleanerName ? `Клинер: ${item.cleanerName}` : 'Клинер ещё не назначен'}
          </Text>
          <Text className="text-xs text-gray-400">Заказ {item.id}</Text>
        </View>
      </Card>
    );
  };

  const renderHeader = () => (
    <View className="mb-2">
      {/* Шапка клиента */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Мои заказы 🧾</Text>
        <Text className="text-gray-500 text-sm">Клиент: {clientPhone}</Text>
      </View>

      {/* Сводка по заказам клиента */}
      <Card className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-gray-500">Всего заказов</Text>
          <Text className="text-lg font-bold text-gray-900">{clientOrders.length}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-500">В работе</Text>
          <Text className="text-lg font-bold text-blue-600">{activeOrdersCount}</Text>
        </View>
      </Card>
    </View>
  );

  return (
    <Screen className="px-4 py-4">
      <FlatList
        data={clientOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Card className="items-center py-8">
            <Text className="text-lg font-bold text-gray-900 mb-2">Заказов пока нет</Text>
            <Text className="text-gray-500 text-sm text-center mb-4">
              Оформите первую уборку — статус заказа появится здесь.
            </Text>
            <Button title="Заказать уборку" onPress={() => navigation.navigate('OrderBuilder')} />
          </Card>
        }
      />
    </Screen>
  );
};
