<<<<<<< HEAD
import { Image } from "expo-image";
import { Tabs } from "expo-router";

export default function MainLayout() {
=======
import { Image } from 'expo-image';
import { Tabs, useSegments } from "expo-router";

export default function MainLayout() {
  const segment = useSegments()
  console.log(segment)
>>>>>>> a7e1f90804d0923026a16191169fa9029c1640c1
  return (
    <Tabs
      screenOptions={{
<<<<<<< HEAD
        headerShown: false,
        tabBarActiveTintColor: "red",
        tabBarStyle: {
          // backgroundColor:'',
          transitionDuration: "0ms",
=======
        headerShown:false,
        tabBarActiveTintColor:'red',
        tabBarStyle:{
          transitionDuration:'0ms',
          display: segment[1] === "carrito" && segment[2] === "[id]" ? 'none' : 'flex'
>>>>>>> a7e1f90804d0923026a16191169fa9029c1640c1
        },
      }}
    >
      <Tabs.Screen
        name="main"
        options={{
          title: "Inicio",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/home.svg")}
              style={{ height: 30, width: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/pedidos.svg")}
              style={{ height: 30, width: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          title: "Carrito",
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/carrito.svg")}
              style={{ height: 50, width: 50, marginBottom: 20 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="carrito/[id]"
        options={{
          href: null,
          title: "category/[category]",
        }}
      />
      <Tabs.Screen
        name="category/[category]"
        options={{
          href: null,
          title: "category/[category]",
        }}
      />
      <Tabs.Screen
        name="shops"
        options={{
          href: null,
          title: "shops",
        }}
      />

      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null,
          title: "(shop)",
        }}
      />

      <Tabs.Screen
        name="shop/[id]"
        options={{
          href: null,
          title: "(shop)",
        }}
      />
    </Tabs>
  );
}
