import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('little_lemon.db');

export const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY NOT NULL, name TEXT, price REAL, description TEXT, image TEXT, category TEXT);',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertMenuItems = menuItems => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      menuItems.forEach(item => {
        tx.executeSql(
          'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
          [item.name, item.price, item.description, item.image, item.category],
          () => {},
          (_, error) => reject(error)
        );
      });
      resolve();
    });
  });
};

// export const fetchMenuItems = () => {
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM menu;',
//         [],
//         (_, { rows: { _array } }) => resolve(_array),
//         (_, error) => reject(error)
//       );
//     });
//   });
// };

export const fetchMenuItems = (categories = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Construct the SQL query based on whether categories are provided
      const query = categories.length > 0
      // If categories are provided, use a parameterized query to filter by these categories
        ? `SELECT * FROM menu WHERE category IN (${categories.map(() => '?').join(', ')});`
        // If no categories are provided, select all items
        : 'SELECT * FROM menu;';
   // Execute the SQL query
      tx.executeSql(
        query, // The SQL query string
        categories, // The values to replace placeholders in the query, if any
        (_, { rows: { _array } }) => resolve(_array), // On success, resolve with the fetched rows
        (_, error) => reject(error) // On error, reject with the error
      );
    });
  });
};



export const deleteAllMenuItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM menu;',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

