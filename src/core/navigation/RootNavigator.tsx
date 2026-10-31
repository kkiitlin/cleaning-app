import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthScreen } from '@/screens/AuthScreen';
import { OrderBuilderScreen } from '@/screens/OrderBuilderScreen';
import { AddressScreen } from '@/screens/AddressScreen';
import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { ClientOrderDetailScreen } from '@/screens/ClientOrderDetailScreen';
import { CleanerOrderDetailScreen } from '@/screens/CleanerOrderDetailScreen';
import { ClientTabNavigator } from '@/core/navigation/ClientTabNavigator';
import { CleanerTabNavigator } from '@/core/navigation/CleanerTabNavigator';
import { useAuthStore } from '@/core/store/useAuthStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  // Набор экранов зависит от роли: у клиента свои вкладки, у исполнителя — свои.
  // Экраны поверх вкладок живут в корневом стеке, поэтому нижний Tab bar на них скрыт.
  const renderScreens = () => {
    if (!isAuthenticated || !role) {
      return <Stack.Screen name="Auth" component={AuthScreen} />;
    }

    if (role === 'cleaner') {
      return (
        <Stack.Group>
          <Stack.Screen name="CleanerTabs" component={CleanerTabNavigator} />
          <Stack.Screen name="CleanerOrderDetail" component={CleanerOrderDetailScreen} />
        </Stack.Group>
      );
    }

    return (
      <Stack.Group>
        <Stack.Screen name="ClientTabs" component={ClientTabNavigator} />
        <Stack.Screen name="OrderBuilder" component={OrderBuilderScreen} />
        <Stack.Screen name="Address" component={AddressScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="ClientOrderDetail" component={ClientOrderDetailScreen} />
      </Stack.Group>
    );
  };

  const initialRouteName: keyof RootStackParamList =
    !isAuthenticated || !role ? 'Auth' : role === 'cleaner' ? 'CleanerTabs' : 'ClientTabs';

  return (
    // key сбрасывает состояние навигации при смене роли (выход и повторный вход),
    // иначе React Navigation сохранит стек предыдущей роли.
    <Stack.Navigator
      key={role ?? 'guest'}
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      {renderScreens()}
    </Stack.Navigator>
  );
};