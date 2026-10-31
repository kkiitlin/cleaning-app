import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RootStackParamList } from '@/core/navigation/types';
import { Screen } from '@/shared/ui/Screen';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useOrderStore } from '@/core/store/useOrderStore';
import { formatAddress } from '@/shared/lib/address';

type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

export const AddressScreen = ({ navigation }: Props) => {
  const setAddress = useOrderStore((state) => state.setAddress);

  // Поле комментария к заказу
  const comment = useOrderStore((state) => state.comment);
  const setComment = useOrderStore((state) => state.setComment);

  // Локальные стейты для формы
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');

  // Координаты центра Минска по умолчанию
  const minskRegion = {
    latitude: 53.9006,
    longitude: 27.5590,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleSaveAddress = () => {
    const fullAddress = formatAddress({ street, entrance, apartment });
    setAddress(fullAddress);
    
    // Переход к экрану оплаты
    navigation.navigate('Checkout');
  };

  return (
    <Screen className="px-0 py-0 pb-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Блок с картой */}
        <View className="h-64 w-full bg-gray-200">
          <MapView
            style={{ flex: 1 }}
            initialRegion={minskRegion}
            provider={PROVIDER_GOOGLE}
          >
            <Marker coordinate={{ latitude: 53.9006, longitude: 27.5590 }} />
          </MapView>
        </View>

        <View className="px-4 -mt-6">
          <Card className="shadow-lg">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Куда приехать клинеру?
            </Text>

            <Input
              label="Улица и дом"
              placeholder="Например, ул. П. Бровки, 6"
              value={street}
              onChangeText={setStreet}
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Input
                  label="Подъезд"
                  placeholder="1"
                  keyboardType="number-pad"
                  value={entrance}
                  onChangeText={setEntrance}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Квартира"
                  placeholder="42"
                  keyboardType="number-pad"
                  value={apartment}
                  onChangeText={setApartment}
                />
              </View>
            </View>

            <View className="mt-4">
              <Input
                label="Комментарий для клинера"
                placeholder="Например: есть кот, код домофона 45К"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={3}
                maxLength={300}
              />
            </View>

            <Button
              title="Подтвердить адрес"
              onPress={handleSaveAddress}
              className="mt-4"
              disabled={street.trim().length < 3}
            />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};