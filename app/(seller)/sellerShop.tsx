import {
  Inter_300Light,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function MenuPrincipal() {
  useFonts({
    Inter_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_700Bold,
  });
  const StarShape = ({ color, size }: { color: string; size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24
         l-7.19-.61L12 2 9.19 8.63 2 9.24
         l5.46 4.73L5.82 21z"
        fill={color}
      />
    </Svg>
  );

  const Star = ({
    fillPercent,
    size,
  }: {
    fillPercent: number;
    size: number;
  }) => {
    const width = size;
    const height = size;
    const clipWidth = (fillPercent / 100) * width;

    return (
      <View style={{ width, height }}>
        {/* Fondo vacío */}
        <StarShape color="#E0E0E0" size={size} />

        {/* Relleno parcial */}
        <View
          style={{
            position: "absolute",
            width: clipWidth,
            height,
            overflow: "hidden",
          }}
        >
          <StarShape color="#D61355" size={size} />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 20,
        padding: 20,
      }}
    >
      <View
        style={{
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4, // una media entre 1 y los 60px del segundo shadow
          },
          shadowOpacity: 0.3, // similar al rgba del último shadow
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <Star fillPercent={100} size={34}></Star>
            <Star fillPercent={100} size={34}></Star>
            <Star fillPercent={100} size={34}></Star>
            <Star fillPercent={100} size={34}></Star>
            <Star fillPercent={50} size={34}></Star>
          </View>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              textTransform: "uppercase",
              color: "#838799",
            }}
          >
            Calificación total
          </Text>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 30,
              textTransform: "uppercase",
              color: "#D61355",
            }}
          >
            4.5
          </Text>
        </View>
      </View>
      <View style={{ gap: 10 }}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            textTransform: "uppercase",
            color: "#D61355",
            textAlign: "center",
            fontSize: 17,
          }}
        >
          Reseñas
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image
            source={require("../../assets/images/logo-example-logo.png")}
            style={{
              height: 45,
              width: 45,
            }}
          />
          <View
            style={{
              backgroundColor: "#FFEEF1",
              gap: 10,
              borderRadius: 20,
              padding: 15,
              flexBasis: "80%",
            }}
          >
            <View
              style={{
                gap: 10,
                overflow: "hidden",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "90%", gap: 10 }}>
                <Text
                  style={{ fontFamily: "Inter_300Light", color: "#9C9BA6" }}
                >
                  20/12/2020
                </Text>
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", color: "#32343E" }}
                >
                  Great Food and Service
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={50} size={20}></Star>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: "#747783",
                    fontSize: 12,
                  }}
                >
                  This Food so tasty & delicious. Breakfast so fast Delivered in
                  my place. Chef is very friendly. I’m really like chef for Home
                  Food Order. Thanks.
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require("../../assets/images/threepoints-seller-shop.svg")}
                  style={{
                    height: 4,
                    width: 12,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image
            source={require("../../assets/images/logo-example-logo.png")}
            style={{
              height: 45,
              width: 45,
            }}
          />
          <View
            style={{
              backgroundColor: "#FFEEF1",
              gap: 10,
              borderRadius: 20,
              padding: 15,
              flexBasis: "80%",
            }}
          >
            <View
              style={{
                gap: 10,
                overflow: "hidden",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "90%", gap: 10 }}>
                <Text
                  style={{ fontFamily: "Inter_300Light", color: "#9C9BA6" }}
                >
                  20/12/2020
                </Text>
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", color: "#32343E" }}
                >
                  Great Food and Service
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={50} size={20}></Star>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: "#747783",
                    fontSize: 12,
                  }}
                >
                  This Food so tasty & delicious. Breakfast so fast Delivered in
                  my place. Chef is very friendly. I’m really like chef for Home
                  Food Order. Thanks.
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require("../../assets/images/threepoints-seller-shop.svg")}
                  style={{
                    height: 4,
                    width: 12,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image
            source={require("../../assets/images/logo-example-logo.png")}
            style={{
              height: 45,
              width: 45,
            }}
          />
          <View
            style={{
              backgroundColor: "#FFEEF1",
              gap: 10,
              borderRadius: 20,
              padding: 15,
              flexBasis: "80%",
            }}
          >
            <View
              style={{
                gap: 10,
                overflow: "hidden",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "90%", gap: 10 }}>
                <Text
                  style={{ fontFamily: "Inter_300Light", color: "#9C9BA6" }}
                >
                  20/12/2020
                </Text>
                <Text
                  style={{ fontFamily: "Inter_600SemiBold", color: "#32343E" }}
                >
                  Great Food and Service
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={100} size={20}></Star>
                  <Star fillPercent={50} size={20}></Star>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: "#747783",
                    fontSize: 12,
                  }}
                >
                  This Food so tasty & delicious. Breakfast so fast Delivered in
                  my place. Chef is very friendly. I’m really like chef for Home
                  Food Order. Thanks.
                </Text>
              </View>
              <View style={{}}>
                <Image
                  source={require("../../assets/images/threepoints-seller-shop.svg")}
                  style={{
                    height: 4,
                    width: 12,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const style = StyleSheet.create({
  subtitle: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  chevron: {
    height: 16,
    width: 16,
    marginLeft: 5,
    margin: "auto",
  },
  button_etiqueta: {
    borderColor: "#E6E6E6",
    borderWidth: 1,
    marginVertical: 10,
    marginRight: 5,
    padding: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image_etiqueta: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
  text_etiqueta: {
    fontFamily: "Inter_600SemiBold",
  },
  container_input: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "4%",
    paddingVertical: 3,
    width: "90%",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  image_input: {
    height: 32,
    width: 32,
    marginLeft: 10,
  },
  text_input: {
    marginLeft: 10,
    fontSize: 16,
    width: "75%",
  },
  promo: {
    height: 160,
    backgroundColor: "#444",
  },
  shops: {
    height: 100,
    marginLeft: 5,
    borderRadius: 15,
    backgroundColor: "#E94B64",
    flexDirection: "row",
    alignItems: "center",
  },
});
