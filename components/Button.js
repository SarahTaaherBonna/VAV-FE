import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const resizeWidth=(w)=> {
  return value=w*(windowWidth/375);
}

const resizeHeight=(h)=> {
  return value=h*(windowHeight/872);
}

export default function FlatButton({text,onPress}) {
    return (
        <TouchableOpacity onPress={onPress}> 
            <View style={styles.button}>
                <Text style={styles.buttonText}> {text} </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginBottom:resizeHeight(15),
        borderRadius:8,
        paddingVertical:resizeHeight(14),
        paddingHorizontal:resizeWidth(10),
        width:resizeWidth(150),
        height:resizeHeight(52),
        alignSelf:'center',
        backgroundColor: "#F7B600"
    },

    buttonText: {
        color:'white',
        textAlign:'center',
        fontSize:16,
        fontWeight:'bold'
    }
});