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
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
    });
  }

  signUpUser = (email, password) => {
    try {
      if (this.state.password.length < 6) {
        alert("Please enter at least 6 characters");
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      alert(e);
    }
  };

  loginUser = (email, password) => {
    try {
      if (this.state.password.length < 6) {
        alert("Please enter at least 6 characters");
        return;
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user);
        });
    } catch (e) {
      alert(e);
    }
  };

  async signInWithFacebook() {
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync("2336903713292417", {
      permissions: ["public_profile"]
    });

    if (type == "success") {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(error => {
          console.log(error);
        });
    }
  }
    isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

   onSignIn = (googleUser) => {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!this.isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken,
            );
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential).then(function(result){
        console.log('User signed in');
        if(result.additionalUserInfo.isNewUser){
          firebase.database().ref('/users/' + result.user.uid)
        .set({
          gmail:result.user.email,
          profile_picture: result.additionalUserInfo.profile.picture,
          locale:result.additionalUserInfo.profile.locale,
          first_name:result.additionalUserInfo.profile.given_name,
          last_name:result.additionalUserInfo.profile.family_name,
          createdAt:Date.now()
        }).then((snapshot) => {

        }) 
        }else{
          firebase.database().ref('/users/' + result.user.uid)
        .update({
          last_loggen_in:Date.now()
        }).then((snapshot) => {

        }).catch(function (err){
          console.log(err);
        })
        }
        
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    } else {
      console.log('User already signed-in Firebase.');
    }
  }.bind(this));
}
  async signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "942053969156-4vkd9d8va9g6470la02queiamm6h4nol.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,
        behavior: "web",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
            />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTestEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={password => this.setState({ password })}
            />
          </Item>

          <Button
            style={{ marginTop: 10 }}
            full
            rounded
            success
            onPress={() =>
              this.loginUser(this.state.email, this.state.password)}
          >
            <Text style={{ color: "white" }}> Login </Text>
          </Button>
          <Button
            style={{ marginTop: 10 }}
            full
            rounded
            primary
            onPress={() =>
              this.signUpUser(this.state.email, this.state.password)}
          >
            <Text style={{ color: "white" }}> Sign Up </Text>
          </Button>

          <Button
            style={{ marginTop: 10 }}
            full
            rounded
            primary
            onPress={() => this.signInWithFacebook()}
          >
            <Text style={{ color: "white" }}> Login With Facebook </Text>
          </Button>

          <Button
            style={{ marginTop: 10 }}
            full
            rounded
            danger
            onPress={() => this.signInWithGoogle()}
          >
            <Text style={{ color: "white" }}> Login With Google </Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    padding: 10
  }
});
