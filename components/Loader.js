import React from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import {SkypeIndicator} from 'react-native-indicators';
const { width, height } = Dimensions.get('screen');

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={styles.container}>
            <SkypeIndicator  color={'white'} size={150} minScale={0.1} maxScale={0.7} animationDuration={2300}/>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        alignSelf: 'center', 
        alignContent:'center', 
        zIndex: 10, 
        elevation: 10, 
        top: -50,
        height: height, 
        width: width,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
})