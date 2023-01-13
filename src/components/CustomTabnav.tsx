import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Container from './Container';
import {IconButton} from 'react-native-paper';
import {View} from 'react-native-ui-lib';
import {Colors} from '../styles';
import {useAppDispatch} from '../redux/reduxHooks';
import {setLoading} from '../redux/features/globalSlice';
import CustomIconButton from './CustomIconButton';

const likeIcon = require('../assets/icons/like-main.png');
const dislikeIcon = require('../assets/icons/dislike-main.png');
const favoriteIcon = require('../assets/icons/favorite-main.png');

const {width, height} = Dimensions.get('window');

enum Relation {
  initial,
  like,
  dislike,
  favorite,
}

const CustomTabnav = ({children, navigation, route, ...props}: any) => {
  const dispatch = useAppDispatch();

  const [state, setState] = React.useState<{open: boolean}>({open: false});

  const onStateChange = ({open}: {open: boolean}) => setState({open: !open});

  const {open} = state;

  const {handleFilter} = props;

  const handleDropdownItem = (itemName: Relation) => () => {
    setState({open: false});
    if (handleFilter !== undefined) {
      handleFilter(itemName);
    }
  };

  return (
    <Container flex centerH>
      <View row spread bottom style={styles.toolBar}>
        <View
          style={
            route.name == 'UserDashBoard'
              ? {...styles.iconButton, ...styles.highLight}
              : styles.iconButton
          }
        >
          <IconButton
            icon="user-alt"
            color={route.name == 'UserDashBoard' ? Colors.redBtn : Colors.white}
            size={25}
            onPress={() => navigation.navigate('UserDashBoard')}
          />
        </View>
        {route.name !== 'UserShopSearch' ? (
          <IconButton
            icon="fire"
            color={Colors.white}
            size={25}
            style={styles.iconButton}
            onPress={() => {
              dispatch(setLoading(true));
              navigation.navigate('UserShopSearch');
            }}
          />
        ) : (
          <View>
            <View
              style={
                route.name === 'UserShopSearch'
                  ? {...styles.iconButton, ...styles.highLight}
                  : styles.iconButton
              }
            >
              <IconButton
                icon="fire"
                color={Colors.redBtn}
                size={25}
                onPress={() => onStateChange(state)}
              />
            </View>
            {open ? (
              <View style={styles.dropdown}>
                <View marginT-10 style={styles.dislike}>
                  <CustomIconButton
                    imageSource={dislikeIcon}
                    size={50}
                    onPress={handleDropdownItem(Relation.dislike)}
                  />
                  {/* <IconButton
                    icon="times"
                    color={Colors.white}
                    size={25}
                    onPress={handleDropdownItem(Relation.dislike)}
                  /> */}
                </View>
                <View marginT-10 style={styles.favorite}>
                  {/* <IconButton
                    icon="star"
                    color={Colors.white}
                    size={25}
                    onPress={handleDropdownItem(Relation.favorite)}
                  /> */}
                  <CustomIconButton
                    imageSource={favoriteIcon}
                    size={50}
                    onPress={handleDropdownItem(Relation.favorite)}
                  />
                </View>
                <View marginT-10 style={styles.like}>
                  {/* <IconButton
                    icon="heart"
                    color={Colors.white}
                    size={25}
                    onPress={handleDropdownItem(Relation.like)}
                  /> */}
                  <CustomIconButton
                    imageSource={likeIcon}
                    size={50}
                    onPress={handleDropdownItem(Relation.like)}
                  />
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        )}
        <View
          style={
            route.name == 'UserChat'
              ? {...styles.iconButton, ...styles.highLight}
              : styles.iconButton
          }
        >
          <IconButton
            icon="comment"
            color={route.name == 'UserChat' ? Colors.redBtn : Colors.white}
            size={25}
            onPress={() => {
              dispatch(setLoading(true));
              navigation.navigate('UserChat');
            }}
          />
        </View>
      </View>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  toolBar: {
    width: '80%',
    height: height * 0.12,
  },
  iconButton: {
    zIndex: 1,
  },
  highLight: {
    backgroundColor: Colors.white,
    borderRadius: 30,
  },
  group_style: {
    marginBottom: -55,
    zIndex: 1,
  },
  dislike: {
    backgroundColor: '#20a39e',
    borderRadius: 25,
  },
  like: {
    backgroundColor: '#fe3c72',
    borderRadius: 25,
  },
  favorite: {
    backgroundColor: '#ffba49',
    borderRadius: 25,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    zIndex: 1,
  },
});

export default CustomTabnav;
