import { View, Text, StyleSheet, Image } from "react-native";

export default function Test() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/little-lemon-logo.png")}
      />
      <Text style={styles.text}>LOADING...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEFEE",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 270,
    resizeMode: "cover",
  },
  text: {
    
    fontSize: 30,
    color: "#495E57",
    marginTop: 110,
   
  },
});
