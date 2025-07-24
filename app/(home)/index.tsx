
import { Inter_300Light, Inter_600SemiBold, Inter_900Black } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { Dispatch, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAuth } from "../utils";

const userRoutes = {
  cliente: "/(main)/main",
  tienda: "/(seller)/sellerMain",
  delivery: "/(home)/index",
};
type UserType = 'cliente' | 'tienda' | 'delivery';

export default function Index() {
  const [email, onChangeEmail] = useState("")
  const [password, onChangePassword] = useState("")
  const insets = useSafeAreaInsets();
  const [isLogged,setLogged] = useState(false)
  const [typeUser,setTypeUser] = useState<UserType|null>(null)
  useFonts({Inter_900Black,Inter_600SemiBold,Inter_300Light});
  
  useEffect(()=>{
    getAuth(setLogged)
    // AsyncStorage.clear()
  },[])

  useEffect(() => {
  if (typeUser && userRoutes[typeUser]) {
    if (typeUser === 'cliente'){
      router.push({pathname:'/(main)/main'});
    }
    else if(typeUser === 'tienda'){
      router.push({pathname:'/(seller)/sellerMain'});
    }
    else if(typeUser === 'delivery'){
      router.push({pathname:'/(home)'})
    }
  } else {
    
  }
}, [typeUser]);


  const handlerLoggin = async (setLogged:Dispatch<boolean>) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password })
    });
    
    const data = await response.json();
    
    if(response.ok && data.token) {
      setLogged(true)
      await AsyncStorage.setItem('@auth_token', `${data.token}`);
      setTypeUser(data.tipo)
      await AsyncStorage.setItem('@userId',`${data.userId}`) // Guarda token
      router.replace('/(main)/main');
    }
  } catch(error) {
    console.error("Login error:", error);
  }
};

  return (
    <View style={{paddingTop: insets.top,}}>
      <View>
        <View style={{height:160,alignItems:'center'}}>
          <Image source={require('../../assets/images/logo.svg')}
          contentFit="contain"
          style={{width:200,height:120}} />
        </View>
        <Text style={style.textTitle}>Iniciar Sesión</Text>
        <View style={style.boxShadow}>
          <TextInput
            inputMode="email"
            placeholder="Correo Electrónico"
            style={style.textinput} 
            value={email}
            onChangeText={onChangeEmail}>
          </TextInput>
        </View>
        <View style={style.boxShadow}>
          <TextInput
          placeholder="Contraseña"
          style={style.textinput}
          value={password}
          onChangeText={onChangePassword}
          ></TextInput>
        </View>
        <TouchableOpacity  style={{
          marginHorizontal:'8%',
          borderRadius:10,
          backgroundColor:'#E94B64',
          boxShadow:[{blurRadius:4,offsetX:1,offsetY:2,color:'#828282'}],

        }}>
          <Text onPress={()=>handlerLoggin(setLogged)} style={style.textButton}>Continuar</Text>
        </TouchableOpacity>
        <Text style={{textAlign:'right',marginRight:25,textDecorationLine:'underline',marginBottom:'60%',fontFamily:'Inter_300Light',marginTop:5}}>¿Olvidaste tu Contraseña?</Text>
        <TouchableOpacity>
          <Text style={style.textSubtitle}>¿No tienes cuenta?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          marginHorizontal:'8%',
          borderRadius:10,
          backgroundColor:'#FE9BAB',
          boxShadow:[{blurRadius:4,offsetX:1,offsetY:2,color:'#828282'}],
        }}>
          <Link href={'/(home)/registrar'} style={style.textButton}>Registrarse</Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  textTitle:{
    fontSize:16,
    textAlign:'center',
    marginBottom:20,
    fontFamily:'Inter_900Black',
    fontWeight:'600'
  },
  textSubtitle:{
    fontSize:16,
    textAlign:'center',
    marginBottom:20,
    fontWeight:'300',
    fontFamily:'Inter_300Light',

  },
  boxShadow:{
    borderRadius:10,
    boxShadow:[{blurRadius:4, offsetX:1,offsetY:2,color:'#828282'}],
    marginHorizontal:'8%',
    marginBottom:25,

  },
  textinput:{
    fontFamily:'Inter_300Light',
    padding:10,
    borderRadius:10,
  },
  button:{
    marginHorizontal:'8%',
    borderRadius:10,
    boxShadow:[{blurRadius:1, offsetX:2,offsetY:3,color:'#E0E0E0'}],
    marginBottom:25,
  },
  textButton:{
  color:'white',
  textAlign:'center',
  marginVertical:10,
  fontFamily:'Inter_300Light'
  

  }
})

