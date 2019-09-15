import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label
} from "native-base";
import * as firebase from 'firebase';
class DashboardScreen extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Text> Dashboard</Text>

        
         <Button
            style={{ marginTop: 10 }}
            full
            rounded
            danger
            onPress = {() => firebase.auth().signOut() }
          >
            <Text style={{ color: "white" }}> Sign Out </Text>
          </Button>
      </Container>
    );
  }
}

export default DashboardScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems : "center",
    fontWeight: "bold"
  }
});
