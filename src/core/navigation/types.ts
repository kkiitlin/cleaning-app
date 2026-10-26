import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ClientTabParamList } from './ClientTabNavigator';
import type { CleanerTabParamList } from './CleanerTabNavigator';

export type RootStackParamList = {
  Auth: undefined;
  // Таб-навигаторы: параметры вложенных вкладок типизированы их ParamList
  ClientTabs: NavigatorScreenParams<ClientTabParamList>;
  CleanerTabs: NavigatorScreenParams<CleanerTabParamList>;
  // Экраны поверх табов: конструктор заказа у клиента и детали заказа у исполнителя
  OrderBuilder: undefined;
  Address: undefined;
  Checkout: undefined;
  CleanerOrderDetail: { orderId: string };
};