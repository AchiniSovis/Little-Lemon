import * as SQLite from "expo-sqlite/legacy";

// Open or create a database named 'little_lemon.db'
const db = SQLite.openDatabase("little_lemon.db");

// Initializes the database and creates the 'menu' table if it does not exist
export const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        // SQL query to create the 'menu' table with necessary columns
        "CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY NOT NULL, name TEXT, price REAL, description TEXT, image TEXT, category TEXT);",
        [],
        () => resolve(), // Resolve the promise if the table is created successfully
        (_, error) => reject(error) // Reject the promise if there's an error
      );
    });
  });
};

// Inserts an array of menu items into the 'menu' table
export const insertMenuItems = (menuItems) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Iterate over each menu item and execute an insert statement
      menuItems.forEach((item) => {
        tx.executeSql(
          // SQL query to insert a menu item into the table
          "INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);",
          [item.name, item.price, item.description, item.image, item.category], // Values to be inserted
          () => {}, // No action needed on success
          (_, error) => reject(error) // Reject the promise if there's an error
        );
      });
      resolve(); // Resolve the promise after all insertions
    });
  });
};

// Fetches menu items from the 'menu' table based on optional filters for categories and search text
export const fetchMenuItems = (categories = [], searchText = "") => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Base SQL query to select all rows from the 'menu' table
      let query = "SELECT * FROM menu";
      const params = [];
      // If categories are provided, add a WHERE clause to filter by category
      if (categories.length > 0) {
        query +=
          " WHERE category IN (" + categories.map(() => "?").join(", ") + ")";
        params.push(...categories); // Add categories to the query parameters
      }
      // If searchText is provided, add an additional filter for name
      if (searchText) {
        query += (categories.length > 0 ? " AND " : " WHERE ") + "name LIKE ?";
        params.push(`%${searchText}%`); // Add the search text to the query parameters with wildcard characters
      }
      // Execute the SQL query with the constructed query and parameters
      tx.executeSql(
        query, // The SQL query string
        params, // The values to replace placeholders in the query
        (_, { rows: { _array } }) => resolve(_array), // On success, resolve with the fetched rows
        (_, error) => reject(error) // On error, reject with the error
      );
    });
  });
};

// Deletes all records from the 'menu' table
export const deleteAllMenuItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        // SQL query to delete all records from the 'menu' table
        "DELETE FROM menu;",
        [],
        () => resolve(), // Resolve the promise if deletion is successful
        (_, error) => reject(error) // Reject the promise if there's an error
      );
    });
  });
};
