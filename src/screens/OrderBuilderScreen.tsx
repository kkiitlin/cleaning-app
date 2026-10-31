import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { Screen } from '@/shared/ui/Screen';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { useOrderStore, AVAILABLE_EXTRAS, CLEANING_TYPES, type CleaningType } from '@/core/store/useOrderStore';
import { formatDayChip, getAvailableDays, getTimeSlots, toIso } from '@/shared/lib/schedule';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderBuilder'>;

export const OrderBuilderScreen = ({ navigation, route }: Props) => {
  // Читаем данные и экшены через селекторы, чтобы не держать весь стор в переменных
  const {
    roomsCount,
    bathroomsCount,
    selectedExtras,
    totalPrice,
    setRoomsCount,
    setBathroomsCount,
    toggleExtra,
    cleaningType,
    setCleaningType,
  } = useOrderStore((state) => ({
    roomsCount: state.roomsCount,
    bathroomsCount: state.bathroomsCount,
    selectedExtras: state.selectedExtras,
    totalPrice: state.totalPrice,
    setRoomsCount: state.setRoomsCount,
    setBathroomsCount: state.setBathroomsCount,
    toggleExtra: state.toggleExtra,
    cleaningType: state.cleaningType,
    setCleaningType: state.setCleaningType,
  }));

  const setScheduledAt = useOrderStore((state) => state.setScheduledAt);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const days = getAvailableDays(7);
  const slots = selectedDay ? getTimeSlots(selectedDay) : [];

  useEffect(() => {
    if (route.params?.cleaningType) {
      setCleaningType(route.params.cleaningType);
    }
  }, [route.params, setCleaningType]);


  return (
    <Screen className="px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Параметры уборки 🧹
        </Text>

        {/* Тип уборки */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-4">Тип уборки</Text>
          <View className="flex-row gap-3">
            {(['regular', 'general'] as CleaningType[]).map((type) => {
              const isSelected = cleaningType === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setCleaningType(type)}
                  className={`flex-1 p-4 rounded-xl border-2 ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                >
                  <Text className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {CLEANING_TYPES[type].title}
                  </Text>
                  <Text className={`text-sm mt-1 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                    от {CLEANING_TYPES[type].basePrice} BYN
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

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
        {/* Блок 3: Когда приехать */}
        <Card>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Когда приехать
          </Text>

          {/* Дни */}
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            {days.map((day) => {
              const isSelected = selectedDay?.getTime() === day.getTime();
              const formatted = formatDayChip(day);
              return (
                <TouchableOpacity
                  key={day.getTime()}
                  onPress={() => {
                    setSelectedDay(day);
                    setSelectedSlot(null);
                    setScheduledAt(toIso(day, selectedSlot || ''));
                  }}
                  className={`px-3 py-2 rounded-lg border text-center text-sm font-medium ${
                    isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200'
                  }`}
                >
                  {formatted}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Слоты для выбранного дня */}
          {selectedDay && (
            <View className="flex-row flex-wrap gap-2 mt-3">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => {
                      setSelectedSlot(slot);
                      setScheduledAt(toIso(selectedDay, slot));
                    }}
                    className={`px-3 py-1 rounded-md border text-sm font-medium ${
                      isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200'
                    }`}
                  >
                    {slot}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {selectedDay?.getTime() === new Date().setHours(0, 0, 0, 0) && slots.length === 0 && (
            <Text className="text-sm text-gray-500 text-center mt-2">
              На сегодня свободного времени нет
            </Text>
          )}
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