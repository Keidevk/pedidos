import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Dispatch } from "react";

export const handlerMain = async () => {
    router.replace('/(main)/main');
};

export function handlerShopById(id:string){
    router.push({pathname:'/(main)/shop/[id]',params:{id}})
}

export async function getItem(item:string,setState:Dispatch<string>){
    await AsyncStorage.getItem(item).then(res=>{
        if(!res) return null 
        setState(res)
    }).catch(error=>{
        console.error(error)
    })
}

export async function getAuth(setState:Dispatch<boolean>){
    const auth = await AsyncStorage.getItem('@auth_token')
    if(auth==='true'){
      setState(true)
    }else{
      setState(false)
    }
}

export async function getShopById(id:string){
    const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/shop/${id}`)
    const data = await response.json()
    return data
}

