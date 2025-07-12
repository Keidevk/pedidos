import { Inter_300Light, Inter_900Black } from "@expo-google-fonts/inter";
import { LilyScriptOne_400Regular } from "@expo-google-fonts/lily-script-one";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export async function handlerRegisterClient({
  cedula,
  nombre,
  apellido,
  telefono,
  contrasena,
  confirmarContrasena,
}: {
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
}) {
  if (!cedula || !nombre || !apellido || !telefono || !contrasena || !confirmarContrasena) {
    Alert.alert('Formulario incompleto', 'Por favor completa todos los campos');
  }

  if (contrasena !== confirmarContrasena) {
    Alert.alert('Contraseña no coincide', 'Verifica que las contraseñas sean iguales');
  }

  await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/client/register`,{
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ c_i:parseInt(cedula),name:nombre,lastname:apellido,phone:telefono,password:contrasena })

  }).then(res=>{
    if(res.status === 201) {
      Alert.alert("Registro cliente","Cliente Creado con exito")
      router.navigate('/(home)')
    }
    else if(res.status === 409){
      Alert.alert("Registro cliente","Ya existe un cliente con ese numero de cedula")
      router.navigate('/(home)')
    }
  })
}

export default function ClienteRegistrar(){
  const insets = useSafeAreaInsets();
  const [cedula, setCedula] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [apellido, setApellido] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [contrasena, setContrasena] = React.useState('');
  const [confirmarContrasena, setConfirmarContrasena] = React.useState('');    
  useFonts({Inter_900Black,LilyScriptOne_400Regular,Inter_300Light});
    
  return (<KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, paddingTop: insets.top,}}>
         <Text style={style.title}>Cliente</Text>
         <Text style={style.subtitle}>Completa la información a continuación para para acceder a la aplicación</Text>
         <View style={style.textinput}>
           <TextInput
             style={{fontFamily:'Inter_300Light'}}
             placeholder="Cedúla"
             value={cedula}
             onChangeText={setCedula}>
           </TextInput>
         </View>
         <View style={style.textinput}>
           <TextInput
             style={{fontFamily:'Inter_300Light'}}
             placeholder="Nombre"
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
         <TouchableOpacity onPress={()=>handlerRegisterClient({cedula,nombre,apellido,telefono,contrasena,confirmarContrasena})} style={{
                 marginTop:25,
                 marginHorizontal:'8%',
                 borderRadius:10,
                 backgroundColor:'#FE9BAB',
                 boxShadow:[{blurRadius:4,offsetX:1,offsetY:2,color:'#828282'}],
               }}>
                 <Text  style={style.textButton}>Registrarse</Text>
               </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
   
      
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
    marginTop:140,
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