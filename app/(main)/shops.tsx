import { Inter_300Light, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { Dispatch, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tienda } from "../types";
import { getItem, handlerMain, handlerShopById } from "../utils";


 async function productFetch(setState:Dispatch<Tienda[]|null>){
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/shop/`);
    const data = await response.json();
    setState(data)
}


export default function Shops(){
    const insets = useSafeAreaInsets();
    const [shops,setShops] = useState<Tienda[]|null>(null)
    const [isLogged,setLogged] = useState<string|null>(null)

    useFonts({Inter_600SemiBold,Inter_300Light,Inter_400Regular});

    
    useEffect(()=>{
        productFetch(setShops)
        getItem('@auth_token',setLogged)
    },[])
    return (
    <View style={{paddingTop: insets.top}}>
        <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
            <Image
            style={style.chevron}
            contentFit="cover"
            source={require('../../assets/images/arrowback.svg')}></Image>
            <Text style={{fontFamily:'Inter_600SemiBold'}}>Tiendas</Text>    
        </TouchableOpacity>
        <View style={style.container_input}>
            <Image 
                style={style.image_input}
                contentFit="cover"
                source={require("../../assets/images/search.svg")}/>
            <TextInput
                style={style.text_input}
                placeholder="Buscar"
            ></TextInput>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}>
        {shops && shops.map((shop,index)=>{
        return (
        <TouchableOpacity onPress={()=>{handlerShopById(shop.id)}} key={index}>        
            <View style={{flexDirection:'row',marginVertical:20,backgroundColor:'#FFF0F0',borderRadius:10,padding:10}}>
                <View style={{backgroundColor:"#ccc",width:100,height:100,borderRadius:10}}>
                    {/* <Image
                    contentFit="cover"
                    transition={1000}
                    ></Image> */}
                </View>
                <View style={{maxWidth:250,}}>
                    <Text style={{marginLeft:10,fontFamily:'Inter_600SemiBold',fontSize:16}}>
                    {shop.nombre}</Text>
                    <Text style={{marginLeft:10,fontFamily:'Inter_300Light',color:"#888"}}>
                    {shop.descripcion}</Text>
                </View>
            </View>
        </TouchableOpacity>)})}
        </ScrollView>
    </View>)
}
const style = StyleSheet.create({
    subtitle:{
        flexDirection:"row",
        marginLeft:15,
        marginTop:10,
        marginBottom:5,
    },
    chevron:{
        height:32,
        width:32,
        marginLeft:5,
    },
    button_etiqueta:{
        marginRight:5,
        padding:5,
        borderRadius:10,
        flexDirection:'row',
        alignItems:'center'
    },
    image_etiqueta:{
        height:16,
        width:16,
        marginRight:5
    },
    text_etiqueta:{
        fontFamily:'Inter_600SemiBold'
    },
    container_input:{
        flexDirection:'row',
        alignItems:'center',
        marginLeft:'4%',
        paddingVertical:3,
        width:'90%',
        backgroundColor:'#ddd',
        borderRadius:10,
        
    },
    image_input:{
        height:32,
        width:32,
        marginLeft:10,
        
    },
    text_input:{
        marginLeft:10,
        fontSize:16,
        width:'75%',

    },
    promo:{
        height:200,
        backgroundColor:"#444"
    },
    shops:{
        height:100,
        marginLeft:5,
        borderRadius:15,
        backgroundColor:"#E94B64",
        flexDirection:'row',
        alignItems:'center'
    }
})