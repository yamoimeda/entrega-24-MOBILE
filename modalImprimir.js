import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View,TextInput,SafeAreaView } from "react-native";

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    < SafeAreaView style={styles.container}>
     
        <View style={styles.contenedor}>
        <TextInput
        style={styles.input}
        //onChangeText={onChangeText}
        //value={text}
      />
        </View>
     
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  contenedor: {
      height:'20%',
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  
});

export default App;