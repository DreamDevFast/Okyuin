import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {useAppSelector} from '../redux/reduxHooks';

import {
  ConfirmCode,
  FirstScreen,
  Login,
  Register,
  NameInput,
  BirthdayInput,
  LocationInput,
  UserDashBoard,
  UserSetting,
  UserShopSearch,
  UserProfile,
  UserShopDetail,
  UserChat,
  UserChatRoom,
  PhoneVerification,
  Help,
  Agreement,
  UserPhoto,
  Guide1,
  Guide2,
  Guide3,
  Guide4,
  Guide5,
} from '../screens';
import AnimationTest from '../screens/AnimationTest';
import NotificationTest from '../screens/NotificationTest';
import UserPlan from '../screens/user/Plan.user';
import UserLikes from '../screens/user/Likes.user';
import AppStateTest from '../screens/AppStateTest';
import SearchLocation from '../screens/auth/SearchLocation';

// import Login from '../screens/auth/Login';
// import FirstScreen from '../screens/First';
const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useAppSelector(state => state.global.isAuthenticated);
  const isFirstLogin = useAppSelector(state => state.global.isFirstLogin);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: 'card',
        }}
      >
        {/* <Stack.Screen
          name="PhoneVerificationSample"
          component={PhoneVerification}
        /> */}
        {/* <Stack.Screen name="AnimationTest" component={AnimationTest} /> */}
        {/* <Stack.Screen name="NotificationTest" component={NotificationTest} /> */}
        {/* <Stack.Screen name="AppStateTest" component={AppStateTest} /> */}
        {isAuthenticated ? (
          isFirstLogin ? (
            <>
              <Stack.Screen name="UserAgreement" component={Agreement} />
              <Stack.Screen name="UserPhoto" component={UserPhoto} />
              <Stack.Screen name="UserGuide1" component={Guide1} />
              <Stack.Screen name="UserGuide2" component={Guide2} />
              <Stack.Screen name="UserGuide3" component={Guide3} />
              <Stack.Screen name="UserGuide4" component={Guide4} />
              <Stack.Screen name="UserGuide5" component={Guide5} />

              <Stack.Screen name="UserShopSearch" component={UserShopSearch} />
              <Stack.Screen name="UserDashBoard" component={UserDashBoard} />
              <Stack.Screen name="UserSetting" component={UserSetting} />
              <Stack.Screen name="UserProfile" component={UserProfile} />
              <Stack.Screen name="UserPlan" component={UserPlan} />

              <Stack.Screen name="UserShopDetail" component={UserShopDetail} />
              <Stack.Screen name="UserLikes" component={UserLikes} />

              <Stack.Screen name="UserChat" component={UserChat} />
              <Stack.Screen name="UserChatRoom" component={UserChatRoom} />
              <Stack.Screen name="Help" component={Help} />
            </>
          ) : (
            <>
              <Stack.Screen name="UserShopSearch" component={UserShopSearch} />
              <Stack.Screen name="UserDashBoard" component={UserDashBoard} />
              <Stack.Screen name="UserSetting" component={UserSetting} />
              <Stack.Screen name="UserProfile" component={UserProfile} />
              <Stack.Screen name="UserPlan" component={UserPlan} />

              <Stack.Screen name="UserShopDetail" component={UserShopDetail} />
              <Stack.Screen name="UserLikes" component={UserLikes} />

              <Stack.Screen name="UserChat" component={UserChat} />
              <Stack.Screen name="UserChatRoom" component={UserChatRoom} />
              <Stack.Screen name="Help" component={Help} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Home" component={FirstScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
            <Stack.Screen name="NameInput" component={NameInput} />
            <Stack.Screen name="BirthdayInput" component={BirthdayInput} />
            <Stack.Screen name="LocationInput" component={LocationInput} />
            <Stack.Screen name="SearchLocation" component={SearchLocation} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
