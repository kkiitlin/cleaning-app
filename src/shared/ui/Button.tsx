import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  /** Текст кнопки. Можно не указывать, если передаются children (например, спиннер загрузки). */
  title?: string;
  /** Классы для внутреннего текста кнопки */
  textClassName?: string;
}

export const Button = ({
  title,
  className = '',
  textClassName = '',
  disabled,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      className={`bg-blue-600 rounded-xl py-4 px-6 items-center justify-center active:bg-blue-700 ${
        disabled ? 'opacity-60' : ''
      } ${className}`}
      {...rest}
    >
      {children ?? (
        <Text className={`text-white text-base font-bold ${textClassName}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
