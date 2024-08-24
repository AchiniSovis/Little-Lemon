import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CategoryList = ({ categories, selectedCategories, onSelectCategory }) => {

  const handlePress = (category) => {
    onSelectCategory(category);
  };

  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategories.includes(category) && styles.selectedCategory,
          ]}
          onPress={() => handlePress(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategories.includes(category) && styles.selectedCategoryText,
            ]}
          >
            {category}
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
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
     marginBottom: 10,
    alignItems: "center",
    height: 40,
  },
  selectedCategory: {
    backgroundColor: "#9F9F9F",
  
  },
  categoryText: {
    color: "#495E57",
    fontFamily: "Karla",
    fontSize: 16,
  },
  selectedCategoryText: {
    color: "#fff",
    fontFamily: "KarlaBold",
  },
});

export default CategoryList;
