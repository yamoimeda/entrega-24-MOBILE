import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View,TextInput,TouchableOpacity,SafeAreaView,useRef } from "react-native";


const App = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [id, setID] = useState('');
  

 

  return (
    < View style={styles.container}>
     
        <View style={styles.contenedor}>
            <Text style={styles.descrip}>Confirmar</Text>
        </View>
     
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:'100%',
    width:'100%',
    justifyContent: "center",
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  contenedor: {
      height:'60%',
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
    width:'90%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  boton:{
    width:'90%',
    height:'70%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8
  },
  descrip: {
    fontSize: 15,
    color:'#ebedef'
  },
  
});

export default App;