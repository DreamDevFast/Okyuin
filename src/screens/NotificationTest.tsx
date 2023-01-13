import React, {useEffect} from 'react';
import {View} from 'react-native-ui-lib';
import {Button} from 'react-native-paper';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const NotificationTest = () => {
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the backgroud!', remoteMessage);
      Alert.alert('Hi');
    });

    messaging().onMessageSent((messageId: string) => {
      console.log('Message Sent: ', messageId);
    });
    messaging().onSendError((evt: any) => {
      console.log('While sending message error: ', evt);
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
    }
  };

  const sendMessage = () => {
    messaging()
      .sendMessage({
        to:
          'cXPViS7xTLG0lxTB9gdZHj:APA91bGjbzw8eqO0DQVMTRKbhNjSjtCVpvqnzx2nz9MTXMZJKhOuDwbzH6QAq8s4seorgpZqQRG-wSNsuFFuoAe0PPKKZhDMSfBG6lWEUXOkQTvnGZGFzD9ZpFylKEFm4c5IjbWZ3GzM',
        notification: {
          title: 'From Device',
          body: 'Test',
        },
      })
      .then(fullfilled => console.log('Succeeded: ', fullfilled))
      .catch(err => console.log('Error: ', err));
  };
  return (
    <View>
      <Button onPress={checkToken}>Press To Check FCM Token</Button>
      <Button onPress={sendMessage}>Send Message</Button>
    </View>
  );
};

export default NotificationTest;
