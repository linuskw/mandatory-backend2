import React from 'react';
import axios from 'axios';
import '../App.css';

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tempID: 0
    }

    this.moveItem = this.moveItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.openItem = this.openItem.bind(this);
  }

  componentDidMount() {
    this.setState({ tempID: this.props.id + 1 })
  }

  moveItem(bracket) {
    let newID;
    if (bracket === "<") {
      newID = this.props.id - 1;
      axios.put(`http://localhost:3000/${ this.props.id }/${ this.props.item.id }/${ newID }`)
        .then(() => {
          this.props.getBoard();
        })
    } else if (bracket === ">") {
      newID = this.props.id + 1;
      axios.put(`http://localhost:3000/${ this.props.id }/${ this.props.item.id }/${ newID }`)
        .then(() => {
          this.props.getBoard();
        })
    }
  }

  openItem() {
    this.props.openItem(this.props.item)
  }

  deleteItem(){
    console.log(this.props.id);
    console.log(this.props.item.id);
    axios.delete(`http://localhost:3000/delete-item/${ this.props.id }/${ this.props.item.id }`)
      .then(() => {
        this.props.getBoard();
      })
  }

  render() {
    return(
      <>
        <div className="itemDiv">
          <p onClick={ this.openItem }>{ this.props.item.name }</p>
          <div className="itemButtonDiv">
            { this.props.id > 0 ?
              <button
                className="borderlessButton"
                onClick={() => this.moveItem("<") }><i className="material-icons md-24">keyboard_arrow_left</i></button> :
              null
            }
            { this.props.boardLength > this.state.tempID ?
              <button
                className="borderlessButton"
                onClick={() => this.moveItem(">") }><i className="material-icons md-24">keyboard_arrow_right</i></button> :
              null
            }
            <button
              className="borderlessButton"
              onClick={this.deleteItem}>
                <i className="material-icons md-24">delete</i>
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default Item;
