import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList, Text, ScrollView } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("notes.db");

export default function HomeS({ route, navigation }) {
  const [noteArray, setNoteArray] = useState();
  const [doneArray, setDoneArray] = useState();
  const [selected, setSellected] = useState(-1);

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
          "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, done INT);"
        );
      },
      null,
      refreshNotes
    );
  }, []);

  useEffect(() => {
    if (route.params?.id) {
      if (route.params.id == -1) {
        db.transaction(
          (tx) => {
            tx.executeSql(
              "INSERT INTO notes(done, title, content) VALUES (0, ?, ?)",
              [route.params.text, route.params.content]
            );
          },
          null,
          refreshNotes
        );
      } else {
        db.transaction(
          (tx) => {
            tx.executeSql(
              `UPDATE notes SET title = ?, content = ? WHERE id = ${route.params.id};`,
              [route.params.text, route.params.content]
            );
          },
          null,
          refreshNotes
        );
      }
    }
  }, [route.params?.id, route.params?.content, route.params?.text]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addNote}>
          <AntDesign
            name="pluscircleo"
            size={30}
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
    if (selected == item.id) {
      setSellected(0);
    }
    db.transaction(
      (tx) => {
        tx.executeSql(`UPDATE notes SET done = ? WHERE id =?`, [1, item.id]);
      },
      null,
      refreshNotes
    );
  }
  function markUndone({ item }) {
    db.transaction(
      (tx) => {
        tx.executeSql(`UPDATE notes SET done = ? WHERE id = ${item.id}`, [0]);
      },
      null,
      refreshNotes
    );
  }
  function deleteNote({ item }) {
    db.transaction(
      (tx) => {
        tx.executeSql(`DELETE FROM notes WHERE id = ?`, [item.id]);
      },
      null,
      refreshNotes
    );
  }

  function currentSelected({ item }) {
    if (selected == item.id) {
      setSellected(0);
    } else {
      setSellected([item.id]);
    }
  }

  function renderNoteItem({ item }) {
    if (item.id == selected) {
      return (
        <View style={[styles.row]}>
          <TouchableOpacity
            onPress={() => markDone({ item })}
            style={{ flex: 1 }}
          >
            <AntDesign
              style={[styles.title]}
              name="check"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => currentSelected({ item })}
            onLongPress={() =>
              navigation.navigate("DetailsS", { navigation, ...item })
            }
            style={{ flex: 8 }}
          >
            <View style={[styles.container]}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.detail]}>{item.content}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteNote({ item })}
            style={{ flex: 1 }}
          >
            <AntDesign
              style={[styles.title]}
              name="delete"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={[styles.row]}>
          <TouchableOpacity
            onPress={() => markDone({ item })}
            style={{ flex: 1 }}
          >
            <AntDesign
              style={[styles.title]}
              name="check"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => currentSelected({ item })}
            onLongPress={() =>
              navigation.navigate("DetailsS", { navigation, ...item })
            }
            style={{ flex: 8 }}
          >
            <View style={[styles.container]}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteNote({ item })}
            style={{ flex: 1 }}
          >
            <AntDesign
              style={[styles.title]}
              name="delete"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      );
    }
  }
  function renderDoneItem({ item }) {
    return (
      <View style={[styles.row, { backgroundColor: "lightgray" }]}>
        <TouchableOpacity onPress={() => markUndone({ item })}>
          <Entypo
            style={styles.title2}
            name="add-to-list"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => markUndone({ item })}>
          <Text style={styles.title2}>{item.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteNote({ item })}>
          <AntDesign
            style={styles.title2}
            name="delete"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { justifyContent: "flex-start" },
      ]}
    >
      <View style={[styles.container]}>
        <FlatList
          style={styles.list}
          data={noteArray}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View style={[styles.container]}>
        <FlatList
          style={styles.list}
          data={doneArray}
          renderItem={renderDoneItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0ffff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  headerright: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20,
    paddingTop: 20,
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
    padding: 10,
    margin: 2,
    fontSize: 20,
  },
  title2: {
    padding: 5,
    margin: 2,
    fontSize: 20,
  },
  detail: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    textAlign: "left",
    flex: 1,
    flexWrap: "wrap",
  },
});
