import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function Onboarding({ navigation }) {
  const [fontsLoaded] = useFonts({
    Markazi: require("../assets/fonts/MarkaziText-Regular.ttf"),
    Karla: require("../assets/fonts/Karla-Regular.ttf"),
  });

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const isFirstNameValid =
    firstName.trim() !== "" && /^[a-zA-Z]+$/.test(firstName);
  const isEmailValid =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  const validateInputs = () => {
    const newErrors = {};
    if (!isFirstNameValid) newErrors.firstName = "Invalid first name.";
    if (!isEmailValid) newErrors.email = "Invalid email address.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    try {
      AsyncStorage.getItem("UserName").then((value) => {
        if (value != null) {
          navigation.navigate("Profile");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setData = async () => {
    if (validateInputs()) {
      try {
        await AsyncStorage.setItem("UserName", firstName);
        await AsyncStorage.setItem("UserEmail", email);
        navigation.navigate("Profile");
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("Invalid Input");
    }
  };

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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
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
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginHeader}>LET US GET TO KNOW YOU!</Text>
            <Text style={styles.inputTitle}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              //value={firstName}
              onChangeText={(value) => setFirstName(value)}
              keyboardType={"default"}
            />
            <Text style={styles.errorText}>{errors.firstName}</Text>
            <Text style={styles.inputTitle}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email}
              onChangeText={setEmail}
              keyboardType={"email-address"}
            />
            <Text style={styles.errorText}>{errors.email}</Text>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    isFirstNameValid && isEmailValid ? "#F4CE14" : "#EDEFEE",
                },
              ]}
              //onPress={handleNext}
              onPress={setData}
              //disabled={!isFirstNameValid || !isEmailValid}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
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

  loginContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  content: {
    backgroundColor: "#495E57",
    paddingBottom: 20,
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
    justifyContent: "center",
  },
  logo: {
    width: 170,
    height: 100,
    resizeMode: "contain",
    marginTop: 35,
    marginRight: 7,
  },

  scrollableContainer: {
    flex: 1,
    marginTop: 105, // Adjust this margin based on the header height
  },

  scrollableContent: {
    paddingTop: 5,
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

  inputBox: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderColor: "#EDEFEE",
    backgroundColor: "white",
  },
  loginHeader: {
    paddingTop: 20,
    paddingBottom: 30,
    color: "#495E57",
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Karla",
  },
  inputTitle: {
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 15,
    color: "#A09C9C",
    textAlign: "left",
    fontSize: 20,
    fontFamily: "Karla",
    fontWeight: "bold",
  },
  button: {
    marginTop: 120,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Karla",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    paddingLeft: 15,
  },
});
