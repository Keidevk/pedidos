import { Inter_300Light, Inter_400Regular, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Pedidos(){
    const insets = useSafeAreaInsets();
        useFonts({Inter_600SemiBold,Inter_300Light,Inter_400Regular});
        
        
    
        const handlerMain = async () => {
                    router.replace('/(main)/main');
                };
    return(
        <View style={{paddingTop:insets.top}}>
            <TouchableOpacity onPress={handlerMain} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                        <Image
                        style={{height:32,width:32,marginLeft:5,}}
                        contentFit="cover"
                        source={require('../../assets/images/arrowback.svg')}></Image>
                        <Text style={{fontFamily:'Inter_600SemiBold'}}>Pedidos</Text>    
                    </TouchableOpacity>
        </View>)
}