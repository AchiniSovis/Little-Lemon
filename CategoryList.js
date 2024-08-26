import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  // Converts the first character of the string to uppercase and appends the rest of the string unchanged
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Component to render a list of category buttons
const CategoryList = ({ categories, selectedCategories, onSelectCategory }) => {
  // Handler for when a category button is pressed
  const handlePress = (category) => {
    // Calls the onSelectCategory function passed as a prop with the selected category
    onSelectCategory(category);
  };

  return (
    // Map through the categories array to create a button for each category
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category} // Unique key for each button, using the category name
          style={[
            styles.categoryButton, // Default style for the button
            selectedCategories.includes(category) && styles.selectedCategory, // Conditional styling for selected categories
          ]}
          onPress={() => handlePress(category)} // Handler for button press
        >
          <Text
            style={[
              styles.categoryText, // Default text style
              selectedCategories.includes(category) &&
                styles.selectedCategoryText,
            ]}
          >
            {capitalizeFirstLetter(category)}{" "}
            {/* Capitalize and display the category name */}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 10,
    flexWrap: "wrap",
    zIndex: 1,
  },
  categoryButton: {
    backgroundColor: "#EDEFEE",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
    height: 40,
  },
  selectedCategory: {
    backgroundColor: "#495E57",
  },
  categoryText: {
    color: "#495E57",
    fontFamily: "KarlaBold",
    fontSize: 16,
  },
  selectedCategoryText: {
    color: "#fff",
    fontFamily: "KarlaBold",
  },
});

export default CategoryList;
