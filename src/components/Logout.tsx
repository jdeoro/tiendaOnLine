import { useThemeColor } from '@/src/hooks/useThemeColor'
import { useAuthStore } from '@/src/store/UseAuthStore'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, View } from 'react-native'

const Logout = () => {
   const color = useThemeColor({}, 'primary')
   const { logout} = useAuthStore();
  return (
    <View  style={{ paddingRight: 10 }}>
        <Pressable onPress={logout} /* Aquí puedes agregar la lógica para cerrar sesión */>
          <Ionicons name="log-out-outline" size={24} color="black" />
        </Pressable>
    </View>
  )     
}

export default Logout