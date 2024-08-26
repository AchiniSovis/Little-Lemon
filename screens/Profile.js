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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";

// Prevents the splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function Profile({ navigation, route }) {
  // Custom hook for loading fonts
  const [fontsLoaded] = useFonts({
    Markazi: require("../assets/fonts/MarkaziText-Regular.ttf"),
    Karla: require("../assets/fonts/Karla-Regular.ttf"),
  });

  // State variables for user profile information
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null);
  const [lastName, setLastName] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    orderStatus: false,
    passwordChange: false,
    specialOffers: false,
    newsletter: false,
  });
  const [errors, setErrors] = useState({});

  // State variable to store initial data fetched from AsyncStorage
  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    image: null,
    checkboxes: {
      orderStatus: false,
      passwordChange: false,
      specialOffers: false,
      newsletter: false,
    },
  });

  // Regular expressions to validate input fields
  const isPhoneNumberValid =
    /^(\+1\s?)?(\([0-9]{3}\)\s?)?[0-9]{3}[\s.-]?[0-9]{4}$/.test(phoneNumber);

  const isFirstNameValid =
    firstName.trim() !== "" && /^[a-zA-Z]+$/.test(firstName);

  const isLastNameValid =
    lastName.trim() !== "" && /^[a-zA-Z]+$/.test(lastName);
  const isEmailValid =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  // Function to validate all input fields and set error messages
  const validateInputs = () => {
    const newErrors = {};
    if (!isFirstNameValid) newErrors.firstName = "Invalid first name.";
    if (!isLastNameValid) newErrors.lastName = "Invalid last name.";
    if (!isEmailValid) newErrors.email = "Invalid email address.";
    if (!isPhoneNumberValid) newErrors.phoneNumber = "Invalid phone number.";
    if (image == null) newErrors.image = "upload an image.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch user data from AsyncStorage when the component mounts
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    // Retrieve stored data
    try {
      const storedFirstName = await AsyncStorage.getItem("UserName");
      const storedLastName = await AsyncStorage.getItem("UserLastName");
      const storedEmail = await AsyncStorage.getItem("UserEmail");
      const storedPhoneNumber = await AsyncStorage.getItem("UserPhoneNumber");
      const storedImage = await AsyncStorage.getItem("UserImage");
      const storedCheckboxes = await AsyncStorage.getItem("UserCheckboxes");

      // Set initial data state based on retrieved values or defaults
      const newInitialData = {
        firstName: storedFirstName || "",
        lastName: storedLastName || "",
        email: storedEmail || "",
        phoneNumber: storedPhoneNumber || "",
        image: storedImage || null,
        checkboxes: storedCheckboxes
          ? JSON.parse(storedCheckboxes)
          : {
              orderStatus: false,
              passwordChange: false,
              specialOffers: false,
              newsletter: false,
            },
      };

      // Update state with initial data
      setInitialData(newInitialData);
      setFirstName(newInitialData.firstName);
      setLastName(newInitialData.lastName);
      setEmail(newInitialData.email);
      setPhoneNumber(newInitialData.phoneNumber);
      setImage(newInitialData.image);
      setCheckboxes(newInitialData.checkboxes);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to save changes to AsyncStorage
  const saveChanges = async () => {
    if (validateInputs()) {
      try {
        // Save updated profile information
        await AsyncStorage.setItem("UserName", firstName);
        await AsyncStorage.setItem("UserLastName", lastName);
        await AsyncStorage.setItem("UserEmail", email);
        await AsyncStorage.setItem("UserPhoneNumber", phoneNumber);
        await AsyncStorage.setItem("UserImage", image);
        await AsyncStorage.setItem(
          "UserCheckboxes",
          JSON.stringify(checkboxes)
        );
        // Show success alert
        Alert.alert(
          "Changes Saved",
          "Your profile changes has been saved successfully"
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      // Show error alert if inputs are invalid
      Alert.alert("Invalid Input");
    }
  };

  // Function to discard changes and reload initial data
  const discardChanges = async () => {
    await getData(); // Reload data from AsyncStorage
  };

  useEffect(() => {
    // Hide the splash screen when fonts are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Render nothing while fonts are loading
    return null;
  }

  // Function to pick an image from the image library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all AsyncStorage data

      // Reset local state
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setImage(null);
      setCheckboxes({
        orderStatus: false,
        passwordChange: false,
        specialOffers: false,
        newsletter: false,
      });

      // Navigate to Onboarding screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Generate user initials for profile placeholder
  const userInitials = `${firstName[0] || ""}${
    lastName[0] || ""
  }`.toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.back}
        >
          <Image
            style={styles.backIcon}
            source={require("../assets/backicon.png")}
          />
        </TouchableOpacity>
        {/* Logo */}
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        {/* Profile placeholder or image */}
        <View style={styles.profileContainer}>
          <View style={styles.profilePlaceholder}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profile} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileText}>{userInitials}</Text>
              </View>
            )}
          </View>
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
          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Personal Information</Text>
            <Text style={styles.inputTitle}>Avatar</Text>
            <View style={styles.avatarContainer}>
              <View style={styles.profileImagePlaceholder}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.profileImageText}>{userInitials}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={pickImage} style={styles.changeButton}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setImage(null)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>{errors.image}</Text>
            <Text style={styles.inputTitle}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName}
              onChangeText={(value) => setFirstName(value)}
              keyboardType={"default"}
            />

            <Text style={styles.errorText}>{errors.firstName}</Text>
            <Text style={styles.inputTitle}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              value={lastName}
              onChangeText={setLastName}
              keyboardType={"default"}
            />
            <Text style={styles.errorText}>{errors.lastName}</Text>
            <Text style={styles.inputTitle}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email}
              onChangeText={setEmail}
              keyboardType={"email-address"}
            />
            <Text style={styles.errorText}>{errors.email}</Text>
            <Text style={styles.inputTitle}>Phone Number</Text>
            <MaskedTextInput
              style={styles.inputBox}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mask="(999) 999-9999"
              keyboardType="phone-pad"
            />
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>

            <Text style={styles.headerText}>Email Notifications</Text>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  style={styles.checkbox}
                  color={checkboxes ? "#495E57" : undefined}
                  value={checkboxes.orderStatus}
                  onValueChange={() =>
                    setCheckboxes((prev) => ({
                      ...prev,
                      orderStatus: !prev.orderStatus,
                    }))
                  }
                />
                <Text style={styles.checkboxLabel}>Order Statuses</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  style={styles.checkbox}
                  color={checkboxes ? "#495E57" : undefined}
                  value={checkboxes.passwordChange}
                  onValueChange={() =>
                    setCheckboxes((prev) => ({
                      ...prev,
                      passwordChange: !prev.passwordChange,
                    }))
                  }
                />
                <Text style={styles.checkboxLabel}>Password changes</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  style={styles.checkbox}
                  color={checkboxes ? "#495E57" : undefined}
                  value={checkboxes.specialOffers}
                  onValueChange={() =>
                    setCheckboxes((prev) => ({
                      ...prev,
                      specialOffers: !prev.specialOffers,
                    }))
                  }
                />
                <Text style={styles.checkboxLabel}>Special offers</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  style={styles.checkbox}
                  color={checkboxes ? "#495E57" : undefined}
                  value={checkboxes.newsletter}
                  onValueChange={() =>
                    setCheckboxes((prev) => ({
                      ...prev,
                      newsletter: !prev.newsletter,
                    }))
                  }
                />
                <Text style={styles.checkboxLabel}>Newsletter</Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.discardButton}
                onPress={discardChanges}
                //disabled={!isFirstNameValid || !isEmailValid}
              >
                <Text style={styles.removeText}>Discard Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveChanges}
                //disabled={!isFirstNameValid || !isEmailValid}
              >
                <Text style={styles.changeText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogout}
              //disabled={!isFirstNameValid || !isEmailValid}
            >
              <Text style={styles.buttonText}>Log Out</Text>
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

  formContainer: {
    // marginTop: 20,
    // paddingHorizontal: 15,
    // paddingBottom: 30,
    margin: 10,
    borderWidth: 2, // width of the border
    borderColor: "#EDEFEE", // color of the border
    borderRadius: 15, // radius for rounded corners
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
  back: {
    width: 60,
    height: 60,
    marginLeft: 15,
    marginTop: 35,
  },
  backIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  logo: {
    width: 170,
    height: 100,
    resizeMode: "contain",
    marginLeft: 50,
    marginTop: 35,
  },

  scrollableContainer: {
    flex: 1,
    marginTop: 105, // Adjust this margin based on the header height
  },

  scrollableContent: {
    paddingTop: 5,
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
  headerText: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingBottom: 12,
    color: "#495E57",
    textAlign: "left",
    fontSize: 25,
    fontFamily: "Karla",
  },
  inputTitle: {
    paddingTop: 4,
    paddingBottom: 2,
    paddingLeft: 15,
    color: "#A09C9C",
    textAlign: "left",
    fontSize: 18,
    fontFamily: "Karla",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
    marginBottom: 50,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F4CE14",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Karla",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#EDEFEE",
    resizeMode: "cover",
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EDEFEE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EDEFEE",
  },
  profileImageText: {
    fontSize: 40,
    color: "#495E57",
    fontWeight: "bold",
  },
  avatarContainer: {
    margin: 10,
    //borderWidth: 2, // width of the border
    //borderColor: "#EDEFEE", // color of the border
    //borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  changeButton: {
    height: 45,
    width: 100,
    backgroundColor: "#495E57",
    borderRadius: 10,
    marginLeft: 20,
    alignItems: "center", // Center horizontally
    justifyContent: "center",
  },
  changeText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Karla",
    textAlign: "center",
  },

  removeText: {
    color: "#495E57",
    fontSize: 16,
    fontFamily: "Karla",
    textAlign: "center",
  },

  removeButton: {
    height: 45,
    width: 100,
    backgroundColor: "white",
    borderColor: "#EDEFEE",
    borderWidth: 2,
    marginLeft: 20,
    alignItems: "center", // Center horizontally
    justifyContent: "center",
  },

  checkboxContainer: {
    paddingTop: 10,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    marginBottom: 20,
  },
  checkboxLabel: {
    paddingLeft: 20,
    color: "#A09C9C",
    textAlign: "left",
    fontSize: 18,
    fontFamily: "Karla",
  },
  checkbox: {
    height: 23,
    width: 23,
    borderRadius: 4,
    borderColor: "#EDEFEE",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    paddingTop: 30,
  },
  saveButton: {
    height: 50,
    width: 160,
    backgroundColor: "#495E57",
    borderRadius: 10,

    alignItems: "center", // Center horizontally
    justifyContent: "center",
  },
  discardButton: {
    height: 50,
    width: 160,
    backgroundColor: "#fff",
    borderColor: "#EDEFEE",
    borderWidth: 2,

    justifyContent: "center",
    marginRight: 30,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    paddingLeft: 15,
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
});
