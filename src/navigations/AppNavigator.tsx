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
} from '../screens';
import AnimationTest from '../screens/AnimationTest';
import NotificationTest from '../screens/NotificationTest';
import UserPlan from '../screens/user/Plan.user';
import UserLikes from '../screens/user/Likes.user';
import AppStateTest from '../screens/AppStateTest';

// import Login from '../screens/auth/Login';
// import FirstScreen from '../screens/First';
const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useAppSelector(state => state.global.isAuthenticated);

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
        ) : (
          <>
            <Stack.Screen name="Home" component={FirstScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ConfirmCode" component={ConfirmCode} />
            <Stack.Screen name="NameInput" component={NameInput} />
            <Stack.Screen name="BirthdayInput" component={BirthdayInput} />
            <Stack.Screen name="LocationInput" component={LocationInput} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
