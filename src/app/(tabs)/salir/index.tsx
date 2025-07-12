import { useAuthStore } from '@/src/store/UseAuthStore'
import React, { useEffect } from 'react'
import { Alert, View } from 'react-native'

const Salir = () => {
  const {logout} = useAuthStore()

  const miFuncion = () => {
    logout()
    // Aquí va la lógica que quieras ejecutar
  };


  useEffect(() => {
    Alert.alert(
      'Confirmación',
      '¿Deseas continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => miFuncion(),
        },
      ],
      { cancelable: false }
    );
  }, []);


  return (
  
    <View />
  )
}

export default Salir