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

const onChangeText = () => setAddNote(() => []);

export default function AddS({ navigation }) {
  const [text, setText] = useState();
  return (
    <View style={[styles.container]}>
      <Text style={styles.labelText}>Add your Todo</Text>
      <TextInput
        placeholder="Add your task/note here"
        style={styles.input}
        onChangeText={(text) => setText(text)}
      />
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeS", { text })}
          style={[styles.submitButton]}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.dismissButton]}
        >
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
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
