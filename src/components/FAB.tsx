import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';


interface Props {
  iconName: keyof typeof MaterialIcons.glyphMap //.getRawGlyphMap; // Ionicons.glyphMap;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;

}

export const FAB = ({ style, iconName, onPress, children }: Props) => {
  const foreColor = useThemeColor({}, 'primary')
  const backColor = useThemeColor({}, 'background')

  return (
    <TouchableOpacity
      style={[
        {
          zIndex: 99,

          position: 'absolute',
          bottom: 30,
          right: 90,

          // width: 60,
          // height: 60,

          paddingHorizontal: 20,
          paddingVertical: 12,

          shadowColor: 'black',
          backgroundColor: backColor,
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 3,
          borderRadius: 30,

          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      onPress={onPress}
    >
      <MaterialIcons name={iconName} size={30} color={foreColor} />

     {children && <Text style={{ color: foreColor }}>{children}</Text>}


    </TouchableOpacity>


  );
};
