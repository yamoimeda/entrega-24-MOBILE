import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,FlatList,TouchableOpacity,Modal } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Searchbar } from 'react-native-paper';
import fire from './firebase';
import Modalimprimir from './modalImprimir';
import * as Print from 'expo-print';
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from "react-native-thermal-receipt-printer";

import EscPosPrinter from 'react-native-esc-pos-printer';

export default  class Preferences extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      data : [],
      datas:[],
      hasPermission:null,
      scanned:false,
      users:{},
      red:"",
      total:0,
      registrados:0,
      firstQuery:'',
      scantext:"",
      scancolor:'grey',
      modalimprimir:false,
      printers:[]
    };
  }

  async componentDidMount(){
   
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({hasPermission:status} );
    var newdata=[]
    var newdatauser= {}
        fire.firestore().collection("usuarios")
        .get()
        .then((querySnapshot) => {
         
            querySnapshot.forEach((doc) => {
                
                newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre}
            });
            this.setState({users:newdatauser})
            
            
        }).then( ()=>{
          
               //inicia
                
                    fire.firestore().collection("pedidos")
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      
                        var dd = {
                          cliente_nombre: newdatauser[doc.data().cliente].nombre,
                          ...doc.data()
                        }
                        newdata.push( dd)
                    });
                    this.setState({data:newdata,datas:newdata})
                  })
                  .catch((error) => {
                    console.log("Error getting documents: ", error);
                  });

                })
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({scanned: true, scantext:"correcto",scancolor:'green'});
    
    this.setState({scanned: false});
  };

  searchFilterFunction = text => {    
    const newData = this.state.datas.filter(item => {      
      const itemData = `${item.cliente_nombre.toUpperCase()}`;
      
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });
    
    this.setState({ data: newData });  
  };

  

  imprimir = async() =>{
    EscPosPrinter.discovery()
  .then((printers) => {
    console.log(printers[0]);
    /*
    {
      name: "TM_M10",
      ip: "192.168.192.168" or "",
      mac: "12:34:56:78:56:78" or "",
      target: "TCP:192.168.192.168" or "BT:00:22:15:7D:70:9C" or "USB:000000000000000000",
      bt: "12:34:56:78:56:78" or "",
      usb: "000000000000000000" or "";
      usbSerialNumber: "123456789012345678" or ""; // available if usbSerialNumber === true
    }
  */
  })
  .catch((e) => console.log('Print error:', e.message));
    this.setState({modalimprimir:true})
    console.log(this.state.printers)
  }
  render() {
    if (this.state.hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  return (
    <View style={styles.container}>

      
      <View style={styles.lista}>
      <Searchbar
        placeholder="Buscar"
        onChangeText={query => { this.searchFilterFunction(query)}}
      />
        <FlatList
        
          data={this.state.data}
          renderItem={({ item }) => 
          
          <View style={styles.item}>
          <TouchableOpacity style={styles.arriba}>
            <View style={styles.titulo}>
                  <Text style={[styles.title,{position:'relative',left:10}]}>{item.cliente_nombre}</Text>
                  <Text style={[styles.title,{position:'absolute',right:10}]}>SM</Text>
            </View>
            <View style={styles.info}>
            <Text style={styles.descripcion}>{item["NOMBRE PROD"]}</Text>
              <Text style={styles.descripcion}cion>Cantidad: {item["CANTIDAD"]}, Contacto: {item["NOMBRE CONTACTO"]}</Text>
            </View>
              
        </TouchableOpacity>
        <View style={styles.abajo}>
          
          <TouchableOpacity style={[styles.boton,{backgroundColor:'red',}]}>
              <Text style={styles.descrip}>Rechazar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boton,{backgroundColor:'#04101e',marginHorizontal:20}]}>
              <Text style={styles.descrip}>Cambiar tamaño</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boton,{backgroundColor:'green',}]} onPress={this.imprimir}>
              <Text style={styles.descrip}>Imprimir</Text>
          </TouchableOpacity>
        </View>
      </View>}
          keyExtractor={item => item.uid}
        />
    </View>
    <Modal
        animationType="none"
        transparent={true}
        visible={this.state.modalimprimir}
        onRequestClose={() => {
          this.setState({modalimprimir:false})
        }}
      >
       <Modalimprimir/>
      </Modal>
    </View>
  )
}
}
 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lista:{
    flex:1,
    width:"100%",
    backgroundColor:"#ebedef",
    marginTop:50
   
  },
  camara:{
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    marginTop:-90
  },
  mensaje:{
    position:'absolute',
    top:50,
    height:'5%',
    width:'40%',
    opacity:0.5,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    color:'#ffffff'
  },
  item: {
    backgroundColor: '#ffffff',
    marginVertical: 7,
    marginHorizontal: 10,
    height:130,
    borderRadius:3,
    elevation: 20,
    shadowColor: '#52006A',
  },
  title: {
    fontSize: 18,

    },
  descrip: {
    fontSize: 15,
    color:'#ebedef'
  },
  arriba:{
    
    height:'65%',
  },
  abajo:{
    flexDirection:'row',
    height:'35%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#0a2b4c',
    borderRadius:3

  },
  titulo:{
    flexDirection:'row',
    fontSize:14,
    height:'50%',
    alignItems:'center',
    borderBottomWidth:1,
    borderBottomColor:'black',
    marginHorizontal:10
  },
  info:{
    height:'50%',
    alignItems:'center',
    marginBottom:10
  },
  descripcion:{
    fontSize: 14,
    color:'black'
  },
  boton:{
    
    height:'70%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:8
  }
});
