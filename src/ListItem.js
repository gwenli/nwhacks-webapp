import React, { Component } from 'react';

class ListItem extends Component {
  render() {
    return (
      <li class="ListItem">
          // let the value be: [id, hr, br, o2, gpsx, gpsy]
          {this.props.value}
      </li>
    );
  }
}

export default ListItem;
