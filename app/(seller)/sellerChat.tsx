import { StyleSheet, Text } from "react-native";

export default function MenuPrincipal() {
  return <Text>Hola estas en seller main</Text>;
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
