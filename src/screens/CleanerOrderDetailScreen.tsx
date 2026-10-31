import { useMemo } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { OrderStatus, useOrderStore } from '@/core/store/useOrderStore';
import { useAuthStore } from '@/core/store/useAuthStore';
import {
  CLEANER_ACTIVE_STATUSES,
  CLEANER_STATUS_TITLES,
  STATUS_STYLES,
} from '@/shared/lib/orderStatus';
import {
  formatCleaningParams,
  formatOrderTime,
  getCleanerPayout,
  getExtraTitles,
} from '@/shared/lib/orders';

type Props = NativeStackScreenProps<RootStackParamList, 'CleanerOrderDetail'>;

/** Заказ считается «в работе», пока закреплён за исполнителем и не завершён */


export const CleanerOrderDetailScreen = ({ navigation, route }: Props) => {
  const { orderId } = route.params;

  const order = useOrderStore((state) => state.orders.find((o) => o.id === orderId));
  const orders = useOrderStore((state) => state.orders);
  const acceptOrder = useOrderStore((state) => state.acceptOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const releaseOrder = useOrderStore((state) => state.releaseOrder);
  const phone = useAuthStore((state) => state.phone);

  // За заказом закрепляется телефон исполнителя, под которым он вошёл
  const cleanerName = phone ?? 'Клинер';

  // Клинер может вести только один заказ одновременно
  const activeOrderId = useMemo(
    () =>
      orders.find((item) => item.cleanerName === cleanerName && CLEANER_ACTIVE_STATUSES.includes(item.status))
        ?.id ?? null,
    [orders, cleanerName]
  );

  // Заказ мог исчезнуть из ленты, пока экран открыт
  if (!order) {
    return (
      <Screen className="justify-center px-4">
        <Card className="items-center py-8">
          <Text className="text-lg font-bold text-gray-900 mb-2">Заказ не найден</Text>
          <Text className="text-gray-500 text-sm text-center mb-4">
            Возможно, заказ уже забрал другой исполнитель.
          </Text>
          <Button title="К ленте заказов" onPress={() => navigation.goBack()} />
        </Card>
      </Screen>
    );
  }

  const isBusyWithAnotherOrder = activeOrderId !== null && activeOrderId !== orderId;

  const handleAccept = () => {
    if (isBusyWithAnotherOrder) {
      Alert.alert('Уже есть активный заказ', 'Сначала завершите текущую уборку.');
      return;
    }

    acceptOrder(order.id, cleanerName);
    Alert.alert('Заказ закреплён за вами', `${order.address}\n${formatOrderTime(order.time)}`);
  };

  const handleComplete = () => {
    Alert.alert('Завершить заказ?', 'Клиент подтвердит качество уборки.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Завершить',
        onPress: () => {
          updateOrderStatus(order.id, 'completed');
          navigation.goBack();
        },
      },
    ]);
  };

  const renderAction = () => {
    if (order.status === 'new') {
      return (
        <Button
          title={isBusyWithAnotherOrder ? 'Сначала завершите текущий заказ' : 'Откликнуться на заказ'}
          disabled={isBusyWithAnotherOrder}
          onPress={handleAccept}
        />
      );
    }

    if (order.status === 'accepted') {
      return (
        <>
          <Button
            title="Я на месте, начать уборку"
            className="bg-green-600 active:bg-green-700"
            onPress={() => updateOrderStatus(order.id, 'in_progress')}
          />
          <Button
            title="Отказаться от заказа"
            className="mt-2 bg-gray-200 active:bg-gray-300"
            onPress={() => {
              Alert.alert('Отказаться от заказа?', 'Вы уверены, что хотите отказаться от этого заказа?', [
                { text: 'Отмена', style: 'cancel' },
                {
                  text: 'Отказаться',
                  onPress: () => {
                    releaseOrder(order.id, cleanerName);
                    navigation.goBack();
                  },
                },
              ]);
            }}
          />
        </>
      );
    }

    if (order.status === 'in_progress') {
      return (
        <Button
          title="Завершить уборку"
          className="bg-green-600 active:bg-green-700"
          onPress={handleComplete}
        />
      );
    }

    return <Button title="К ленте заказов" onPress={() => navigation.goBack()} />;
  };

  return (
    <Screen className="px-4 py-4">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Заказ {order.id}</Text>
          <Text className={`text-sm font-medium ${STATUS_STYLES[order.status].text}`}>
            {CLEANER_STATUS_TITLES[order.status]}
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
        <Card>
          <Text className="text-xs text-gray-500 mb-1">Адрес объекта</Text>
          <Text className="text-lg font-bold text-gray-900 mb-3">{order.address}</Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Дата и время</Text>
            <Text className="font-semibold text-gray-900">{formatOrderTime(order.time)}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Объект</Text>
            <Text className="font-semibold text-gray-900">
              {formatCleaningParams(order.cleaningParams)}
            </Text>
          </View>
        </Card>

        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3">Клиент</Text>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Телефон</Text>
            <Text className="font-semibold text-gray-900">{order.clientPhone}</Text>
          </View>

          {order.cleanerName ? (
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-600">Исполнитель</Text>
              <Text className="font-semibold text-gray-900">{order.cleanerName}</Text>
            </View>
          ) : null}
        </Card>

        {order.comment ? (
          <Card>
            <Text className="text-lg font-semibold text-gray-800 mb-3">Комментарий клиента</Text>
            <Text className="text-gray-700">{order.comment}</Text>
          </Card>
        ) : null}

        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3">Доп. работы</Text>
          {getExtraTitles(order.cleaningParams.extras).length > 0 ? (
            getExtraTitles(order.cleaningParams.extras).map((extra) => (
              <Text key={extra} className="text-gray-700 mb-1">
                • {extra}
              </Text>
            ))
          ) : (
            <Text className="text-gray-500 text-sm">Только базовая уборка</Text>
          )}
        </Card>

        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3">Оплата</Text>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600">Стоимость заказа</Text>
            <Text className="text-lg font-bold text-gray-900">{order.price} BYN</Text>
          </View>

          <View className="flex-row justify-between items-center border-t border-gray-100 pt-2">
            <Text className="text-gray-600">Ваша выплата</Text>
            <Text className="text-2xl font-bold text-green-600">
              {getCleanerPayout(order.price)} BYN
            </Text>
          </View>

          <Text className="text-xs text-gray-500 mt-2">
            Удерживается комиссия сервиса 20%: сумма выплачивается после приёмки работ клиентом.
          </Text>
        </Card>
      </ScrollView>

      <View className="pt-4 border-t border-gray-200 bg-gray-50">{renderAction()}</View>
    </Screen>
  );
};
