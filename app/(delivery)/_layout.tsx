import { Image } from "expo-image";
import { Tabs } from "expo-router";

export default function IndexLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "red",
      }}
    >
      <Tabs.Screen
        name="delivery-orders"
        options={{
          title: "Ordenes",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/delivery-deliveryOrders-icon.svg")}
              style={{ height: 24, width: 18 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="opciones"
        options={{
          title: "Perfil",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/perfil.svg")}
              style={{ height: 30, width: 30 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
