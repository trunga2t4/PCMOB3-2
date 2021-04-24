import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AddS from "./screens/AddS";
import MainStackS from "./screens/MainStackS";

const RootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" headerMode="none">
        <RootStack.Screen name="Main" component={MainStackS} />
        <RootStack.Screen name="AddS" component={AddS} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
