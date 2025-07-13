
{/* EJEMPLO DE USO
   <ThemedLink href="/auth/login" asChild>
  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
    <FontAwesome name="sign-in" size={20} color="blue" />
    <Text style={{ marginLeft: 8 }}>Ingresar</Text>
  </TouchableOpacity>
   </ThemedLink>
 */}


import { Link } from 'expo-router';
import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useThemeColor } from '../hooks/useThemeColor';

type ThemedLinkProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle | TextStyle>;
  asChild?: boolean;
} & Parameters<typeof Link>[0]; // Usa los props del Link directamente

const ThemedLink = ({ style, children, asChild, ...rest }: ThemedLinkProps) => {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <Link
      style={[
        {
          color: primaryColor,
        },
        style,
      ]}
      asChild={asChild}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default ThemedLink;