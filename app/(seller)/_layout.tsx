import { Image } from "expo-image";
import { Tabs } from "expo-router";
import * as SQLite from "expo-sqlite";
import { Text, View } from "react-native";

export default function SellerLayout() {
  const createDbIfNeeded = async (db: SQLite.SQLiteDatabase) => {
    console.log("Creating db if needed");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product VARCHAR(50),
  client_name VARCHAR(50),
  amount INT,
  date DATE UNIQUE
);

INSERT OR IGNORE INTO transactions (product, client_name, amount, date) VALUES
('Cordless vacuum cleaner for quick clean-ups.', 'Townsend Camlin', 584, '1733576243000'),
('Vertical shoe rack for saving closet space.', 'Bliss Lilburn', 28, '1739239040000'),
('Rich and tangy balsamic vinegar, perfect for dressings.', 'Seth Rubica', 683, '1730413040000'),
('Bartender kit with shaker, jigger, and strainer.', 'Deni Hasty', 701, '1751050483000'),
('High-quality leather wallet with multiple compartments.', 'Taddeusz Puckinghorne', 467, '1733491660000'),
('Durable baking sheet coated for easy food release.', 'Bertie Scandred', 525, '1730779789000'),
('All-natural skincare set for daily use.', 'Derril Wimp', 11, '1732776830000'),
('Delicious recipes focusing on plant-based ingredients.', 'Abigale Grahl', 281, '1728518007000'),
('Classic chino shorts in a versatile color for summer adventures.', 'Gerri Pirrone', 428, '1736228659000'),
('A mix of wild rice with herbs and spices, ready to serve.', 'Den Euplate', 808, '1727027041000'),
('Lightweight and breathable running shorts for your workouts.', 'Petronilla Norwood', 389, '1748944520000'),
('Freshly baked bagels, perfect for breakfast or snacks.', 'Haily McMenamin', 75, '1751587376000'),
('3D model puzzle kit for creative builders.', 'Jilly Reay', 23, '1724395265000'),
('Lightweight and durable hammock for relaxing in nature.', 'Dominique Castelijn', 925, '1750901009000'),
('Stylish insulated lunch bag for on-the-go meals.', 'Danyelle Tilburn', 40, '1749424844000'),
('A retro-style button-down shirt with a relaxed fit.', 'Terencio Roby', 340, '1745465320000'),
('Canned diced tomatoes, great base for sauces and soups.', 'Aurea Anning', 321, '1721581775000'),
('All ingredients included for delicious chicken fajitas.', 'Nancey Kondratenko', 464, '1734902976000');
    `);
  };
  return (
    <SQLite.SQLiteProvider
      databaseName="transactions.db"
      onInit={createDbIfNeeded}
    >
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
            href: null,
          }}
        />

        <Tabs.Screen
          name="sellerRequests"
          options={{
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
          name="sellerShop"
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
      </Tabs>
    </SQLite.SQLiteProvider>
  );
}
