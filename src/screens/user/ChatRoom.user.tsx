import React, {useState, useCallback, useEffect} from 'react';
import {Appbar, TextInput} from 'react-native-paper';
import {StyleSheet, Dimensions, Platform, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {View, Spacings, Avatar, Text} from 'react-native-ui-lib';
// import InfiniteScroll from 'react-native-infinite-scroll';
// import moment from 'moment';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  GiftedChat,
  IMessage,
  SendProps,
  Send,
  InputToolbar,
  InputToolbarProps,
  ActionsProps,
} from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser, setLoading} from '../../redux/features/globalSlice';

import {Container} from '../../components';
import {Colors} from '../../styles';
import CustomActions from '../../components/CustomActions';

const {width, height} = Dimensions.get('window');

var _isMounted = false;
var numberOfMessages = 0;

export default function UserChatRoom({route, navigation}: any) {
  const dispatch = useAppDispatch();
  const tempUser = useAppSelector((state: any) => state.global.tempUser);

  const [messages, setMessages] = useState<any>([]);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState<boolean>(false);
  const [loadEarlier, setEarlier] = useState<boolean>(true);

  const {id, name, avatar, sendable} = route.params;
  const chatmessages = firestore().collection('ChatMessages');

  useFocusEffect(
    useCallback(() => {
      console.log(_isMounted);

      const subscriber = chatmessages.onSnapshot(querySnapshot => {
        console.log('snapshot', _isMounted);
        if (querySnapshot && _isMounted) {
          console.log('snapshot entered');
          const docs = querySnapshot.docs.filter(
            doc =>
              (doc.data().sender === tempUser.id &&
                doc.data().receiver === id) ||
              (doc.data().sender === id && doc.data().receiver === tempUser.id),
          );
          docs.sort((a, b) => b.data().createdAt - a.data().createdAt);
          console.log('snapshot docs: ', docs[0]);

          if (docs.length) {
            const msgs = [
              {
                _id: docs[0].id,
                text: docs[0].data().text,
                createdAt: docs[0].data().createdAt.toDate(),
                user: {
                  _id: docs[0].data().sender,
                  name: docs[0].data().sender === id ? name : tempUser.name,
                  avatar:
                    docs[0].data().sender === id ? avatar : tempUser.avatar,
                },
              },
            ];
            setMessages((previousMessages: Array<any>) => {
              return GiftedChat.append(previousMessages, msgs);
            });
            numberOfMessages++;
          }
        }
      });

      chatmessages
        .where('sender', 'in', [id, tempUser.id])
        .get()
        .then(querySnapshot => {
          if (querySnapshot) {
            let docs = querySnapshot.docs.filter(
              doc =>
                doc.data().receiver === id ||
                doc.data().receiver === tempUser.id,
            );
            docs = docs
              .sort((a, b) => b.data().createdAt - a.data().createdAt)
              .slice(0, 20);

            numberOfMessages = docs.length;

            if (numberOfMessages) {
              const msgs = docs.map(doc => ({
                _id: doc.id,
                text: doc.data().text,
                createdAt: doc.data().createdAt.toDate(),
                user: {
                  _id: doc.data().sender,
                  name: doc.data().sender === id ? name : tempUser.name,
                  avatar: doc.data().sender === id ? avatar : tempUser.avatar,
                },
              }));
              setMessages((previousMessages: Array<any>) => {
                return GiftedChat.append(previousMessages, msgs);
              });
            }
          }
        });

      return () => {
        subscriber();
        _isMounted = false;
        numberOfMessages = 0;
      };
    }, []),
  );

  const renderSend = (props: SendProps<IMessage>) => (
    <Send {...props} label={'dddd'} containerStyle={styles.send}>
      <EvilIcons size={30} color={Colors.iconLabel} name={'sc-telegram'} />
    </Send>
  );
  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputtoolbar_container}
        primaryStyle={styles.inputtoolbar_primary}
        renderActions={(props: ActionsProps) => {
          return <CustomActions {...props} />;
        }}
      />
    );
  };

  const onSend = useCallback((messages: Array<any> = []) => {
    if (sendable) {
      chatmessages.add({
        sender: tempUser.id,
        text: messages[0].text,
        createdAt: new Date(),
        receiver: id,
      });
    } else {
      Alert.alert(`Can't send message to the user ${name}`);
    }
  }, []);

  const onLoadEarlier = () => {
    console.log('load earlier', _isMounted);
    if (!_isMounted) {
      _isMounted = true;
      return;
    }
    setIsLoadingEarlier(true);

    if (_isMounted === true) {
      chatmessages
        .where('sender', 'in', [id, tempUser.id])
        .get()
        .then(querySnapshot => {
          if (querySnapshot) {
            let docs = querySnapshot.docs.filter(
              doc =>
                doc.data().receiver === id ||
                doc.data().receiver === tempUser.id,
            );
            docs = docs
              .sort((a, b) => b.data().createdAt - a.data().createdAt)
              .slice(numberOfMessages, numberOfMessages + 20);

            const newLen = docs.length;
            if (newLen) {
              setMessages((previousMessages: Array<any>) => {
                const msgs = GiftedChat.prepend(
                  previousMessages,
                  docs.map(doc => ({
                    _id: doc.id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: {
                      _id: doc.data().sender,
                      name: doc.data().sender === id ? name : tempUser.name,
                      avatar:
                        doc.data().sender === id ? avatar : tempUser.avatar,
                    },
                  })) as IMessage[],
                );
                return msgs;
              });
              numberOfMessages += newLen;
            }
            setIsLoadingEarlier(false);
          }
        });
    }
  };

  return (
    <Container>
      <Appbar.Header
        style={{backgroundColor: 'transparent'}}
        statusBarHeight={20}
      >
        <Appbar.Action
          icon={'chevron-left'}
          onPress={() => {
            dispatch(setLoading(true));
            navigation.navigate('UserChat');
          }}
          color={Colors.white}
        />
        <Appbar.Content
          title={
            <View row centerV>
              <View>
                <Avatar
                  size={40}
                  source={{
                    uri: avatar,
                  }}
                  label={'IMG'}
                  imageStyle={styles.avatar}
                />
              </View>
              <View>
                <Text
                  color={Colors.white}
                  style={{marginLeft: 10, fontSize: 20}}
                >
                  {name}
                </Text>
              </View>
            </View>
          }
          color={Colors.white}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <GiftedChat
          alwaysShowSend={true}
          messages={messages}
          loadEarlier={loadEarlier}
          isLoadingEarlier={isLoadingEarlier}
          renderSend={renderSend}
          onSend={messages => onSend(messages)}
          onLoadEarlier={onLoadEarlier}
          renderInputToolbar={renderInputToolbar}
          user={{
            _id: tempUser.id,
          }}
          infiniteScroll
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  send: {
    justifyContent: 'center',
  },
  sendbox: {
    borderRadius: 20,
    borderColor: '#ff0000',
  },
  inputtoolbar_container: {
    // borderColor: '#ff0000',
    borderTopColor: 'transparent',
    backgroundColor: Colors.white,
    alignItems: 'center',
    // borderWidth: 1,
    paddingVertical: 5,
    // width: width * 0.8,
    // borderRadius: 10,
  },
  inputtoolbar_primary: {
    borderColor: Colors.iconLabel,
    backgroundColor: Colors.white,
    borderWidth: 1,
    width: width * 0.8,
    borderRadius: 10,
  },
  avatar: {
    borderColor: Colors.white,
    borderWidth: 2,
  },
});
