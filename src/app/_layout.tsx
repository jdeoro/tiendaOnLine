import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background')
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    RobotoBlack: require('@/assets/fonts/Roboto-Black.ttf'),
    RobotoBold: require('@/assets/fonts/Roboto-Bold.ttf'),
    RobotoLight: require('@/assets/fonts/Roboto-Light.ttf'),
    RobotoMedium: require('@/assets/fonts/Roboto-Medium.ttf'),
    RobotoRegular: require('@/assets/fonts/Roboto-Regular.ttf'),
    RobotoThin: require('@/assets/fonts/Roboto-Thin.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <GestureHandlerRootView
      style={{ backgroundColor: backgroundColor, flex: 1 }}
    >
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}></Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

