
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function Splash({navigation}) {

const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {

 // Simulate a delay if needed (optional)
        //await new Promise(resolve => setTimeout(resolve, 3000));

        const value = await AsyncStorage.getItem("UserName");
        if (value) {
          navigation.navigate('Profile');
        } else {
          navigation.navigate('Onboarding');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(true); // Set loading to false when done
        await SplashScreen.hideAsync(); // Hide splash screen only after async operations
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

   if (isLoading) {
    // Show splash screen content while loading
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/little-lemon-logo.png')} />
        <Text style={styles.text}>LOADING...</Text>
      </View>
    );
  } 

  // Return null or a placeholder if needed, though navigation should be handled before this point
  return null;


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
