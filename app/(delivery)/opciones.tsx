import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getItem } from "../utils";

export default function Home(){
    const insets = useSafeAreaInsets()
    const [userId,setUserId] = useState<string>()

    

    useEffect(()=>{
        getItem('@userId',setUserId)

    },[])
    return(
    <View style={{marginTop:insets.top}}>
        <Text>Hola {userId}</Text>
    </View>)
}