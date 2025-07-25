import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
export default function SellerLayout() {
  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          padding: 20,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 25,
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 35,
              backgroundColor: "white",
              padding: 2,
            }}
          >
            <Image
              source={require("../../assets/images/campana-icon.svg")}
              style={{
                height: 23,
                width: 20,
              }}
            />
          </View>
          <View style={{}}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#D61355",
                textTransform: "uppercase",
                fontFamily: "Inter_700Bold",
                fontSize: 12,
              }}
            >
              Nombre Tienda
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                color: "#676767",
                fontSize: 14,
              }}
            >
              Ubicación
            </Text>
          </View>
        </View>
        <Image
          source={require("../../assets/images/logo-example-logo.png")}
          style={{
            height: 45,
            width: 45,
          }}
        />
      </View>
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
      </Tabs>
    </View>
  );
}
