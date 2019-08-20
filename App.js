import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';

//Initialize firebase
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    
  }; 
firebase.initializeApp(firebaseConfig);

export default class App extends Component {
  constructor(props){
    super(props)

    this.state  = ({
      email:'',
      password:''
    })
  }
componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user)
    })
}

signUpUser = (email,password) => {

  try{
    if(this.state.password.length < 6){
      alert("Please enter at least 6 characters")
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(email,password)
  }catch(e){
    alert(e);
  }
}

loginUser = (email,password) => {
   try{
    if(this.state.password.length < 6){
      alert("Please enter at least 6 characters")
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email,password).then((user) => {
      console.log(user);
    })
  }catch(e){
    alert(e)
  }
}

async LoginWithFacebook(){
  
  const { type,token } = await Facebook.logInWithReadPermissionsAsync('2336903713292417',{permissions:['public_profile']})


 if(type == 'success'){
  const credential = firebase.auth.FacebookAuthProvider.credential(token)
  
  firebase.auth().signInWithCredential(credential).catch((error) => {
    console.log(error);
  })
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
            autoComplete="none"
            onChangeText = {(email) => this.setState({email})}
            />
          </Item>

         <Item floatingLabel>
          <Label>Password</Label>
          <Input 
            secureTestEntry={true}
            autoCorrect={false}
            autoComplete="none"
            onChangeText ={(password) => this.setState({password})}/>
          </Item>

          <Button style={{ marginTop: 10 }}
            full
            rounded
            success
            onPress={() => this.loginUser(this.state.email,this.state.password)}
          >
            <Text style={{ color:'white' }}> Login </Text>
          </Button> 
           <Button style={{ marginTop: 10 }}
            full
            rounded
            primary
            onPress={() => this.signUpUser(this.state.email,this.state.password)}
          >
            <Text style={{ color:'white' }}> Sign Up </Text>
          </Button> 

            <Button style={{ marginTop: 10 }}
            full
            rounded
            primary
            onPress={() => this.LoginWithFacebook()}
          >
            <Text style={{ color:'white' }}> Login With Facebook </Text>
          </Button> 
        </Form>
      </Container>
     
    );
  }
}







const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    
    padding:10
  },
});
