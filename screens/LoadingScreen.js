import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";

import * as firebase from "firebase";

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }
  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("DashboardScreen");
      } else {
        this.props.navigation.navigate("LoginScreen");
      }
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

export default LoadingScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    padding: 10
  }
});
