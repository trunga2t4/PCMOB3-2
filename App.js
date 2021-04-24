import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Button,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const db = SQLite.openDatabase("note.db");

function HomeS({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={console.log("Hello")}>
          <AntDesign
            name="infocirlce"
            size={40}
            color="black"
            style={styles.headerright}
          />
        </TouchableOpacity>
      ),
    });
  });

  const [noteArray, setNoteArray] = useState([
    { title: "Task 1", id: "1", done: false },
    { title: "Task 2", id: "2", done: false },
    { title: "Task 3", id: "3", done: true },
  ]);

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <View style={[styles.container]}>
      <FlatList
        style={styles.list}
        data={noteArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
      <StatusBar style="auto" />
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createStackNavigator();

export default function EventStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#87CEFA",
            height: 100,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
          },
        }}
      >
        <Stack.Screen
          name="Notes App"
          component={HomeS}
          options={{
            title: "Notes App",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 30,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#98FB98",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  title: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#999",
    borderBottomWidth: 2,
    fontSize: 20,
  },
});
