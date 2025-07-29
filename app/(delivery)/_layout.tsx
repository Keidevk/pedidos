
import { Image } from "expo-image";
import { Tabs } from "expo-router";

export default function IndexLayout() {
  return (
    <Tabs 
    screenOptions={{
        headerShown:false,
        tabBarActiveTintColor:'red',
    }}>
      <Tabs.Screen
        name="index"
        
        options={{
          title:'Perfil',
          tabBarIcon:()=><Image 
            source={require("../../assets/images/perfil.svg")}
            style={{ height: 30, width: 30 }}/>
          
        }}
      />
    </Tabs>
  );
}