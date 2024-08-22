import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('LittleLemon.db');

export const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Dish (id INTEGER PRIMARY KEY NOT NULL, name TEXT, price REAL, description TEXT, image TEXT, category TEXT);',
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
          'INSERT INTO Dish (name, price, description, image) VALUES (?, ?, ?, ?, ?);',
          [item.name, item.price, item.description, item.image, item.category],
          () => {},
          (_, error) => reject(error)
        );
      });
      resolve();
    });
  });
};

export const fetchMenuItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Dish;',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};


export const deleteAllMenuItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Dish;',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};