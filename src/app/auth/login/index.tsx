import { ExternalLink } from '@/src/components/ExternalLink'
import { ThemedText } from '@/src/components/ThemedText'
import ThemedTextInput from '@/src/components/ThemedTextInput'
import { useThemeColor } from '@/src/hooks/useThemeColor'
import { useAuthStore } from '@/src/store/UseAuthStore'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Button, KeyboardAvoidingView, useWindowDimensions, View } from 'react-native'

const IndexLogin = () => {
  const { height } = useWindowDimensions();
  const [ form, setForm ] = useState({
    email: '',  
    password :''
   })

  const bkcolor  = useThemeColor({}, 'background')
  const { estado, login , checkStatus} = useAuthStore(); 

  const handleLogin = async () => {
    const { email, password } = form;
    const resultado = await login(email, password);

    if (resultado) {
      router.replace("/");
      return;
    } else {
     Alert.alert("Error", "Usuario y/o contraseña incorrectos");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 , }} behavior="padding">
      <View style={{paddingTop: height * 0.35, paddingHorizontal:50 , justifyContent: "center", alignItems: "flex-start"  }}>
        <ThemedText style={{ fontFamily:'RobotoBold'}} type='title'>Ingresar</ThemedText>
        <ThemedText type='subtitle'  style={{ fontFamily: "RobotoThin", fontSize:10,paddingTop:1, paddingBottom:10, color:'gray' }}>Por favor , ingrese para continuar</ThemedText>
          <ThemedTextInput value={form.email} placeholder='Correo electrónico' icon='mail-open-outline' onChangeText={ (value) => setForm({ ...form , email : value}) }  />
          <ThemedTextInput value={form.password} placeholder='Contraseña' icon='lock-open-outline' onChangeText={ (value) => setForm({ ...form, password : value }) } />

        <View style={{ marginTop: 20, marginHorizontal: 10 }}>
          <Button title="Login" onPress={handleLogin} />
        </View>

        <View style={{ flexDirection: 'column', alignContent: 'stretch',  marginTop: 20, marginHorizontal: 10 }}> 
          <ExternalLink href='/auth/register'>
            <ThemedText type='subtitle' style={{ fontFamily: "RobotoThin", fontSize:10,paddingTop:10, color:'gray' }}>Olvidaste tu contraseña?</ThemedText>
          </ExternalLink >

          <ExternalLink href='/auth/register'>
             <ThemedText>¿No tienes cuenta,</ThemedText>
             <ThemedText>¿crear una?</ThemedText>
          </ExternalLink >

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

export default IndexLogin