import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { OrderStatus, useOrderStore } from '@/core/store/useOrderStore';
import { CLIENT_STATUS_TITLES, STATUS_STYLES } from '@/shared/lib/orderStatus';
import { formatCleaningParams, formatOrderTime, getExtraTitles } from '@/shared/lib/orders';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientOrderDetail'>;

/** Шаги шкалы прогресса заказа для клиента */
const PROGRESS_STEPS: { label: string; status: OrderStatus }[] = [
  { label: 'Оформлен', status: 'new' },
  { label: 'Клинер назначен', status: 'accepted' },
  { label: 'Уборка идёт', status: 'in_progress' },
  { label: 'Выполнен', status: 'completed' },
];

/** Номер текущего шага по статусу заказа (неизвестный статус — первый шаг) */
const statusToProgressIndex = (status: OrderStatus): number => {
  const index = PROGRESS_STEPS.findIndex((step) => step.status === status);
  return index === -1 ? 0 : index;
};

export const ClientOrderDetailScreen = ({ navigation, route }: Props) => {
  const { orderId } = route.params;

  const order = useOrderStore((state) => state.orders.find((item) => item.id === orderId));
  const cancelOrder = useOrderStore((state) => state.cancelOrder);

  // Заказ мог пропасть из стора, пока экран открыт
  if (!order) {
    return (
      <Screen className="justify-center px-4">
        <Card className="items-center py-8">
          <Text className="text-lg font-bold text-gray-900 mb-2">Заказ не найден</Text>
          <Text className="text-gray-500 text-sm text-center mb-4">
            Возможно, номер заказа неверный или заказ ещё не оплачен.
          </Text>
          <Button
            title="К моим заказам"
            onPress={() => navigation.navigate('ClientTabs', { screen: 'ClientOrders' })}
          />
        </Card>
      </Screen>
    );
  }

  // Обычное вычисление, без хуков: хуки нельзя вызывать после раннего return
  const currentProgressIndex = statusToProgressIndex(order.status);
  const extraTitles = getExtraTitles(order.cleaningParams.extras);

  const handleCancel = () => {
    Alert.alert('Отменить заказ?', 'Заказ будет отменён, восстановить его не получится.', [
      { text: 'Нет', style: 'cancel' },
      { text: 'Да, отменить', style: 'destructive', onPress: () => cancelOrder(order.id) },
    ]);
  };

  const renderProgressStep = (step: { label: string; status: OrderStatus }, index: number) => {
    const isReached = index <= currentProgressIndex;

    return (
      <View key={step.status} className="flex-1 items-center">
        <View
          className={`w-4 h-4 rounded-full border-2 mb-1 ${
            isReached ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-300'
          }`}
        />
        <Text
          className={`text-xs text-center font-medium ${
            isReached ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {step.label}
        </Text>
      </View>
    );
  };

  return (
    <Screen className="px-4 py-4">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-1 pr-3">
          <Text className="text-2xl font-bold text-gray-900">Заказ {order.id}</Text>
          <Text className={`text-sm font-medium ${STATUS_STYLES[order.status].text}`}>
            {CLIENT_STATUS_TITLES[order.status]}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-200 px-3 py-2 rounded-xl"
        >
          <Text className="text-xs font-semibold text-gray-700">Назад</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {order.status === 'cancelled' ? (
          <Card className="items-center py-6 bg-gray-100">
            <Text className="text-lg font-semibold text-center text-gray-500">Заказ отменён</Text>
          </Card>
        ) : (
          <Card>
            <Text className="text-xs text-gray-500 mb-3">Прогресс заказа</Text>
            <View className="flex-row justify-between">
              {PROGRESS_STEPS.map(renderProgressStep)}
            </View>
          </Card>
        )}

        <Card>
          <Text className="text-xs text-gray-500 mb-1">Адрес объекта</Text>
          <Text className="text-lg font-bold text-gray-900 mb-3">{order.address}</Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Дата и время</Text>
            <Text className="font-semibold text-gray-900">{formatOrderTime(order.time)}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Объект</Text>
            <Text className="font-semibold text-gray-900 flex-1 text-right ml-4">
              {formatCleaningParams(order.cleaningParams)}
            </Text>
          </View>
        </Card>

        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3">Клинер</Text>
          <Text className="font-semibold text-gray-900">
            {order.cleanerName ?? 'Ещё ищем исполнителя'}
          </Text>
        </Card>

        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3">Доп. услуги</Text>
          {extraTitles.length > 0 ? (
            extraTitles.map((extra) => (
              <Text key={extra} className="text-gray-700 mb-1">
                • {extra}
              </Text>
            ))
          ) : (
            <Text className="text-gray-500 text-sm">Только базовая уборка</Text>
          )}
        </Card>

        {order.comment ? (
          <Card>
            <Text className="text-lg font-semibold text-gray-800 mb-3">Ваш комментарий</Text>
            <Text className="text-gray-700">{order.comment}</Text>
          </Card>
        ) : null}

        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3">Оплата</Text>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600">Сумма заказа</Text>
            <Text className="text-2xl font-bold text-gray-900">{order.price} BYN</Text>
          </View>
          <Text className="text-xs text-gray-500">
            Списание происходит после завершения работ и подтверждения качества уборки.
          </Text>
        </Card>
      </ScrollView>

      {/* Отмена доступна, только пока заказ никто не взял */}
      {order.status === 'new' ? (
        <View className="pt-4 border-t border-gray-200 bg-gray-50">
          <Button
            title="Отменить заказ"
            className="bg-red-500 active:bg-red-600"
            onPress={handleCancel}
          />
        </View>
      ) : null}
    </Screen>
  );
};