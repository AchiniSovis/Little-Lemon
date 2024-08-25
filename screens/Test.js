import React, { useEffect } from "react";
import { View, Text } from "react-native";
import {
  init,
  fetchMenuItems,
  insertMenuItems,
  deleteAllMenuItems,
  deleteTable,
} from "../db";

export default function Test() {
  useEffect(() => {
    const testDatabase = async () => {
      try {
        await init(); // Initialize database
        console.log("Database initialized");

        // Delete all menu items
        // await deleteAllMenuItems();
        // console.log('All menu items deleted');
        // await deleteTable();
        // console.log("table deleted");

       // Optionally, insert test data if needed
        // const testItems = [
        //   { name: 'Item 1', price: 10.0, description: 'Description 1', image: 'Image 1' },
        //   { name: 'Item 2', price: 20.0, description: 'Description 2', image: 'Image 2' },
        // ];
        // await insertMenuItems(testItems);
        // console.log('Test data inserted');
           // Insert test data
    console.log('Inserting test data...');
    const menuItems = [
      { name: 'Test Item', price: 10.0, description: 'Test Description', image: 'test.png', category: 'Test Category' }
    ];
    await insertMenuItems(menuItems);
    console.log('Test data inserted successfully.');
        //Fetch menu items to confirm deletion
        const items = await fetchMenuItems();
        console.log('Fetched items:', items); // Check if data was fetched

        //Optionally, display data
        if (items.length > 0) {
          console.log('Menu items:', items);
        } else {
          console.log('No menu items found.');
        }
      } catch (error) {
        console.error("Database operation failed:", error);
      }
    };

    testDatabase();
  }, []);

  return (
    <View>
      <Text>Check the console for database test results.</Text>
    </View>
  );
}
