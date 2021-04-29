import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeS from "./HomeS";
import DetailsS from "./DetailsS";

const MainStack = createStackNavigator();

export default function MainStackS() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#87CEFA",
          height: 100,
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
        },
      }}
    >
      <MainStack.Screen
        name="HomeS"
        component={HomeS}
        options={{
          title: "TO DO LIST",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 30,
          },
        }}
      />
      <MainStack.Screen
        name="DetailsS"
        component={DetailsS}
        options={{
          title: "Details",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 30,
          },
        }}
      />
    </MainStack.Navigator>
  );
}
