import React, {useState, useEffect} from 'react';
import {Button} from 'react-native-paper';
import {View, Text} from 'react-native-ui-lib';
import {Container, CustomText} from '../components';

export const WithCounter = (Wrapped: any) => {
  return (props: any) => {
    const [count, setCount] = useState(0);
    const increment = () => setCount(count => count + 1);
    return <Wrapped count={count} increment={increment} {...props} />;
  };
};

const ClickCounter = (props: any) => {
  return <Button onPress={props.increment}>Clicked {props.count} times</Button>;
};
const Help = () => {
  const Comp = WithCounter(ClickCounter);
  return (
    <Container>
      <Comp />
    </Container>
  );
};

export default Help;
