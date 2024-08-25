import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Searchbar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { init, insertMenuItems, fetchMenuItems } from "../db.js";
import * as SQLite from 'expo-sqlite/legacy';
import CategoryList from "../CategoryList.js";
import debounce from 'lodash.debounce'; // Import debounce from lodash


export default function Home({ navigation }) {
  const [fontsLoaded] = useFonts({
    Markazi: require("../assets/fonts/MarkaziText-Regular.ttf"),
    Karla: require("../assets/fonts/Karla-Regular.ttf"),
    KarlaBold: require("../assets/fonts/Karla-Bold.ttf"),
  });

  const [image, setImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const isFocused = useIsFocused(); // Hook to check if screen is focused

  const [menuData, setMenuData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

  // useEffect(() => {
  //   // Call fetchMenuData when the component mounts
  //   fetchMenuData();
  // }, []);

   useEffect(() => {
    // Initialize the database and fetch menu data
    const initializeDatabase = async () => {
      try {
        await init(); // Ensure the table is created
        fetchMenuData(); // Fetch data after initialization
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

    useEffect(() => {
    // Refresh profile data when the screen gains focus
    const getData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem("UserName");
        const storedLastName = await AsyncStorage.getItem("UserLastName");
        const storedImage = await AsyncStorage.getItem("UserImage");

        if (storedFirstName !== null) setFirstName(storedFirstName);
        if (storedLastName !== null) setLastName(storedLastName);
        if (storedImage !== null) setImage(storedImage);
      } catch (error) {
        console.log(error);
      }
    };
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

 


  const fetchMenuData = async () => {
  try {
    // Check if menu data is already in the SQLite database
    const storedMenuItems = await fetchMenuItems();
    if (storedMenuItems.length > 0) {
      setMenuData(storedMenuItems);
        setCategories([
        ...new Set([...storedMenuItems.map(item => item.category), 'Drinks', 'Specials'])
      ]);
      Alert.alert("retrieved from database");
      return; // Exit early if data is already available
    }

    // Fetch the data from the server
    const response = await fetch(
      "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
    );
    const json = await response.json();
    setMenuData(json.menu);
     setCategories([
      ...new Set([...json.menu.map(item => item.category), 'Drinks', 'Specials'])
    ]); // Extract unique categories
    Alert.alert("retrieved from api");

    // Insert new data into the menu table
    await insertMenuItems(json.menu);
    Alert.alert("insert data to database");
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
};

  const fetchFilteredMenuData = useCallback(async () => {
    try {
      const filteredMenuItems = await fetchMenuItems(selectedCategories, searchText);
      setMenuData(filteredMenuItems);
    } catch (error) {
      console.error('Error fetching filtered menu data:', error);
    }
  }, [selectedCategories, searchText]);

  useEffect(() => {
    const debouncedFetchFilteredMenuData = debounce(fetchFilteredMenuData, 500);
    debouncedFetchFilteredMenuData();
    return () => {
      debouncedFetchFilteredMenuData.cancel();
    };
  }, [fetchFilteredMenuData]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Optionally render a loading indicator while fonts are loading
  }

  const userInitials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  const handleSelectCategory = (category) => {
    setSelectedCategories(prevSelectedCategories =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter(cat => cat !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const handleSearchChange = (query) => {
    setSearchText(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.backIcon}
          source={require("../assets/backicon.png")}
        />
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.profilePlaceholder}
          >
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
        <View style={styles.scrollableContent} keyboardDismissMode="on-drag">
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
              onChangeText={handleSearchChange}
              value={searchText}
              style={styles.searchBar}
              iconColor="black"
              inputStyle={{ color: "black" }}
              elevation={0}
            
            />
          </View>
        </View>
        <View keyboardDismissMode= "on-drag">
        <Text style={styles.delivery}>ORDER FOR DELIVERY !</Text>
        <View style={styles.categoryComponent}>
        <ScrollView horizontal={true}>
        
        <CategoryList
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectCategory={handleSelectCategory}
        />
        </ScrollView>
        <View style={styles.categoryDivider} />
        </View>

        <FlatList
          data={menuData.filter(item => selectedCategories.includes(item.category) || selectedCategories.length === 0)} // Filter menu data based on selected categories
          keyExtractor={(item, index) => `${item.name}-${index}`} // Generate unique key
          renderItem={({ item }) => (
            <View>
              <View style={styles.item}>
                <View style={styles.TextContainer}>
                  <Text style={styles.title}>{item.name}</Text>
                  <ScrollView style={styles.scrollText} horizontal={true}>
                    <Text style={styles.descriptionText}>
                      {item.description}
                    </Text>
                  </ScrollView>
                  <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                   <Text style={styles.priceText}>{item.category}</Text>
                </View>
                <Image
                  source={{
                    uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.divider} />
            </View>
          )}
          contentContainerStyle={styles.menulist}
        />
        </View>
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
    width: 388,
    borderRadius: 15,
    marginTop: 15,
    backgroundColor: "#fff",
    shadowRadius: 0,
    shadowOpacity: 0,
    alignSelf: "center",
  },
  item: {
    paddingLeft: 9,
    marginBottom: 20,
    flexDirection: "row",
  },
  TextContainer: {
    paddingRight: 20,
  },
  image: {
    width: 100,
    height: 100,

    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "KarlaBold",
  },
  descriptionText: {
    fontFamily: "Karla",
    fontSize: 16,
    color: "#495E57",
    marginTop: 15,
    width: 550,
  },
  menulist: {
    padding: 15,
  },
  scrollText: {
    width: 270,
  },
  priceText: {
    marginBottom: 10,
    fontSize: 16,
    fontFamily: "KarlaBold",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#EDEFEE",
    marginBottom: 25,
  },
  delivery:{
     fontSize: 20,
    fontFamily: "KarlaBold",
    marginTop: 20,
    marginLeft: 24.5,
    marginBottom: 10,
  },
  categoryComponent:{
   
   
    backgroundColor: "white", // Ensure background color to prevent overlap issue
    zIndex: 1, // 
  },
   categoryDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#EDEFEE",
    marginTop: 5,
   },
});
