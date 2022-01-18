/* eslint-disable comma-dangle */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, {seState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl,
  ToastAndroid
} from 'react-native';
import {NativeModules} from 'react-native';
import {Searchbar} from 'react-native-paper';
import fire from './firebase';
import Modalimprimir from './modalImprimir';


const {ImprimirEtiqueta} = NativeModules;

//import {app} from './alertas'
export default class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      datas: [],
      hasPermission: null,
      scanned: false,
      users: {},
      red: '',
      total: 0,
      registrados: 0,
      firstQuery: '',
      scantext: '',
      scancolor: 'grey',
      modalimprimir: false,
      printers: [],
      alert: false,
      tamano: false,
      uid: '',
      texto: '',
      cargando: false,

    };
  }

  componentDidMount() {
    this.buscar();
  }

  buscar = () => {
    this.setState({data: []});
    var newdata = [];
    var newdatauser = {};
        //inicia

        fire
          .firestore()
          .collection('pedidos')
          .where('status', '==', 0)
          .where('cliente', '==', this.props.clienteuid)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var dd = {
                cliente_nombre: this.props.cliente,
                ...doc.data(),
              };
              newdata.push(dd);
            });
            this.setState({data: newdata, datas: newdata});
          })
          .catch(error => {
            console.log('Error getting documents: ', error);
          });
      
  };

  info = it => {
    var text = '';
    for (const [key, value] of Object.entries(it)) {
      text = text + key + ': ' + value + '\n';
    }
    this.setState({alert: true, texto: text});
  };

  rechazaralert = (uid, st) => {
    Alert.alert('¿Estás seguro?', 'Confirmar', [
      {
        text: 'Si',
        onPress: () => this.editar(uid, st),
      },

      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };
  searchFilterFunction = text => {
    const newData = this.state.datas.filter(item => {
      const itemData = `${item.cliente_nombre.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({data: newData});
  };

  editartamaño = (uid, tamano) => {
    var edit = fire.firestore().collection('pedidos').doc(uid);

    edit
      .update({
        tamano: tamano,
      })
      .then(() => {
        let newdata = this.state.data;
        var index = newdata.findIndex(obj => obj.uid == uid);

        newdata[index].tamano = tamano;
        this.setState({data: newdata});
      });

    this.setState({tamano: false});
  };

  imprimir = async item => {
    if(item.tamano != undefined){
      const data = JSON.parse(JSON.stringify(item));
      //ImprimirEtiqueta.Imprimir(item);
      this.setState({modalimprimir: true, uid:item.uid});
      ImprimirEtiqueta.Imprimir(data);
    }
    else{
      ToastAndroid.showWithGravity(
        "Tamaño sin definir",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
		

  };

  editar = (uid, status) => {
    var edit = fire.firestore().collection('pedidos').doc(uid);

    edit
      .update({
        status: status,
      })
      .then(() => {
        var newdata = this.state.data;
        var index = newdata.findIndex(obj => obj.uid == uid);

        newdata[index].status = status;
        this.setState({modalimprimir: false,uid:'',data: newdata});
        
        ToastAndroid.showWithGravity(
          "Correcto",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      });
  };

  Refresh() {
    this.setState({cargando: true});
    this.buscar();
    this.setState({cargando: false});
  }
  getBadge = status => {

    switch (status) {
        case 0: return '#ffffff'
        case 1: return '#fcba03'
        case 2: return '#fcba03'
        case 3: return '#049415'
        case 4: return '#049415'
        case 5: return '#940404'
        case 6: return '#940404'
        case 7: return '#940404'
        case 8: return '#fcba03'
        case 9: return '#fcba03'
        default: return '"#ffffff"'
    }
}

verificar = (texto)=>{
  if(texto == this.state.uid ){
    this.editar(this.state.uid,9)
    
    }
    else{
      // eslint-disable-next-line no-undef
      ToastAndroid.showWithGravity(
        "Error: Codigo invalido",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.lista}>
          <View style={styles.logocontainer}>
            <Text style={styles.logotext}>ENTREGA 24</Text>
          </View>
          <Searchbar
            placeholder="Buscar"
            iconColor='transparent'
            onChangeText={query => {
              this.searchFilterFunction(query);
            }}
          />
          <FlatList
            onRefresh={() => this.Refresh()}
            refreshing={this.state.cargando}
            data={this.state.data}
            renderItem={({item}) => (
              <View
                style={[
                  styles.item,
                  {backgroundColor: this.getBadge(item.status)},
                ]}>
                <TouchableOpacity
                  style={styles.arriba}
                  onPress={() => this.info(item)}>
                  <View style={styles.titulo}>
                    <Text
                      style={[styles.title, {position: 'relative', left: 10}]}>
                      {item.cliente_nombre}
                    </Text>
                    <Text
                      style={[styles.title, {position: 'absolute', right: 10,width:90,textAlign:'right', color:'#0a2b4c'}]}>
                      {item.tamano == undefined ?"tamaño sin definir" :item.tamano }
                    </Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.descripcion}>
                      {item['NOMBRE PROD']}
                    </Text>
                    <Text style={styles.descripcion} cion>
                      Cantidad: {item['CANTIDAD']}, Contacto:{' '}
                      {item['NOMBRE CONTACTO']}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.abajo}>
                  {item.status == 6 ? (
                    <TouchableOpacity
                      style={[styles.boton, {backgroundColor: 'red'}]}
                      onPress={() => this.rechazaralert(item.uid, 0)}>
                      <Text style={styles.descrip}>Deshacer</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.boton, {backgroundColor: 'red'}]}
                      onPress={() => this.rechazaralert(item.uid, 6)}>
                      <Text style={styles.descrip}>Rechazar</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.boton,
                      {backgroundColor: '#04101e', marginHorizontal: 20},
                    ]}
                    onPress={() =>
                      this.setState({tamano: true, uid: item.uid})
                    }>
                    <Text style={styles.descrip}>Cambiar tamaño</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.boton, {backgroundColor: 'green'}]}
                    onPress={() => this.imprimir(item)}>
                    <Text style={styles.descrip}>Imprimir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={item => item.uid}
          />
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.modalimprimir}
          onRequestClose={() => {
            this.setState({modalimprimir: false});
          }}>
          <Modalimprimir verificar={this.verificar} cerrar ={()=>this.setState({modalimprimir: false,uid:''})}/>
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
                onPress={() => {
                  this.setState({alert: false});
                }}
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
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button
                  onPress={() => {
                    this.setState({tamano: false});
                  }}
                  title="Cancelar"
                />
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: 'blue',
                    marginLeft: 20,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.editartamaño(this.state.uid, 'SM');
                  }}>
                  <Text style={styles.descrip}>SM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: 'blue',
                    marginLeft: 20,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.editartamaño(this.state.uid, 'M');
                  }}>
                  <Text style={styles.descrip}>M</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: 'blue',
                    marginLeft: 20,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.editartamaño(this.state.uid, 'L');
                  }}>
                  <Text style={styles.descrip}>L</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: 'blue',
                    marginLeft: 20,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.editartamaño(this.state.uid, 'XL');
                  }}>
                  <Text style={styles.descrip}>XL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#0a2b4c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lista: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ebedef',
    marginTop: 10,
  },
  camara: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    marginTop: -90,
  },
  mensaje: {
    position: 'absolute',
    top: 50,
    height: '5%',
    width: '40%',
    opacity: 0.5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
  },
  item: {
    marginVertical: 7,
    marginHorizontal: 10,
    height: 150,
    borderRadius: 3,
    elevation: 20,
    shadowColor: '#52006A',
  },
  title: {
    fontSize: 18,
  },
  descrip: {
    fontSize: 14,
    color: '#ebedef',
    marginHorizontal: 5,
  },
  arriba: {
    height: '65%',
  },
  abajo: {
    flexDirection: 'row',
    height: '35%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a2b4c',
    borderRadius: 3,
  },
  titulo: {
    flexDirection: 'row',
    fontSize: 14,
    height: '50%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginHorizontal: 10,
  },
  info: {
    height: '50%',
    alignItems: 'center',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 14,
    color: 'black',
  },
  boton: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  logotext: {
    fontSize: 18,
    fontFamily: 'Roboto',
    color: 'white',
    fontWeight: 'bold',
  },
  logocontainer: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a2b4c',
  },
});
