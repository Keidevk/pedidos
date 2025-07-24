import { Inter_300Light, Inter_900Black } from "@expo-google-fonts/inter";
import { LilyScriptOne_400Regular } from "@expo-google-fonts/lily-script-one";
import { useFonts } from "expo-font";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RepartidorRegistrar(){
 const insets = useSafeAreaInsets();
   const [cedula, onChangeCedula] = React.useState('')
   const [fontsLoaded] = useFonts({Inter_900Black,LilyScriptOne_400Regular,Inter_300Light});
 
   if (!fontsLoaded) {
     return null;
   }      
   return(<View style={{ flex: 1, paddingTop: insets.top,}}>
    
     <Text style={style.title}>Repartidor</Text>
     <Text style={style.subtitle}>Completa la información a continuación para para acceder a la aplicación</Text>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Cedula"
         value={cedula}
         onChangeText={onChangeCedula}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Nombre "
         value={cedula}
         onChangeText={onChangeCedula}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Apellido"
         value={cedula}
         onChangeText={onChangeCedula}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Teléfono"
         value={cedula}
         onChangeText={onChangeCedula}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Contraseña"
         value={cedula}
         onChangeText={onChangeCedula}>
       </TextInput>
     </View>
     <View style={style.textinput}>
       <TextInput
         style={{fontFamily:'Inter_300Light'}}
         placeholder="Confirmar contraseña"
         value={cedula}
         onChangeText={onChangeCedula}>
       </TextInput>
     </View>
     <TouchableOpacity style={{
             marginTop:25,
             marginHorizontal:'8%',
             borderRadius:10,
             backgroundColor:'#FE9BAB',
             boxShadow:[{blurRadius:4,offsetX:1,offsetY:2,color:'#828282'}],
           }}>
             <Link href={'/(home)/registrar'} style={style.textButton}>Registrarse</Link>
           </TouchableOpacity>
         </View>)
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