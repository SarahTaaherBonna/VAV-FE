import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View } from 'react-native';

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
        marginBottom:15,
        borderRadius:8,
        paddingVertical:14,
        paddingHorizontal:10,
        width:150,
        height:50,
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