
import { Inter_300Light, Inter_600SemiBold, Inter_900Black } from "@expo-google-fonts/inter";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { Link, Redirect, useRouter } from "expo-router";
import { Dispatch, useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


async function getAuth(setState:Dispatch<boolean>){
    const auth = await AsyncStorage.getItem('@auth_token')
    if(auth==='true'){
      setState(true)
    }else{
      setState(false)
    }
}

export default function Index() {
  const [cI, onChangeCi] = useState("")
  const [password, onChangePassword] = useState("")
  const insets = useSafeAreaInsets();
  const router = useRouter()
  const [isLogged,setLogged] = useState(false)
  useFonts({Inter_900Black,Inter_600SemiBold,Inter_300Light});
  
  useEffect(()=>{
    getAuth(setLogged)
  },[])

  const handlerLoggin = async () => {
  try {
    const response = await fetch("http://192.168.3.6:3000/api/auth", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cI, password })
    });
    
    const data = await response.json();
    
    if(response.ok && data.token) {
      setLogged(true)
      await AsyncStorage.setItem('@auth_token', data.token); // Guarda token
      router.replace('/(main)/main');
    }
  } catch(error) {
    console.error("Login error:", error);
  }
};
    
  return (
    <View style={{paddingTop: insets.top,}}>
      { isLogged === true ? 
      <View>
      <Redirect href={'/(main)/main'}/>
      </View>
      :
      <View>
        <Text style={style.textTitle}>Iniciar Sesión</Text>
        <View style={style.boxShadow}>
          <TextInput
            inputMode="tel"
            placeholder="Cedúla"
            style={style.textinput} 
            value={cI}
            onChangeText={onChangeCi}>
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
          <Text onPress={handlerLoggin} style={style.textButton}>Continue</Text>
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
      </View>}
    </View>
  );
}
const style = StyleSheet.create({
  textTitle:{
    marginTop:140,
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

