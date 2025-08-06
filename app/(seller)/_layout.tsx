import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
export default function SellerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E94B64",
      }}
    >
      <Tabs.Screen
        name="sellerMain"
        options={{
          tabBarItemStyle: {},
          tabBarIconStyle: {},
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home-outline" size={24} color="#AFAFAF" />
          ),
        }}
      />
      <Tabs.Screen
        name="sellerOrderPage"
        options={{
          tabBarItemStyle: {},
          tabBarIconStyle: {},
          title: "Ordenes",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/delivery-deliveryOrders-icon.svg")}
              style={{
                height: 24,
                width: 18,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />
      

      <Tabs.Screen
        name="sellerRequests"
        options={{
          href: null,
          tabBarItemStyle: {},
          tabBarIconStyle: {},
          title: "Solicitudes",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/vehicle-car-profile-ltr-clock-20-regular.svg")}
              style={{
                height: 29,
                width: 29,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sellerDashboardCreateProduct"
        options={{
          href: null,
          tabBarItemStyle: {},
          tabBarIconStyle: {},
          title: "Solicitudes",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/vehicle-car-profile-ltr-clock-20-regular.svg")}
              style={{
                height: 29,
                width: 29,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sellerOrder"
        options={{
          href: null,
          title: "Orden",
          tabBarIconStyle: {},
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/order-icon.svg")}
              style={{
                height: 24,
                width: 18,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sellerStats"
        options={{
          href: null,
          title: "Estadísticas",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/stats-icon.svg")}
              style={{
                height: 21,
                width: 21,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sellerChat"
        options={{
          href: null,
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/chat-icon.svg")}
              style={{
                height: 30,
                width: 27,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sellerReviews"
        options={{
          href: null,
          title: "Tienda",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/shop-icon.svg")}
              style={{
                height: 25,
                width: 24,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sellerDashboard"
        options={{
          title: "Tienda",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/shop-icon.svg")}
              style={{
                height: 25,
                width: 24,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sellerDashboardProducts"
        options={{
          href: null,
          title: "Tienda",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/shop-icon.svg")}
              style={{
                height: 25,
                width: 24,
                tintColor: "#AFAFAF",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dataProcessHelpers"
        options={{
          href: null,
          title: "Tienda",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/shop-icon.svg")}
              style={{
                height: 25,
                width: 24,
                tintColor: "#AFAFAF",
              }}
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
    </Tabs>
  );
}
