import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ClientTabParamList } from './ClientTabNavigator';
import type { CleanerTabParamList } from './CleanerTabNavigator';
import type { CleaningType } from '../store/useOrderStore';

export type RootStackParamList = {
  Auth: undefined;
  // Таб-навигаторы: параметры вложенных вкладок типизированы их ParamList
  ClientTabs: NavigatorScreenParams<ClientTabParamList>;
  CleanerTabs: NavigatorScreenParams<CleanerTabParamList>;
  // Экраны поверх табов: конструктор заказа у клиента и детали заказа у исполнителя
  OrderBuilder: { cleaningType?: CleaningType } | undefined;
  ClientOrderDetail: { orderId: string };
  Address: undefined;
  Checkout: undefined;
  CleanerOrderDetail: { orderId: string };
};