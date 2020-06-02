import React from 'react';
import axios from 'axios';
import '../App.css';

import List from './List.js';
import ItemPopup from './ItemPopup.js';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: [],
      newItem: "",
      newList: "",
      showPopup: false,
      clickedItem: {},
      listCreatePlaceholder: ""
    }

    this.change = this.change.bind(this);
    this.getBoard = this.getBoard.bind(this);
    this.createList = this.createList.bind(this);
    this.openItem = this.openItem.bind(this);
  }

  componentDidMount() {
    this.getBoard();
  }


  getBoard() {
    axios.get('http://localhost:3000/board')
      .then((res) => {
        this.setState({ board: [] });
        this.setState({ board: res.data.lists });
        console.log(this.state.board);
        if (this.state.board.length === 0) {
          this.setState({ listCreatePlaceholder: "Create a list" })
        } else if (this.state.board.length > 0) {
          this.setState({ listCreatePlaceholder: "Create another list" })
        }
      })
  }

  createList(e) {
    e.preventDefault();
    axios.post('http://localhost:3000/new-list', {
      name: this.state.newList
    }).then(() => {
      this.setState({ newList: "" })
      this.getBoard();
    })
  }

  openItem(item) {
    this.setState({
      showPopup: true,
      clickedItem: item
    })
  }

  change(e) {
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    })
  }

  render() {
    return(
      <>
        { this.state.showPopup ?
          <ItemPopup item={ this.state.clickedItem } /> :
          null }
        <div className="mainDiv">
          { this.state.board.map((value, index) => {
            return(
              <List
                key={ 'list' + index }
                id={ index }
                addItem={ this.addItem }
                itemList={ value.items }
                listName={ value.name }
                boardLength={ this.state.board.length }
                getBoard={ this.getBoard }
                openItem={ this.openItem } />
            )
          })}
          <div className="itemFormDiv">
            <form onSubmit={ this.createList }>
              <input
                className="textField"
                type="text"
                onChange={ this.change }
                value={ this.state.newList }
                name="newList"
                placeholder={ this.state.listCreatePlaceholder } />
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

export default Main;
