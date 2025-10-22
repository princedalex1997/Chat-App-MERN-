import { View, Text,Pressable } from 'react-native'
import React from 'react'

const Trial = () => {
  const handleclick = ()=>{
    console.log("Hai");
  }
  return (
    <View>
      <Pressable onPress={handleclick} >
      <Text>
      Click it
      </Text>
      </Pressable>
    </View>
  )
}

export default Trial