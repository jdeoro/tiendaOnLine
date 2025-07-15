import { useAuthStore } from '@/src/store/UseAuthStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegistroScreen = () => {
  const { width } = useWindowDimensions();
  const ASPECT_RATIO_STORE_IMAGE = 1.6; 
  const router = useRouter();
  const {  register } = useAuthStore(); 

  const [ form, setForm ] = useState({
    email: '',  
    password :'',
    nombre : '',
    confirmpass : '',
   })

  const onHandlePress = async () => {
    const { email, password, confirmpass,nombre } = form;
    if ( password !== confirmpass  ){
      Alert.alert("No coincide el password ")
      return
    }

    if ( email == '' || password == '' || confirmpass == '' || nombre == ''  ) {
      Alert.alert("Todos los campos son obligatorios")
      return
    }

    const resultado = await register(email, password,nombre);

    if (resultado) {
      Alert.alert("Felicitiaciones", "Se ha registrado el usuario.");      
      router.replace("/");
      return;
    } else {
     Alert.alert("Error", "Usuario y/o contraseña incorrectos");
    }

  }

  return (
    // Usa SafeAreaView para evitar que el contenido se solape con la barra de estado y la notch

    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer} 
      >

        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/tiendasonline-01.png")} 
            style={[
              styles.storeImage,
              { width: width * 0.7, aspectRatio: 0.75 },
            ]} 
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>

          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Por favor crea una cuenta para continuar
          </Text>

          <View style={styles.inputField}>
            <Image
              source={require("@/assets/images/register/person.png")}
              style={styles.icon}
            />

            <TextInput
              value={form.nombre}
              style={styles.input}
              placeholder="Nombre"
              onChangeText={(value) => setForm({ ...form, nombre: value })}
            />

          </View>
          
          <View style={styles.inputField}>
            <Image
              source={require("@/assets/images/register/mail.png")}
              style={styles.icon}
            />

            <TextInput
              value={form.email}            
              style={styles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              onChangeText={(value) => setForm({ ...form, email: value })}

            />
          </View>

          <View style={styles.inputField}>
            <Image
              source={require("@/assets/images/register/locker.png")}
              style={styles.icon}
            />

            <TextInput
              value={form.password}            
              style={styles.input}
              placeholder="Contraseña"
              onChangeText={(value) => setForm({ ...form, password: value })}
              secureTextEntry
            />
          </View>
          <View style={styles.inputField}>
            <Image
              source={require("@/assets/images/register/locker.png")}
              style={styles.icon}
            />

            <TextInput
              value={form.confirmpass}
              style={styles.input}
              placeholder="Confirmar Contraseña"
              secureTextEntry
              onChangeText={(value) => setForm({ ...form, confirmpass : value })}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={ onHandlePress}>
            <Text style={styles.buttonText}>Registrarse →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1, 
  },
  imageContainer: {
    flex: 3, 
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  storeImage: {
  },
  contentContainer: {
    flex: 7, 
    paddingHorizontal: 20, 
    paddingTop: 20,       
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputField: {
    flexDirection: 'row', 
    alignItems: 'center',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  input: {
    flex: 1, 
    height: '100%', 
  },
  button: {
    backgroundColor: '#007B8A',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#007B8A',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default RegistroScreen;