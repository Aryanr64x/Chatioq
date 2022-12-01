import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, FlatList, Image, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import BASE_URL from "../BASE_URL";
import { authContext } from "../contexts/AuthContextWrapper";
import { Dimensions } from 'react-native';
import MyMessage from "../components/MyMessage";
import OtherMessage from "../components/OtherMessage";

import Ionicons from '@expo/vector-icons/Ionicons';


const ChatScreen = ({ route }) => {
    const auth = useContext(authContext)
    const chatroom = route.params
    const [messages, setMessages] = useState([])
    const text = useRef('')
    const titleText = () => {
        console.log(chatroom)
        let others = [];

        others = chatroom.members.filter((member) => {

            return member.id != auth.user.user_id
        })

        return others[0].username
    }



    useEffect(() => {
        getMessages()
    }, [])


    const getMessages = async () => {
        try {
            const resp = await axios.get(BASE_URL + '/api/chat/message/' + chatroom.id, { headers: { "Authorization": `Bearer ${auth.tokens.access}` } })
            console.log(resp.data)
            setMessages(resp.data)
        } catch (e) {
            console.log(e)
        }
    }

    const sendMessage = async () => {
        try {
            const resp = await axios.post(BASE_URL + '/api/chat/message/create/', {
                text: text.current,
                chatroom: chatroom,

            }, { headers: { "Authorization": `Bearer ${auth.tokens.access}` } })



            setMessages([...messages, resp.data])
        } catch (e) {
            console.log(e)
        }
    }

    const displayAsPerSender = (message) => {
        if (message.user.id == auth.user.user_id) {
            return <MyMessage message={message} />
        }
        return <OtherMessage message={message} />
    }

    return (
        <View>
            <View className="h-24 bg-red-600 flex-row items-center px-6 pt-8">
                <Image className="h-12 w-12 rounded-full mr-4" source={{
                    uri: 'https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-set-image-stock-isolated-object-icon-collection-137161298.jpg'
                }} />
                <Text className="text-2xl text-white">
                    {titleText()}
                </Text>
                <View className="h-full">

                </View>
            </View>
            <View className="h-full justify-between" style={{ height: Dimensions.get('window').height - 1.5 * 96 }}>
                <View className=" ">
                    <FlatList
                        className=""
                        data={messages}
                        renderItem={({ item }) => {

                            return displayAsPerSender(item)
                        }}
                        keyExtractor={item => item.id}
                    />

                </View>
                <View className="flex-row items-center justify-between  ">
                    <TextInput onChangeText={(t) => {
                        text.current = t
                    }} placeholder="Enter you message.." className="px-2 py-2 mx-2 border border-black mt-6 grow" />
                    <TouchableOpacity className="p-3 mt-6 mr-2 rounded-full bg-red-600" onPress={sendMessage}>
                        <Ionicons name='send' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default ChatScreen;