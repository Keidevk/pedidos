import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getItem, handlerMain } from "../utils";

type Message = {
  text: string;
  from: 'user' | 'bot';
};


export default function Chat(){
    const insets = useSafeAreaInsets()
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [userId,setUserId] = useState('')

    useEffect(()=>{
        getItem('@userId',setUserId)  
    },[])
  const handleSend = async () => {
    const userMessage:Message = { text: input, from: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    try {
        
        const response = await fetch(`${process.env.EXPO_PUBLIC_HOST}/api/message/`,{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({remitenteId:userId,message:userMessage.text})
            })
            const message = await response.json()
            console.log(message)
            const botMessage = await message.data || 'Sin respuesta';
            // const botMessage = message.message || 'Sin respuesta'
            // console.log(message.payload)
            // const botMessage = "Hola amigo🥳🔥"
            setMessages(prev => [...prev, { text: botMessage, from: 'bot' }]) 
    } catch (err) {
      setMessages(prev => [...prev, { text: 'Error al conectar con el bot', from: 'bot' }]);
    }

  };


    return(
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 20 : 0}
        >
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <TouchableOpacity
                  onPress={handlerMain}
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                >
                  <Image
                    style={{ height: 32, width: 32, marginLeft: 5 }}
                    contentFit="cover"
                    source={require('../../assets/images/arrowback.svg')}
                  />
                  <Text style={{ fontFamily: 'Inter_600SemiBold' }}>Chat Bot</Text>
                </TouchableOpacity>
                <FlatList
                  data={messages}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item }) => (
                    <View style={item.from === 'user' ? styles.userContainer : styles.botContainer}>
                    <Text style={item.from === 'user' ? styles.user : styles.bot}>
                      {item.text}
                    </Text>
                    </View>
                  )}
                />
            <View style={styles.sender}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Escribe tu mensaje..."
              />
              <TouchableOpacity
                onPress={handleSend}
                style={{ backgroundColor: 'white', borderRadius: 100, padding: 10 }}
              >
                <Image
                  style={{ height: 30, width: 30 }}
                  source={require('../../assets/images/send.svg')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

    )
}
const styles = StyleSheet.create({
    sender:{
        flexDirection:'row',
        backgroundColor:'#E94B64',
        justifyContent:'space-between',
        paddingVertical:10,
    },
    input:{
        flex:1,
        backgroundColor:'white',
        borderRadius:30,
        marginHorizontal:10,
        paddingHorizontal:10,
    },
    user:{
        backgroundColor:'#E94B64',
        color:'white',
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10,
        marginRight:10,
        maxWidth:"80%"
    },
    userContainer:{
        alignSelf:'flex-end',
        marginBottom:10
    },
    bot:{
        backgroundColor:'#d1d5daff',
        color:'black',
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10,
        marginLeft:10,
        maxWidth:"80%"
    },
    botContainer:{
        alignSelf:'flex-start',
        marginBottom:10



    }
})