/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid
} from 'react-native';

const App = props => {
  const [id, setID] = useState('');
  const LeerCodigo = (texto)=>{
    setID(texto)
    props.verificar(texto);
 
}
  return (
    <KeyboardAvoidingView
      // eslint-disable-next-line no-undef
      behavior={ Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.contenedor}>
      <Text style={{color:'black'}} >
            Codigo de Paquete
          </Text>
        <TextInput style={styles.input} onChangeText={LeerCodigo} value={id} autoFocus={true}  editable/>

        <TouchableOpacity
          style={[
            styles.boton,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor: 'red',
              marginHorizontal: 20,
              marginVertical: 20,
            },
          ]}
          
          onPress={()=>props.cerrar()}>
          <Text style={styles.descrip} >
            Cerrar
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contenedor: {
    height: '50%',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  boton: {
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  descrip: {
    fontSize: 15,
    color: '#ebedef',
  },
});

export default App;
