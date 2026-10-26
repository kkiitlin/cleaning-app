import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
}

export const Screen = ({ children, className = '', ...props }: ScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className={`flex-1 bg-gray-50 px-4 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};