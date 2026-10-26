import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useOrderStore, AVAILABLE_EXTRAS } from '@/core/store/useOrderStore';
import { useAuthStore } from '@/core/store/useAuthStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

type PaymentMethod = 'card' | 'erip' | 'cash';

const PAYMENT_METHODS: { id: PaymentMethod; title: string }[] = [
  { id: 'card', title: '💳 Банковской картой онлайн' },
  { id: 'erip', title: '🌳 Система «Расчет» (ЕРИП)' },
  { id: 'cash', title: '💵 Наличными клинеру' },
];

export const CheckoutScreen = ({ navigation }: Props) => {
  const roomsCount = useOrderStore((state) => state.roomsCount);
  const bathroomsCount = useOrderStore((state) => state.bathroomsCount);
  const selectedExtras = useOrderStore((state) => state.selectedExtras);
  const address = useOrderStore((state) => state.address);
  const totalPrice = useOrderStore((state) => state.totalPrice);
  const createOrder = useOrderStore((state) => state.createOrder);
  const resetOrder = useOrderStore((state) => state.resetOrder);
  const phone = useAuthStore((state) => state.phone);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Находим названия выбранных доп. услуг
  const selectedExtraTitles = selectedExtras
    .map((id) => AVAILABLE_EXTRAS.find((e) => e.id === id)?.title)
    .filter((title): title is string => Boolean(title));

  // Заказ назначаем на ближайший час
  const scheduledAt = new Date(Date.now() + 60 * 60 * 1000);

  const handlePay = () => {
    setIsProcessing(true);

    // Имитация сетевого запроса к платежному шлюзу (BePaid / ЕРИП)
    setTimeout(() => {
      // Заказ уходит в общий стор: его сразу видят исполнители (см. CleanerFeedScreen)
      const orderId = createOrder({
        cleaningParams: { rooms: roomsCount, bathrooms: bathroomsCount, extras: selectedExtras },
        address: address || 'г. Минск, адрес уточняется у клиента',
        time: scheduledAt.toISOString(),
        price: totalPrice,
        clientPhone: phone ?? undefined,
      });

      // Заказ оформлен — корзина больше не нужна
      resetOrder();

      setCreatedOrderId(orderId);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleFinish = () => {
    navigation.popToTop(); // Возврат к корню стека: табы клиента (главная вкладка)
  };

  if (isSuccess) {
    return (
      <Screen className="justify-center items-center px-4">
        <Card className="items-center py-8">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl">✅</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Заказ успешно оформлен!
          </Text>

          <Text className="text-gray-500 text-center mb-6 px-2">
            Мы уже подбираем клинера. Информация о заказе и SMS-уведомление отправлены на{' '}
            {phone ?? 'указанный номер'}.
          </Text>

          {createdOrderId ? (
            <Text className="text-xs text-gray-400 mb-4">Номер заказа: {createdOrderId}</Text>
          ) : null}

          <Button title="На главную" onPress={handleFinish} className="w-full" />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Подтверждение заказа 📋
        </Text>

        {/* Детали заказа */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">
            Состав услуги
          </Text>

          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Объект:</Text>
            <Text className="font-semibold text-gray-900">
              {roomsCount} комн., {bathroomsCount} сануз.
            </Text>
          </View>

          {selectedExtraTitles.length > 0 && (
            <View className="mb-2">
              <Text className="text-gray-600 mb-1">Доп. услуги:</Text>
              {selectedExtraTitles.map((title) => (
                <Text key={title} className="text-gray-900 font-medium ml-2">
                  • {title}
                </Text>
              ))}
            </View>
          )}

          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
            <Text className="text-gray-600">Адрес:</Text>
            <Text className="font-semibold text-gray-900 flex-1 text-right ml-4">
              {address || 'Не указан'}
            </Text>
          </View>

          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-600">Телефон:</Text>
            <Text className="font-semibold text-gray-900">{phone ?? 'Не указан'}</Text>
          </View>
        </Card>

        {/* Способ оплаты */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-3">Способ оплаты</Text>

          {PAYMENT_METHODS.map((method) => {
            const isActive = paymentMethod === method.id;

            return (
              <TouchableOpacity
                key={method.id}
                onPress={() => setPaymentMethod(method.id)}
                className={`p-3 rounded-xl border mb-2 flex-row justify-between items-center ${
                  isActive ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Text className="font-medium text-gray-800">{method.title}</Text>
                {isActive && <Text className="text-blue-600 font-bold">✓</Text>}
              </TouchableOpacity>
            );
          })}
        </Card>
      </ScrollView>

      {/* Фиксированный блок итоговой оплаты */}
      <View className="pt-4 border-t border-gray-200 bg-gray-50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-500 text-base font-medium">К оплате:</Text>
          <Text className="text-3xl font-bold text-gray-900">{totalPrice} BYN</Text>
        </View>

        <Button title="Оплатить и заказать" onPress={handlePay} disabled={isProcessing}>
          {isProcessing ? <ActivityIndicator color="#ffffff" /> : null}
        </Button>
      </View>
    </Screen>
  );
};
