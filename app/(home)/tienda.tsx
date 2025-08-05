import { Inter_300Light, Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import { LilyScriptOne_400Regular } from '@expo-google-fonts/lily-script-one';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

async function handlerRegisterShop(shopData: {
  rif: string;
  nombreTienda: string;
  nombrePropietario: string;
  telefono: string;
  contrasena: string;
  confirmarContrasena: string;
}) {
  const {
    rif,
    nombreTienda,
    nombrePropietario,
    telefono,
    contrasena,
    confirmarContrasena,
  } = shopData;

  // Validación básica
  if (!rif || !nombreTienda || !nombrePropietario || !telefono || !contrasena || !confirmarContrasena) {
    Alert.alert('Formulario incompleto', 'Por favor completa todos los campos');
  }

  if (contrasena !== confirmarContrasena) {
    Alert.alert('Contraseña no coincide', 'Verifica que las contraseñas sean iguales');
  }
  //Aun no tenemos la base de datos lista para usar esto
  // await fetch('https://tuapi.com/tiendas', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({}),
  // });
}

export default function TiendaRegistrar(){
  const insets = useSafeAreaInsets();
  const [rif, setRif] = useState('');
  const [nombreTienda, setNombreTienda] = useState('');
  const [nombrePropietario, setNombrePropietario] = useState('');
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  useFonts({Inter_900Black,LilyScriptOne_400Regular,Inter_300Light});
     
  return(
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled">
              <View style={{ flex: 1, paddingTop: insets.top,}}>
                <View style={{height:120,alignItems:'center'}}>
                            <Image source={require('../../assets/images/logo.svg')}
                            contentFit="contain"
                            style={{width:200,height:120}} />
                          </View>
                <Text style={style.title}>Tienda</Text>
                <Text style={style.subtitle}>Completa la información a continuación para para acceder a la aplicación</Text>
                <View style={style.textinput}>
                  <TextInput
                    style={{fontFamily:'Inter_300Light'}}
                    placeholder="Cédula / RIF"
                    value={rif}
                    onChangeText={setRif}>
                  </TextInput>
                </View>
                <View style={style.textinput}>
                  <TextInput
                    style={{fontFamily:'Inter_300Light'}}
                    placeholder="Nombre de la Tienda"
                    value={nombreTienda}
                    onChangeText={setNombreTienda}>
                  </TextInput>
                </View>
                <View style={style.textinput}>
                  <TextInput
                    style={{fontFamily:'Inter_300Light'}}
                    placeholder="Nombre del Propietario"
                    value={nombrePropietario}
                    onChangeText={setNombrePropietario}>
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
                        <Link href={'/(home)/registrar'} style={style.textButton}>Registrarse</Link>
                </TouchableOpacity>
              </View>
          </ScrollView>
  </KeyboardAvoidingView>
        )
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
    marginTop:10,
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