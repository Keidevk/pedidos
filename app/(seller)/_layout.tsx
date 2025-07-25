import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
export default function SellerLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarLabelPosition: "below-icon",
        headerShown: false,
        tabBarActiveTintColor: "gray",
        tabBarStyle: {
          alignItems: "center",
          justifyContent: "center",
          minHeight: 55,
          transitionDuration: "0ms",
        },
        headerTitleStyle: {},
      }}
    >
      <Tabs.Screen
        name="sellerMain"
        options={{
          tabBarItemStyle: {},
          tabBarIconStyle: {},
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home-outline" size={24} color="#333" />
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
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
