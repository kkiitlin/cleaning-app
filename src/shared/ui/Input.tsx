import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-gray-700 font-medium mb-1.5 ml-1">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-white border ${
          error ? 'border-red-500' : 'border-gray-200'
        } rounded-xl px-4 py-3 text-base text-gray-900 ${className}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};