# Клининг.бел — мобильное приложение для заказа уборки (Минск)

Expo + React Native + TypeScript. Две роли в одном приложении: **клиент** заказывает уборку, **клинер** (исполнитель) берёт заказы из ленты и выполняет их. Валюта — BYN, телефоны — белорусские (+375). Тексты интерфейса — на русском.

Текущий этап — MVP без бэкенда: все данные живут на устройстве (Zustand + AsyncStorage). Бэкенд на Node.js появится позже; до тех пор не добавляй сетевые запросы, если задача прямо этого не требует.

## Стек

| Что | Чем |
|---|---|
| Запуск | Expo (SDK из `package.json`), `npx expo start` |
| Навигация | **React Navigation** (native-stack + bottom-tabs) |
| Состояние | Zustand + `persist` в AsyncStorage |
| Стили | **NativeWind v4** (Tailwind CSS v3) — классы через `className` |
| Иконки | `@expo/vector-icons` (Ionicons) |
| Карта | `react-native-maps` |

## Структура

```
App.tsx                      — корень: SafeAreaProvider + NavigationContainer + RootNavigator
global.css                   — директивы Tailwind (импортируется в App.tsx)
src/
  core/
    navigation/
      RootNavigator.tsx      — корневой стек; набор экранов зависит от роли
      ClientTabNavigator.tsx — вкладки клиента: Home, ClientOrders, ClientProfile
      CleanerTabNavigator.tsx— вкладки клинера: CleanerFeed, CleanerTasks, CleanerProfile
      types.ts               — RootStackParamList (типы всех экранов стека)
    store/
      useAuthStore.ts        — сессия: phone, role, isAuthenticated
      useOrderStore.ts       — черновик заказа + общий список заказов orders[]
  screens/                   — по одному файлу на экран, именованный экспорт XxxScreen
  shared/
    lib/                     — чистые функции (форматирование, расчёты), без React
    ui/                      — переиспользуемые компоненты: Button, Card, Input, Screen
```

## Как устроены основные потоки

- **Вход** (`AuthScreen`): телефон → выбор роли → `useAuthStore.setAuth(phone, role)`. `RootNavigator` показывает экраны по роли.
- **Заказ клиента**: `OrderBuilder` (комнаты, санузлы, доп. услуги) → `Address` → `Checkout` → `createOrder()` в `useOrderStore`. Черновик заказа — поля `roomsCount`, `bathroomsCount`, `selectedExtras`, `address`, `totalPrice`; после оформления — `resetOrder()`.
- **Работа клинера**: `CleanerFeed` (заказы со статусом `new`) → `CleanerOrderDetail` → `acceptOrder()` → `updateOrderStatus()`.
- **Статусы заказа**: `new` → `accepted` → `in_progress` → `completed`. Клинер может вести только один активный заказ.
- Клинер идентифицируется по телефону: в `order.cleanerName` сейчас записывается телефон исполнителя.
- Цена считается в `calculateTotal` в `useOrderStore.ts`; выплата клинеру — `getCleanerPayout` (80%) в `shared/lib/orders.ts`.

## Правила

### Навигация
- Используй **React Navigation**, НЕ Expo Router. Не создавай папку `src/app/` и файлы `_layout.tsx`.
- Новый экран поверх вкладок: добавь его в `RootStackParamList` (`types.ts`) и в нужную группу `RootNavigator.tsx`.
- Новая вкладка: добавь её в `ClientTabParamList` / `CleanerTabParamList` и в соответствующий таб-навигатор.
- Типизируй пропсы экранов: `NativeStackScreenProps<RootStackParamList, 'Имя'>`, для вкладок — `CompositeScreenProps<BottomTabScreenProps<...>, NativeStackScreenProps<RootStackParamList>>` (пример — `HomeScreen.tsx`).

### Стили
- Только `className` с классами Tailwind. Не используй `StyleSheet.create` и инлайн `style`, кроме случаев, когда без них нельзя (например, `insets` из safe area или `style={{ flex: 1 }}` у `MapView`).
- Классы с условиями собирай шаблонной строкой, как в существующих экранах.
- Основной цвет — `blue-600` (#2563eb), фон экранов — `gray-50`, успех/деньги — `green-600`, ошибки — `red-500`.
- Каждый экран оборачивай в `<Screen>`, блоки — в `<Card>`, кнопки — `<Button>`, поля — `<Input>` из `src/shared/ui`.

### Состояние
- Читай стор через селекторы: `useOrderStore((s) => s.orders)`, а не `useOrderStore()` целиком.
- Новые данные, которые должны пережить перезапуск, добавляй в `partialize` стора и повышай `version`.
- Логику расчётов и форматирования клади в `src/shared/lib`, а не в экраны.

### Код
- TypeScript strict, без `any`. Импорты из `src` — через алиас `@/` (например, `@/shared/ui/Button`).
- Именованные экспорты (`export const XxxScreen = ...`), не `export default` (кроме `App.tsx`).
- Комментарии и тексты интерфейса — на русском.
- Не трогай файлы, которые не относятся к задаче. Не переименовывай и не переноси существующие файлы без прямой просьбы.

### Expo
- Пакеты ставь только через `npx expo install <пакет>` — он подбирает версии под текущий SDK. Не используй `npm install` для зависимостей приложения.
- Expo часто меняет API между версиями SDK. Если не уверен в API — смотри документацию нужной версии: `https://docs.expo.dev/versions/v<мажорная версия expo>.0.0/` и https://docs.expo.dev/llms.txt
- Папки `ios/` и `android/` генерируются автоматически — не создавай и не редактируй их вручную; нативные настройки — в `app.json`.
- Expo Go содержит только встроенные нативные модули. Библиотека с собственным нативным кодом потребует development build — предупреди об этом перед установкой.

## Проверка перед завершением задачи

```bash
npx tsc --noEmit     # проверка типов — ошибок быть не должно
npx expo-doctor      # проверка зависимостей и конфигурации
```

После этого запусти `npx expo start` и проверь изменённые экраны в Expo Go.
