import React from 'react';
import axios from 'axios';
import moment from 'moment';
import '../App.css';

import Item from './Item.js';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemList: this.props.itemList,
      newItem: "",
    }

    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.openItem = this.openItem.bind(this);
  }

  deleteList() {
    console.log(this.props.id);
    axios.delete(`http://localhost:3000/delete-list/${ this.props.id }`)
      .then(() => {
        this.props.getBoard();
      })
  }

  change(e) {
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    })
  }

  openItem(item) {
    this.props.openItem(item, this.props.id);
  }

  submit(e) {
    let date = new Date();
    console.log(date);
    e.preventDefault();
    axios.post(`http://localhost:3000/${ this.props.id }/item`, {
      name: this.state.newItem,
      list: this.props.id,
      date: moment().format('MMMM Do YYYY, h:mm:ss a'),
      description: ""
    }).then(() => {
      this.props.getBoard();
    })

    this.setState({ newItem: "" })
  }

  render() {
    return(
      <>
        <div className="listDiv">
          <div className="listHead">
            <p>{ this.props.listName }</p>
            <button
              className="borderlessButton"
              onClick={ this.deleteList }>
                <i className="material-icons md-24">delete</i>
            </button>
          </div>
          <div className="itemWrapDiv">
            { this.state.itemList.map((value, index) => {
              return(
                <Item
                  key={ 'item' + index }
                  id={ this.props.id }
                  item={ value }
                  boardLength={ this.props.boardLength }
                  getBoard={ this.props.getBoard }
                  openItem={ this.openItem } />
              )
            })}
          </div>
          <div className="itemFormDiv">
            <form onSubmit={ this.submit }>
              <input
                className="textField"
                type="text"
                onChange={ this.change }
                value={ this.state.newItem }
                name="newItem"
                placeholder="Add another item" />
              <button
                className="borderlessButton"
                type="submit">
                  <i className="material-icons md-24">add</i>
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }
}

export default List;
