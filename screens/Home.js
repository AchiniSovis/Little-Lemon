import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Searchbar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

export default function Home({navigation}) {
  const [fontsLoaded] = useFonts({
    Markazi: require("../assets/fonts/MarkaziText-Regular.ttf"),
    Karla: require("../assets/fonts/Karla-Regular.ttf"),
  });

  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const isFocused = useIsFocused(); // Hook to check if screen is focused

//   useEffect(() => {
//     getData();
//   }, []);

  const getData = async () => {
    try {
      const storedFirstName = await AsyncStorage.getItem("UserName");
      const storedLastName = await AsyncStorage.getItem("UserLastName");
      const storedImage = await AsyncStorage.getItem("UserImage");

      if (storedFirstName !== null) {
        setFirstName(storedFirstName);
      }
      if (storedLastName !== null) {
        setLastName(storedLastName);
      }
      if (storedImage !== null) {
        setImage(storedImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

    useEffect(() => {
    if (isFocused) {
      getData(); // Refresh profile image and other data when the screen gains focus
    }
  }, [isFocused]);

  useEffect(() => {
    // Hide the splash screen when fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Optionally render a loading indicator while fonts are loading
    return null;
  }

  const userInitials = `${firstName[0] || ""}${
    lastName[0] || ""
  }`.toUpperCase();

 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.backIcon}
          source={require("../assets/backicon.png")}
        />
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={()=> navigation.navigate('Profile')} style={styles.profilePlaceholder}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profile} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileText}>{userInitials}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.scrollableContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollableContent}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.content}>
            <Text style={styles.DisplayText}>Little Lemon</Text>
            <Text style={styles.SubTitle}>Chicago</Text>

            <View style={styles.subContainer}>
              <Text style={styles.leadText}>
                We are a family owned{"\n"}Mediterranean restaurant,{"\n"}
                focused on traditional{"\n"}recipes served with a {"\n"}modern
                twist.
              </Text>
              <Image
                style={styles.imageBox}
                source={require("../assets/Hero image.png")}
              />
            </View>
            <Searchbar
              placeholder="Search"
              placeholderTextColor="white"
              //onChangeText={handleSearchChange}
              //value={searchBarText}
              style={styles.searchBar}
              iconColor="black"
              inputStyle={{ color: "black" }}
              elevation={0}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    zIndex: 10, // Ensures the header stays on top
    height: 110, // Fixed header height
    flexDirection: "row",
  },
  backIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginLeft: 15,
    marginTop: 35,
  },
  logo: {
    width: 170,
    height: 100,
    resizeMode: "contain",
    marginLeft: 50,
    marginTop: 35,
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#EDEFEE",
    resizeMode: "cover",
  },
  profilePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#EDEFEE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EDEFEE",
  },
  profileText: {
    fontSize: 20,
    color: "#495E57",
    fontWeight: "bold",
  },
  profileContainer: {
    marginTop: 35,
    marginLeft: 50,
  },
  scrollableContainer: {
    flex: 1,
    marginTop: 105, // Adjust this margin based on the header height
  },
  scrollableContent: {
    paddingTop: 5,
  },

  content: {
    backgroundColor: "#495E57",
    paddingBottom: 20,
  },

  DisplayText: {
    marginTop: 5,
    marginLeft: 15,
    color: "#F4CE14",
    textAlign: "left",
    fontSize: 64,
    fontFamily: "Markazi",
  },
  SubTitle: {
    marginLeft: 15,
    color: "#fff",
    textAlign: "left",
    fontSize: 40,
    fontFamily: "Markazi",
    lineHeight: 35,
  },
  leadText: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 30,
    color: "#fff",
    textAlign: "left",
    fontSize: 18,
    fontFamily: "Karla",
  },
  imageBox: {
    width: 140,
    height: 150,
    resizeMode: "cover",
    borderRadius: 16,
    marginTop: -20,
  },
  subContainer: {
    flexDirection: "row", // Align items horizontally
    marginLeft: 5,
  },
  searchBar: {
    marginBottom: 15,
    width: 387,
    borderRadius: 16,
    marginTop: 20,
    backgroundColor: "#fff",
    shadowRadius: 0,
    shadowOpacity: 0,
    alignSelf: "center"
  },
});
