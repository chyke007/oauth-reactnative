import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import DashboardScreen from "./screens/DashboardScreen";
import LoginScreen from "./screens/LoginScreen";
import LoadingScreen from "./screens/LoadingScreen";
import { firebaseConfig } from "./config";
import * as firebase from "firebase";

//Initialize firebase
firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
    });
  }

  render() {
    return <AppNavigator />;
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  DashboardScreen: DashboardScreen,
  LoginScreen: LoginScreen
});

const AppNavigator = createAppContainer(AppSwitchNavigator);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10
  }
});
