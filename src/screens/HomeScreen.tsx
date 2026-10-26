import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import type { ClientTabParamList } from '@/core/navigation/ClientTabNavigator';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/core/store/useAuthStore';

// Главная — вкладка таб-навигатора клиента, но конструктор заказа
// и список заказов открываются в корневом стеке и в других вкладках.
type Props = CompositeScreenProps<
  BottomTabScreenProps<ClientTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen = ({ navigation }: Props) => {
  const phone = useAuthStore((state) => state.phone);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Screen className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Шапка с брендом и кнопкой выхода из аккаунта */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-1 pr-3">
            <Text className="text-2xl font-bold text-gray-900">Клининг.бел 🧹</Text>
            <Text className="text-gray-500 text-sm">Быстрый заказ уборки в Минске</Text>
            <Text className="text-xs text-gray-400 mt-1">
              Клиент: {phone ?? 'номер не указан'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            className="bg-gray-200 px-3 py-2 rounded-xl"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-semibold text-gray-700">Выйти</Text>
          </TouchableOpacity>
        </View>

        {/* Главная карточка с расчетом стоимости */}
        <Card className="p-5 mb-6 bg-blue-600 rounded-2xl">
          <Text className="text-white text-2xl font-bold mb-2">Рассчитать стоимость</Text>
          <Text className="text-blue-100 text-sm mb-4">
            Укажите количество комнат, удобную дату и дополнительные опции.
          </Text>
          <Button
            title="Перейти к расчету →"
            className="bg-white"
            textClassName="text-blue-600 font-bold"
            onPress={() => navigation.navigate('OrderBuilder')}
          />
        </Card>

        {/* Переход к списку заказов клиента */}
        <Card className="p-4 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-base font-bold text-gray-900">Мои заказы</Text>
            <Text className="text-xs text-gray-500 mt-1">
              Статусы уборок, назначенный клинер и история выездов
            </Text>
          </View>
          <Button
            title="Открыть"
            className="px-3 py-2 flex-none"
            onPress={() => navigation.navigate('ClientOrders')}
          />
        </Card>

        {/* Категории услуг */}
        <Text className="text-xl font-bold text-gray-900 mb-3">Популярные услуги</Text>

        <View className="gap-3 mb-6">
          <Card className="p-4 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-bold text-gray-900">Поддерживающая уборка</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Очистка поверхностей, полов и сантехники
              </Text>
              <Text className="text-sm font-semibold text-blue-600 mt-2">от 45 BYN</Text>
            </View>
            <Button
              title="Заказать"
              className="px-3 py-2 flex-none"
              onPress={() => navigation.navigate('OrderBuilder')}
            />
          </Card>

          <Card className="p-4 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-bold text-gray-900">Генеральная уборка</Text>
              <Text className="text-xs text-gray-500 mt-1">Глубокая очистка каждого уголка</Text>
              <Text className="text-sm font-semibold text-blue-600 mt-2">от 90 BYN</Text>
            </View>
            <Button
              title="Заказать"
              className="px-3 py-2 flex-none"
              onPress={() => navigation.navigate('OrderBuilder')}
            />
          </Card>
        </View>

        {/* Преимущества */}
        <Text className="text-xl font-bold text-gray-900 mb-3">Почему мы?</Text>
        <Card className="p-4 mb-6 gap-3">
          <View className="flex-row items-start gap-3">
            <Text className="text-xl">🛡️</Text>
            <View className="flex-1">
              <Text className="font-bold text-gray-900">Проверенные исполнители</Text>
              <Text className="text-xs text-gray-500">Все клинеры проходят личный отбор.</Text>
            </View>
          </View>

          <View className="flex-row items-start gap-3">
            <Text className="text-xl">💳</Text>
            <View className="flex-1">
              <Text className="font-bold text-gray-900">Оплата после проверки</Text>
              <Text className="text-xs text-gray-500">Списание только после завершения работ.</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
};
