import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { useState } from "react";

export default function IndexLayout() {
  const [selectedItem, setSelectedItem] = useState("");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E94B64",
      }}
    >
      <Tabs.Screen
        name="orders"
        options={{
          title: "Solicitudes",
          tabBarIcon: (focused) => (
            <Image
              source={require("../../assets/images/delivery-requests-icon.svg")}
              style={{ height: 30, width: 30 }}
              tintColor={"#AFAFAF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="opciones"
        options={{
          title: "Perfil",
          tabBarIcon: (focused) => (
            <Image
              source={require("../../assets/images/perfil.svg")}
              style={{ height: 30, width: 30 }}
              tintColor={"#AFAFAF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: "Perfil",
          href: null,
          tabBarIcon: (focused) => (
            <Image
              source={require("../../assets/images/perfil.svg")}
              style={{ height: 30, width: 30 }}
              tintColor={focused ? "#E94B64" : "#AFAFAF"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
