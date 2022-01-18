/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
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
import {Searchbar} from 'react-native-paper';
import fire from './firebase';
import Modalimprimir from './modalImprimir';


//import {app} from './alertas'
export default class Companias extends React.Component {
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
    fire
      .firestore()
      .collection('usuarios')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.data();
        });
        this.setState({data: newdata, datas: newdata});
      })
  };

  info = it => {
    var text = '';
    for (const [key, value] of Object.entries(it)) {
      text = text + key + ': ' + value + '\n';
    }
    this.setState({alert: true, texto: text});
  };


  Refresh() {
    this.setState({cargando: true});
    this.buscar();
    this.setState({cargando: false});
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
                   
                  </View>
                 
                </TouchableOpacity>
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
