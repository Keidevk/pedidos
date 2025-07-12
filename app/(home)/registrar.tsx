import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Registrar(){
      const insets = useSafeAreaInsets();
    
    return (<View style={{flex:1,paddingTop: insets.top,}}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>¿Qué modo deseas usar?</Text>
        <TouchableOpacity style={styles.container}>
            <Image 
            contentFit="cover"
            style={styles.image}
            source={require("../../assets/images/person-alert-20-regular.svg")}/>
            <Link style={styles.text} href={'/(home)/cliente'}>Cliente</Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.container}>
            <Image 
            contentFit="cover"
            style={styles.image}
            source={require("../../assets/images/Vector.svg")}/>
            <Link style={styles.text} href={'/(home)/tienda'}>Tienda</Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.container}>
            <Image 
            contentFit="cover"
            style={styles.image}
            source={require('../../assets/images/vehicle-car-profile-ltr-clock-16-regular.svg')}/>
            <Link style={styles.text} href={'/(home)/repartidor'}>Repartidor</Link>
        </TouchableOpacity>
    </View>)
    
}
const styles = StyleSheet.create({
title:{
    textAlign:'center',
    fontFamily:'Inter_900Black',
    fontSize:16,
    marginTop:140
},
subtitle:{
    textAlign:'center',
    marginBottom:32,
    fontFamily:'Inter_300Light'
    
},
container: {
    height:92,
    width:327,
    borderRadius:10,
    marginBottom:35,
    marginHorizontal:"auto",
    flexDirection:'row',
    alignItems:'center',
    paddingLeft:10,
    shadowColor:'#E0E0E0',
    'boxShadow':[{blurRadius:4, offsetX:2,offsetY:6,color:'#E0E0E0'}],    
},
image: {
    width: 64,
    height:64,
    borderRadius:10,
  },
text:{
    marginLeft:10,
    fontSize:28,
    color:'#828282',
    width:'100%',
    fontFamily:'Inter_600SemiBold'
  }
});