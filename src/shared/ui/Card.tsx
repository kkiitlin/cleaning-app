import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <View 
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 w-full mb-4 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};