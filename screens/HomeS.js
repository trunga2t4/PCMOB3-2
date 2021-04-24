import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList, Text, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("notes.db");

export default function HomeS({ route, navigation }) {
  const [noteArray, setNoteArray] = useState();
  const [doneArray, setDoneArray] = useState();

  function refreshNotes() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes WHERE done = 0",
        null,
        (txObj, { rows: { _array } }) => setNoteArray(_array),
        (txObj, error) => console.log("error", error)
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes WHERE done = 1",
        null,
        (txObj, { rows: { _array } }) => setDoneArray(_array),
        (txObj, error) => console.log("error", error)
      );
    });
  }

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, done INT);"
        );
      },
      null,
      refreshNotes
    );
  }, []);
  useEffect(() => {
    if (route.params?.text) {
      db.transaction(
        (tx) => {
          tx.executeSql("INSERT INTO notes(done, title) VALUES (0, ?)", [
            route.params.text,
          ]);
        },
        null,
        refreshNotes
      );
    }
  }, [route.params?.text]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <AntDesign
            name="pluscircleo"
            size={40}
            color="black"
            style={styles.headerright}
          />
        </TouchableOpacity>
      ),
    });
  });

  function addNote() {
    navigation.navigate("AddS");
  }
  function markDone({ item }) {
    db.transaction(
      (tx) => {
        tx.executeSql(`UPDATE notes SET done = 1 WHERE id = ${item.id}`);
      },
      null,
      refreshNotes
    );
  }
  function markUndone({ item }) {
    db.transaction(
      (tx) => {
        tx.executeSql(`UPDATE notes SET done = 0 WHERE id = ${item.id}`);
      },
      null,
      refreshNotes
    );
  }
  function deleteNote({ item }) {
    db.transaction(
      (tx) => {
        tx.executeSql(`DELETE FROM notes WHERE id = ${item.id}`);
      },
      null,
      refreshNotes
    );
  }

  function renderNoteItem({ item }) {
    return (
      <View style={[styles.row]}>
        <TouchableOpacity onPress={() => markDone({ item })}>
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote({ item })}>
          <AntDesign
            style={styles.icon}
            name="delete"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    );
  }
  function renderDoneItem({ item }) {
    return (
      <View style={[styles.row, { backgroundColor: "lightgray" }]}>
        <TouchableOpacity onPress={() => markUndone({ item })}>
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote({ item })}>
          <AntDesign
            style={styles.icon}
            name="delete"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.container]}>
        <Text style={styles.labelText}>Current Todo List</Text>
        <FlatList
          style={styles.list}
          data={noteArray}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={[styles.container]}>
        <Text style={styles.labelText}>Done Todo List</Text>
        <FlatList
          style={styles.list}
          data={doneArray}
          renderItem={renderDoneItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0ffff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headerright: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20,
  },
  list: {
    width: "100%",
  },
  row: {
    borderBottomColor: "#999",
    borderBottomWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    padding: 20,
    margin: 2,
    fontSize: 20,
  },
  icon: {
    padding: 20,
    margin: 2,
    fontSize: 20,
  },

  labelText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 30,
  },
});
