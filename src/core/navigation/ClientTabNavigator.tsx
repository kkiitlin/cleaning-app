import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@/screens/HomeScreen';
import { ClientOrdersScreen } from '@/screens/ClientOrdersScreen';
import { ClientProfileScreen } from '@/screens/ClientProfileScreen';

/** Параметры вкладок клиента: используются для типизации навигации и useNavigation */
export type ClientTabParamList = {
  Home: undefined;
  ClientOrders: undefined;
  ClientProfile: undefined;
};

/** Фирменный цвет «Клининг.бел» (синий, как у кнопок приложения) */
export const CLIENT_TAB_ACTIVE_COLOR = '#2563eb';
/** Неактивная вкладка — серая */
export const CLIENT_TAB_INACTIVE_COLOR = '#6b7280';

type IoniconName = keyof typeof Ionicons.glyphMap;

/** Активная вкладка получает залитую иконку, неактивная — контурную */
const renderTabIcon =
  (inactiveIcon: IoniconName, activeIcon: IoniconName) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
    <Ionicons name={focused ? activeIcon : inactiveIcon} size={size} color={color} />
  );

const Tab = createBottomTabNavigator<ClientTabParamList>();

export const ClientTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CLIENT_TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: CLIENT_TAB_INACTIVE_COLOR,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Главная',
          tabBarIcon: renderTabIcon('home-outline', 'home'),
        }}
      />
      <Tab.Screen
        name="ClientOrders"
        component={ClientOrdersScreen}
        options={{
          tabBarLabel: 'Мои заказы',
          tabBarIcon: renderTabIcon('list-outline', 'list'),
        }}
      />
      <Tab.Screen
        name="ClientProfile"
        component={ClientProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: renderTabIcon('person-outline', 'person'),
        }}
      />
    </Tab.Navigator>
  );
};
