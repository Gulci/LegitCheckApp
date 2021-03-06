import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

import css from '../styles/styles';
import {
  COLOR_WHITE,
  itemSelectGradient,
  barcodeScanGradient,
} from '../styles/colors';

const brainImage = require('../resources/images/brain.png');
const modelImage = require('../resources/images/model.png');
const barcodeImage = require('../resources/images/barcode.png');

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerStyle: css.transparentNav,
    headerLeft: (
      <TouchableOpacity
        onPress={() => navigation.navigate('About')}
      >
        <Icon
          name="info"
          color={COLOR_WHITE}
          size={24}
          style={css.homeNavButtonLeft}
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate(
          'WebBasic',
          {
            title: 'Vision',
            uri: 'https://chdaniel.com/legit-check-app/start/',
          },
        )}
      >
        <Image
          source={brainImage}
          style={css.homeNavButtonRightImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    ),
  })

  componentDidMount() {
    this.props.getItems();
  }

  render() {
    return (
      <View style={css.flex}>
        <LinearGradient
          style={css.mainContainer}
          colors={itemSelectGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
        >
          <TouchableOpacity
            style={css.homeScreenButtonContainer}
            onPress={() => this.props.navigation.navigate(
              'ItemSelect',
              {
                itemData: this.props.guides,
              },
            )}
          >
            <Image
              source={modelImage}
              style={css.homeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          style={css.mainContainer}
          colors={barcodeScanGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
        >
          <TouchableOpacity
            style={css.homeScreenButtonContainer}
            onPress={() => this.props.navigation.navigate('BarcodeScanner')}
          >
            <Image
              source={barcodeImage}
              style={css.homeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
  guides: PropTypes.shape({
    items: PropTypes.shape({
      key: PropTypes.string,
    }),
    varieties: PropTypes.shape({
      key: PropTypes.string,
    }),
    tells: PropTypes.shape({
      key: PropTypes.string,
    }),
  }).isRequired,
  getItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    guides: state.guides,
    requestStatus: state.requestStatuses.GET_GUIDES,
    requestError: state.requestErrors.GET_GUIDES,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getItems: () => {
      dispatch({ type: 'GET_ITEMS' });
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
