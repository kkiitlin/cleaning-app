import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CleanerFeedScreen } from '@/screens/CleanerFeedScreen';
import { CleanerTasksScreen } from '@/screens/CleanerTasksScreen';
import { CleanerProfileScreen } from '@/screens/CleanerProfileScreen';

/** Параметры вкладок исполнителя: используются для типизации навигации и useNavigation */
export type CleanerTabParamList = {
  CleanerFeed: undefined;
  CleanerTasks: undefined;
  CleanerProfile: undefined;
};

/** Фирменный цвет «Клининг.бел» (синий, как у кнопок приложения) */
export const CLEANER_TAB_ACTIVE_COLOR = '#2563eb';
/** Неактивная вкладка — серая */
export const CLEANER_TAB_INACTIVE_COLOR = '#6b7280';

type IoniconName = keyof typeof Ionicons.glyphMap;

/** Активная вкладка получает залитую иконку, неактивная — контурную */
const renderTabIcon =
  (inactiveIcon: IoniconName, activeIcon: IoniconName) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
    <Ionicons name={focused ? activeIcon : inactiveIcon} size={size} color={color} />
  );

const Tab = createBottomTabNavigator<CleanerTabParamList>();

export const CleanerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="CleanerFeed"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CLEANER_TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: CLEANER_TAB_INACTIVE_COLOR,
      }}
    >
      <Tab.Screen
        name="CleanerFeed"
        component={CleanerFeedScreen}
        options={{
          tabBarLabel: 'Лента заказов',
          tabBarIcon: renderTabIcon('search-outline', 'search'),
        }}
      />
      <Tab.Screen
        name="CleanerTasks"
        component={CleanerTasksScreen}
        options={{
          tabBarLabel: 'Мои задачи',
          tabBarIcon: renderTabIcon('briefcase-outline', 'briefcase'),
        }}
      />
      <Tab.Screen
        name="CleanerProfile"
        component={CleanerProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: renderTabIcon('person-outline', 'person'),
        }}
      />
    </Tab.Navigator>
  );
};
