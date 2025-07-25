import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export type RootStackParamList = {
  sellerDashboard: undefined;
};

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <ScrollView style={{ padding: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator style={{ gap: 2 }}>
        <View style={{}}>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 2 }}
            //   onPress={() => navigation.navigate("")}
          >
            <Text style={{ fontFamily: "Inter_400Regular" }}>
              Mi lista de comidas
            </Text>
            <Image
              source={require("../../assets/images/seller-chevron-icon.svg")}
              style={{
                height: 14,
                width: 7,
              }}
            />
          </TouchableOpacity>
          <ScrollView horizontal contentContainerStyle={{}}>
            <View style={{}}>
              <View style={{ backgroundColor: "#D61355" }}>
                <TouchableOpacity>
                  <Text style={{ fontFamily: "Inter_300Light", color: "#fff" }}>
                    Desayunos
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ backgroundColor: "#fff" }}>
                <TouchableOpacity>
                  <Text style={{ fontFamily: "Inter_300Light", color: "#000" }}>
                    Almuerzos
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ backgroundColor: "#fff" }}>
                <TouchableOpacity>
                  <Text style={{ fontFamily: "Inter_300Light", color: "#000" }}>
                    Cenas
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ backgroundColor: "#fff" }}>
                <TouchableOpacity>
                  <Text style={{ fontFamily: "Inter_300Light", color: "#000" }}>
                    Postres
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ backgroundColor: "#fff" }}>
                <TouchableOpacity>
                  <Text style={{ fontFamily: "Inter_300Light", color: "#000" }}>
                    Bebidas
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={{ flexDirection: "row", gap: 2 }}>
            <Image
              source={require("../../assets/images/seller-add-icon.svg")}
              style={{
                height: 25,
                width: 24,
              }}
            />
            <Text style={{}}>Añadir Nuevo Producto al Catálago</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Text style={{ fontFamily: "Inter_300Light", color: "#9C9BA6" }}>
        Total 03 items
      </Text>
      <View style={{ width: "100%", flexDirection: "row", gap: 2 }}>
        <Image
          source={require("../../assets/images/seller-dashboard-img.svg")}
          style={{
            height: 62,
            width: 62,
          }}
        />
        <View style={{}}>
          <Text style={{ fontFamily: "Inter_400Regular" }}>Product Text</Text>
          <Text style={{ fontFamily: "Inter_600SemiBold", color: "#3B3B3B" }}>
            Categoria
          </Text>
          <Text style={{ fontFamily: "Inter_700Bold", color: "#D61355" }}>
            $ 20
          </Text>
        </View>
        <View style={{ gap: 2 }}>
          <View style={{}}>
            <TouchableOpacity>-</TouchableOpacity>
            <Text style={{}}>1</Text>
            <TouchableOpacity>+</TouchableOpacity>
          </View>
          <TouchableOpacity style={{}}>Guardar</TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
