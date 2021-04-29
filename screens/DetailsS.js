import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("notes.db");

function updateNote({ note, text, content, navigation }) {
  const id = note.id;
  if (note.title != text || note.content != content) {
    navigation.navigate("HomeS", { text, content, id });
  } else {
    navigation.popToTop();
  }
}

export default function DetailsS({ route, navigation }) {
  const note = route.params;
  const [text, setText] = useState(route.params.title);
  const [content, setContent] = useState(route.params.content);
  return (
    <View style={[styles.container]}>
      <Text style={styles.labelText}>To do list details</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <TextInput
        multiline={true}
        style={styles.input2}
        value={content}
        onChangeText={(content) => setContent(content)}
      />

      <TouchableOpacity
        onPress={() => updateNote({ note, text, content, navigation })}
        style={[styles.submitButton]}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    width: "80%",
    backgroundColor: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  input2: {
    padding: 10,
    height: 120,
    margin: 12,
    borderWidth: 1,
    width: "80%",
    backgroundColor: "#fff",
  },
  container: {
    backgroundColor: "#e0ffff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "orange",
  },
  dismissButton: {
    padding: 10,
    margin: 5,
    backgroundColor: "blue",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
  },
  labelText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 30,
  },
});
