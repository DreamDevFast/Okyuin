import React, {useRef, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  PanResponder,
  Text,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');
var index = 0;

const AnimationTest = () => {
  console.log(height);
  const pan = useRef(new Animated.ValueXY()).current;
  const [direction, setDirection] = useState<number>(1);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [displayArray, setDisplayArray] = useState<Array<any>>([
    'blue',
    'red',
    'yellow',
  ]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.y0 > height * 0.5) {
          setDirection(-1);
        } else {
          setDirection(1);
        }
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        Animated.spring(pan, {
          toValue: {
            x: (500 * gestureState.dx) / Math.abs(gestureState.dx),
            y: 0,
          },
          useNativeDriver: false,
        }).start(({finished}) => {
          if (finished) {
          }
        });

        console.log('release: ', activeIndex);
        index++;
        Animated.timing(pan, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: false,
          duration: 0,
        }).start();
        setActiveIndex(index);
      },
    }),
  ).current;

  console.log(activeIndex);
  return (
    <View style={styles.container}>
      {displayArray
        .slice(activeIndex, activeIndex + 2)
        .reverse()
        .map((label, key) => {
          if (key === 1) {
            return (
              <Animated.View
                key={key}
                style={{
                  ...styles.animated_view,
                  transform: [
                    {
                      scaleX: 1.1,
                    },
                    {
                      scaleY: 1.1,
                    },
                    {
                      translateX: pan.x,
                    },
                    {
                      translateY: pan.y,
                    },
                    {
                      rotateZ: pan.x.interpolate({
                        inputRange: [-200, 0, 200],
                        outputRange:
                          direction === 1
                            ? ['-45deg', '0deg', '45deg']
                            : ['45deg', '0deg', '-45deg'],
                      }),
                    },
                  ],
                }}
                {...panResponder.panHandlers}
              >
                <View style={{...styles.box, backgroundColor: label}}>
                  <Animated.View
                    style={{
                      opacity: pan.x.interpolate({
                        inputRange: [-200, 0, 200],
                        outputRange: [3, 0, 3],
                      }),
                    }}
                  >
                    <Text style={styles.nope}>Nope {label}</Text>
                  </Animated.View>
                </View>
              </Animated.View>
            );
          } else if (key === 0) {
            return (
              <Animated.View
                key={key}
                style={{
                  ...styles.animated_view,
                  transform: [
                    {
                      scaleX: pan.x.interpolate({
                        inputRange: [-500, -200, 0, 200, 500],
                        outputRange: [1.1, 1.1, 1, 1.1, 1.1],
                      }),
                    },
                    {
                      scaleY: pan.x.interpolate({
                        inputRange: [-500, -200, 0, 200, 500],
                        outputRange: [1.1, 1.1, 1, 1.1, 1.1],
                      }),
                    },
                  ],
                }}
                {...panResponder.panHandlers}
              >
                <View style={{...styles.box, backgroundColor: label}}>
                  <Animated.View
                    style={{
                      opacity: pan.x.interpolate({
                        inputRange: [-200, 0, 200],
                        outputRange: [3, 0, 3],
                      }),
                    }}
                  ></Animated.View>
                </View>
              </Animated.View>
            );
          }
        })}
      {/* <Animated.View
        style={{
          ...styles.animated_view,
          transform:
            activeIndex === 1
              ? [
                  {
                    scaleX: 1.1,
                  },
                  {
                    scaleY: 1.1,
                  },
                  {
                    translateX: pan.x,
                  },
                  {
                    translateY: pan.y,
                  },
                  {
                    rotateZ: pan.x.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange:
                        direction === 1
                          ? ['-45deg', '0deg', '45deg']
                          : ['45deg', '0deg', '-45deg'],
                    }),
                  },
                ]
              : [
                  {
                    scaleX: pan.x.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange: [1.1, 1, 1.1],
                    }),
                  },
                  {
                    scaleY: pan.x.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange: [1.1, 1, 1.1],
                    }),
                  },
                ],
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.alt_box}>
          <Animated.View
            style={{
              opacity: pan.x.interpolate({
                inputRange: [-200, 0, 200],
                outputRange: [3, 0, 3],
              }),
            }}
          >
            <Text style={styles.nope}>Nope</Text>
          </Animated.View>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          ...styles.animated_view,
          transform:
            activeIndex === 0
              ? [
                  {
                    scaleX: 1.1,
                  },
                  {
                    scaleY: 1.1,
                  },
                  {
                    translateX: pan.x,
                  },
                  {
                    translateY: pan.y,
                  },
                  {
                    rotateZ: pan.x.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange:
                        direction === 1
                          ? ['-45deg', '0deg', '45deg']
                          : ['45deg', '0deg', '-45deg'],
                    }),
                  },
                ]
              : [
                  {
                    scaleX: pan.x.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange: [1.1, 0, 1.1],
                    }),
                  },
                  {
                    scaleY: pan.x.interpolate({
                      inputRange: [-200, 0, 200],
                      outputRange: [1.1, 0, 1.1],
                    }),
                  },
                ],
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.box}>
          <Animated.View
            style={{
              opacity: pan.x.interpolate({
                inputRange: [-200, 0, 200],
                outputRange: [3, 0, 3],
              }),
            }}
          >
            <Text style={styles.nope}>Nope</Text>
          </Animated.View>
        </View>
      </Animated.View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  animated_view: {
    position: 'absolute',
  },
  box: {
    height: 250,
    width: 150,
    borderRadius: 5,
  },
  alt_box: {
    height: 250,
    width: 150,
    borderRadius: 5,
  },
  nope: {
    color: 'white',
    size: 10,
  },
});

export default AnimationTest;
