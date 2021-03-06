import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';

import ItemSelectItem from './ItemSelectItem';

import css from '../../styles/styles';
import { COLOR_OFF_WHITE } from '../../styles/colors';

class ItemSelect extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: (params.itemId ?
        params.itemName : ('Item Select')
      ),
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;

    if (params.itemId) {
      // If we are displaying item varieties
      this.props.getVarieties(params.itemId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params } = this.props.navigation.state;

    // If we finish loading and we find that
    // there are in fact no varieties,
    // navigate directly to item tells
    if (!nextProps.varietiesStatus &&
      nextProps.varieties[params.itemId] &&
      nextProps.varieties[params.itemId].isEmpty
    ) {
      this.props.navigation.replace(
        'ItemTells',
        {
          item: {
            name: this.props.items[params.itemId].name,
            varietyId: params.itemId,
          },
        },
      );
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.navigation.state.params.itemId) {
      return ((this.props.varieties !== nextProps.varieties ||
      this.props.varietiesStatus !== nextProps.varietiesStatus));
    } else if (!this.props.navigation.state.params.itemId) {
      return ((this.props.items !== nextProps.items ||
      this.props.itemsStatus !== nextProps.itemsStatus));
    }
    return false;
  }

  getMappedItems() {
    const mappedItems = [];
    Object.keys(this.props.items).forEach((itemId) => {
      mappedItems.push({
        ...this.props.items[itemId],
        itemId,
        key: itemId,
      });
    });
    return mappedItems;
  }

  getMappedVarieties() {
    const { itemId } = this.props.navigation.state.params;
    const mappedVarieties = [];
    Object.keys(this.props.varieties[itemId]).forEach((varietyId) => {
      mappedVarieties.push({
        ...this.props.varieties[itemId][varietyId],
        varietyId,
        key: varietyId,
      });
    });
    return mappedVarieties;
  }

  render() {
    const { params } = this.props.navigation.state;
    let listData = [];

    if (!params.itemId) {
      if (!this.props.itemsStatus) {
        // Items have loaded, set data
        listData = this.getMappedItems();
      }
    } else if (!this.props.varietiesStatus &&
      this.props.varieties[params.itemId]) {
      // Varities have loaded, set data

      if (!this.props.varieties[params.itemId].isEmpty) {
        listData = this.getMappedVarieties();
      }
    }

    const varietiesStyle = (params.itemId) ? ({
      backgroundColor: COLOR_OFF_WHITE,
    }) : (null);

    return (
      <View style={
          [
            css.flex,
            css.itemSelectListContainer,
            varietiesStyle,
          ]
        }
      >
        <FlatList
          data={listData}
          renderItem={({ item }) => (
            // If the itemId parameter exists,
            // that means we are using the list
            // to display varieties. Set
            // itemId and varietyId props
            // accordingly.
            //
            <ItemSelectItem
              itemData={item}
              itemId={(params.itemId) ?
                params.itemId : item.itemId
              }
              varietyId={(params.itemId) ?
                item.varietyId : null
              }
              navigation={this.props.navigation}
            />
          )}
        />
      </View>
    );
  }
}

ItemSelect.defaultProps = {
  items: null,
  varieties: null,
  itemsStatus: null,
  varietiesStatus: null,
};

ItemSelect.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.object,
    }),
    replace: PropTypes.func,
  }).isRequired,
  itemsStatus: PropTypes.shape({
    timeRequested: PropTypes.object,
  }),
  items: PropTypes.shape({
    imageUrl: PropTypes.string,
    name: PropTypes.string,
  }),
  varieties: PropTypes.shape({
    varietyId: PropTypes.object,
  }),
  varietiesStatus: PropTypes.shape({
    timeRequested: PropTypes.object,
  }),
  getVarieties: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    items: state.guides.items,
    varieties: state.guides.varieties,
    itemsStatus: state.requestStatuses.GET_ITEMS,
    varietiesStatus: state.requestStatuses.GET_VARIETIES,
    itemsError: state.requestErrors.GET_ITEMS,
    varietiesError: state.requestErrors.GET_VARIETIES,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getVarieties: (itemId) => {
      dispatch({ type: 'GET_VARIETIES', itemId });
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ItemSelect);
