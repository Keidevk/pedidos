import { Inter_300Light, Inter_900Black } from "@expo-google-fonts/inter";
import { LilyScriptOne_400Regular } from "@expo-google-fonts/lily-script-one";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import * as Location from 'expo-location';

import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

async function handlerRegisterDelivery({
  cedula,
  email,
  nombre,
  apellido,
  telefono,
  contrasena,
  confirmarContrasena,
  address
}: {
  cedula: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
  address:Location.LocationObject|null
}) {
  if (!cedula || !nombre ||!email || !apellido || !telefono || !contrasena || !confirmarContrasena||!address) {
    Alert.alert('Formulario incompleto', 'Por favor completa todos los campos');
  }

  if (contrasena !== confirmarContrasena) {
    Alert.alert('Contraseña no coincide', 'Verifica que las contraseñas sean iguales');
  }
  
  await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/delivery/register`,{
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ c_i:cedula,email:email,name:nombre,lastname:apellido,phone:telefono,password:contrasena, address:location})

  }).then(res=>{
    if(res.status === 201) {
      Alert.alert("Registro repartidor","Repartidor Creado con exito")
      router.navigate('/(home)')
    }
    else if(res.status === 409){
      Alert.alert("Registro repartidor","Ya existe un repartidor con esos datos")
      router.navigate('/(home)')
    }
  })
}

export default function RepartidorRegistrar(){
  const insets = useSafeAreaInsets();
  const [cedula, onChangeCedula] = useState('')
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = React.useState(''); 
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
   
  useFonts({Inter_900Black,LilyScriptOne_400Regular,Inter_300Light});
 
  useEffect(() => {
      async function getCurrentLocation() {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permiso denegado",'El permiso para la ubicacion fue denegado');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log(location)
      }
  
      getCurrentLocation();
    }, []); 
        
   return(
   <KeyboardAvoidingView
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         style={{ flex: 1 }}>
         <ScrollView
           contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
           keyboardShouldPersistTaps="handled">
   <View>
      <View style={{height:120,alignItems:'center'}}>
        <Image source={require('../../assets/images/logo.svg')}
        contentFit="contain"
        style={{width:200,height:120}} />
      </View>
     <Text style={style.title}>Repartidor</Text>
     <Text style={style.subtitle}>Completa la información a continuación para para acceder a la aplicación</Text>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Cédula"
         value={cedula}
         onChangeText={onChangeCedula}>
       </TextInput>
     </View>
     <View style={style.textinput}>
        <TextInput
          style={{fontFamily:'Inter_300Light'}}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}>
        </TextInput>
      </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Nombre "
         value={nombre}
         onChangeText={setNombre}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Apellido"
         value={apellido}
         onChangeText={setApellido}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Teléfono"
         value={telefono}
         onChangeText={setTelefono}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Contraseña"
         value={contrasena}
         onChangeText={setContrasena}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Confirmar contraseña"
         value={confirmarContrasena}
         onChangeText={setConfirmarContrasena}>
       </TextInput>
     </View>
     <TouchableOpacity style={{
             marginTop:25,
             marginHorizontal:'8%',
             borderRadius:10,
             backgroundColor:'#FE9BAB',
             boxShadow:[{blurRadius:4,offsetX:1,offsetY:2,color:'#828282'}],
           }}>
             <Text onPress={()=>handlerRegisterDelivery({cedula,email,nombre,apellido,telefono,contrasena,confirmarContrasena,address:location})} style={style.textButton}>Registrarse</Text>
           </TouchableOpacity>
         </View>
         </ScrollView>
         </KeyboardAvoidingView>)
 }
 const style = StyleSheet.create({
   textButton:{
   'color':'white',
   'textAlign':'center',
   'marginVertical':10,
   fontFamily:'Inter_300Light'
   },
   title:{
     textAlign:'center',
     fontFamily:'LilyScriptOne_400Regular',
     fontSize:32
   },
   subtitle:{
     textAlign:'center',
     marginHorizontal:'8%'
   },
   textinput:{
     marginTop:25,
     paddingLeft:10,
     'borderRadius':10,
     boxShadow:[{blurRadius:4,offsetX:2,offsetY:6,color:'#E0E0E0'}],
     marginHorizontal:'8%',
     },
 })