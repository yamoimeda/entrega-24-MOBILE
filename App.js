import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,FlatList,TouchableOpacity,Modal,Alert  } from 'react-native';
import { Searchbar } from 'react-native-paper';
import fire from './firebase';
import Modalimprimir from './modalImprimir';
//import {app} from './alertas'
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
      printers:[],
      alert:false,
      tamano:false,
      uid:'',
      texto:''
    };
  }

  async componentDidMount(){
   

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
                
                    fire.firestore().collection("pedidos").where('status','==',0)
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

 


  info = (it) =>
  {
    var text= ''
    for (const [key, value] of Object.entries(it)) {
      text= text + key+': '+value+'\n'
    }
    this.setState({ alert: true,texto:text })
  }
  
  rechazaralert = (uid,st) =>{

    Alert.alert(
      "¿Estás seguro?",
      "Confirmar",
      [
        {
          text: "Si",
          onPress: () => this.editar(uid,st)
        },
        
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
      ]
  );

  }
  searchFilterFunction = text => {    
    const newData = this.state.datas.filter(item => {      
      const itemData = `${item.cliente_nombre.toUpperCase()}`;
      
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });
    
    this.setState({ data: newData });  
  };

  editartamaño = (uid,tamano) => {
  
   
    var edit=fire.firestore().collection("pedidos").doc(uid);

    edit.update({
      tamano: tamano
   })
   .then(() => {
    var newdata = this.state.data
      var index = newdata.findIndex((obj => obj.uid == uid));

      newdata[index].tamano = tamano
      this.setState({data:newdata})
   })
 
   this.setState({ tamano: false }) 
  }

  imprimir = async(uid) =>{
    
    this.setState({modalimprimir:true, uid:uid})
    console.log(uid)
  }


  editar = (uid,status) => {
  
   
      var edit=fire.firestore().collection("pedidos").doc(uid);

      edit.update({
         status: status
     })
     .then(() => {
      this.setState({modalimprimir:false})
      var newdata = this.state.data
      var index = newdata.findIndex((obj => obj.uid == uid));

      newdata[index].status = status
      this.setState({data:newdata})
     })
   

    }
  
  

  render() {
   
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
          <TouchableOpacity style={styles.arriba} onPress={()=> this.info(item)}>
            <View style={styles.titulo}>
                  <Text style={[styles.title,{position:'relative',left:10}]}>{item.cliente_nombre}</Text>
                  <Text style={[styles.title,{position:'absolute',right:10}]}>{item.tamano}</Text>
            </View>
            <View style={styles.info}>
            <Text style={styles.descripcion}>{item["NOMBRE PROD"]}</Text>
              <Text style={styles.descripcion}cion>Cantidad: {item["CANTIDAD"]}, Contacto: {item["NOMBRE CONTACTO"]}</Text>
            </View>
              
        </TouchableOpacity>
        <View style={styles.abajo}>
          { item.status == 6 ? <TouchableOpacity style={[styles.boton,{backgroundColor:'red',}]} onPress={()=>this.rechazaralert(item.uid,0)}>
              <Text style={styles.descrip}>Deshacer</Text>
          </TouchableOpacity> :<TouchableOpacity style={[styles.boton,{backgroundColor:'red',}]} onPress={()=>this.rechazaralert(item.uid,6)}>
              <Text style={styles.descrip}>Rechazar</Text>
          </TouchableOpacity>}
          
          <TouchableOpacity style={[styles.boton,{backgroundColor:'#04101e',marginHorizontal:20}]} onPress={()=> this.setState({ tamano: true,uid:item.uid })}>
              <Text style={styles.descrip}>Cambiar tamaño</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boton,{backgroundColor:'green',}]} onPress={()=>this.imprimir(item.uid)}>
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
      <Modal
         transparent={true}
         visible={this.state.alert}
         animationIn="slideInLeft"
         animationOut="slideOutRight">
         <View
           style={{
             backgroundColor: 'rgba(0,0,0,0.2)',
             alignItems: 'center',
             justifyContent: 'center',
             flex: 1,
           }}>
           <View
             style={{
               width: '90%',
               backgroundColor: 'white',
               padding: 22,
               justifyContent: 'center',
               alignItems: 'center',
               borderRadius: 4,
               borderColor: 'rgba(0, 0, 0, 0.1)',
             }}>
             <Text>{this.state.texto}</Text>
             <Button
               onPress={() => { this.setState({ alert: false }) }}
               title="ok"
             />
             
           </View>
         </View>
       </Modal>
       <Modal
         transparent={true}
         visible={this.state.tamano}
         animationIn="slideInLeft"
         animationOut="slideOutRight">
         <View
           style={{
             backgroundColor: 'rgba(0,0,0,0.2)',
             alignItems: 'center',
             justifyContent: 'center',
             flex: 1,
           }}>
           <View
             style={{
               width: '90%',
               backgroundColor: 'white',
               padding: 22,
               justifyContent: 'center',
               alignItems: 'center',
               borderRadius: 4,
               borderColor: 'rgba(0, 0, 0, 0.1)',
             }}>
             <Text>Cambiar tamaño de paquete </Text>
             <View style={{flexDirection:'row',justifyContent: 'space-between',}}>
             <Button
               onPress={() => { this.setState({ tamano: false }) }}
               title="Cancelar"
             />
             <TouchableOpacity
             style={{width:50, backgroundColor:'blue',marginLeft:20,borderRadius:5,justifyContent:'center',alignItems:'center'}}
               onPress={() => { this.editartamaño(this.state.uid,'SM') }}
               
             >
               <Text style={styles.descrip} >SM</Text>
             </TouchableOpacity>
             <TouchableOpacity
             style={{width:50,backgroundColor:'blue',marginLeft:20,borderRadius:5,justifyContent:'center',alignItems:'center'}}
               onPress={() => { this.editartamaño(this.state.uid,'M')}}
               
               >
               <Text style={styles.descrip}>M</Text>
             </TouchableOpacity>
             <TouchableOpacity
             style={{width:50,backgroundColor:'blue',marginLeft:20,borderRadius:5,justifyContent:'center',alignItems:'center'}}
               onPress={() => { this.editartamaño(this.state.uid,'L') }}
               
               >
               <Text style={styles.descrip}>L</Text>
             </TouchableOpacity>
             </View>
            
           </View>
         </View>
       </Modal>
    </View>
  )
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%',
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
