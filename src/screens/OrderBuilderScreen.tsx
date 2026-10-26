import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { useOrderStore, AVAILABLE_EXTRAS } from '@/core/store/useOrderStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderBuilder'>;

export const OrderBuilderScreen = ({ navigation }: Props) => {
  // Получаем данные и экшены из нашего Zustand стора
  const {
    roomsCount,
    bathroomsCount,
    selectedExtras,
    totalPrice,
    setRoomsCount,
    setBathroomsCount,
    toggleExtra,
  } = useOrderStore();

  return (
    <Screen className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Параметры уборки 🧹
        </Text>

        {/* Блок 1: Количество комнат и санузлов */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Помещения
          </Text>

          {/* Комнаты */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base text-gray-700 font-medium">Комнаты</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-2 py-1">
              <TouchableOpacity
                onPress={() => setRoomsCount(roomsCount - 1)}
                className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm"
              >
                <Text className="text-lg font-bold text-gray-700">-</Text>
              </TouchableOpacity>
              
              <Text className="mx-4 text-base font-bold text-gray-900">{roomsCount}</Text>
              
              <TouchableOpacity
                onPress={() => setRoomsCount(roomsCount + 1)}
                className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm"
              >
                <Text className="text-lg font-bold text-gray-700">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Санузлы */}
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-gray-700 font-medium">Санузлы</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-2 py-1">
              <TouchableOpacity
                onPress={() => setBathroomsCount(bathroomsCount - 1)}
                className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm"
              >
                <Text className="text-lg font-bold text-gray-700">-</Text>
              </TouchableOpacity>
              
              <Text className="mx-4 text-base font-bold text-gray-900">{bathroomsCount}</Text>
              
              <TouchableOpacity
                onPress={() => setBathroomsCount(bathroomsCount + 1)}
                className="w-8 h-8 bg-white rounded-lg items-center justify-center shadow-sm"
              >
                <Text className="text-lg font-bold text-gray-700">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Блок 2: Дополнительные услуги */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Дополнительно
          </Text>

          {AVAILABLE_EXTRAS.map((item) => {
            const isSelected = selectedExtras.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleExtra(item.id)}
                className={`p-3 rounded-xl border mb-2 flex-row justify-between items-center ${
                  isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <Text className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                  {item.title}
                </Text>
                <Text className="text-gray-500 font-semibold">+{item.price} BYN</Text>
              </TouchableOpacity>
            );
          })}
        </Card>
      </ScrollView>

      {/* Фиксированная нижняя панель с итоговой ценой */}
      <View className="pt-4 border-t border-gray-200 bg-gray-50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-500 text-base font-medium">Итого:</Text>
          <Text className="text-2xl font-bold text-gray-900">{totalPrice} BYN</Text>
        </View>

        <View className="flex-row gap-2">
          <Button
            title="Назад"
            className="flex-1 bg-gray-200 active:bg-gray-300"
            onPress={() => navigation.goBack()}
          />
        <Button
            title="Далее"
            className="flex-1"
            onPress={() => navigation.navigate('Address')} // <-- Измененная строка
          />
        </View>
      </View>
    </Screen>
  );
};