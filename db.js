import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('little_lemon.db');

export const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY NOT NULL, name TEXT, price REAL, description TEXT, image TEXT);',
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
          'INSERT INTO menu (name, price, description, image) VALUES (?, ?, ?, ?);',
          [item.name, item.price, item.description, item.image],
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
        'SELECT * FROM menu;',
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
        'DELETE FROM menu;',
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};