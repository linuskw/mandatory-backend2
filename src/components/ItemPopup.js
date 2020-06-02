import React from 'react';
import axios from 'axios';
import '../App.css';

class ItemPopup extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      item: {},
      itemName: "",
      itemDescription: "",
      nameFormShow: false
    }

    this.change = this.change.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.saveItemChanges = this.saveItemChanges.bind(this);
  }

  componentDidMount() {
    this.setState({
      item: this.props.item,
      itemName: this.props.item.name,
      itemDescription: this.props.item.description
     })
  }

  nameChange(e) {
    e.preventDefault();
    if (this.state.nameFormShow) {
      this.setState({ nameFormShow: false })
    } else {
      this.setState({ nameFormShow: true })
    }
  }


  saveItemChanges() {
    console.log("test");
    axios.patch(`http://localhost:3000/save-item-changes/${this.state.item.list}/${this.state.item.id}`, {
      name: this.state.itemName,
      description: this.state.itemDescription
    })
  }

  change(e) {
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    })
  }

  render(){
    return(
      <>
        <div className="popupBackground">
          <div className="popupWrap">
            { !this.state.nameFormShow
              ? <h2 onClick={ this.nameChange }>{ this.state.itemName }</h2>
              : <form onSubmit={ this.nameChange }>
                  <input type="text" onChange={ this.change } value={ this.state.itemName } name="itemName" />
                  <button className="borderlessButton" type="submit"><i className="material-icons md-24">done</i></button>
                </form>
             }

            <p>Created: {this.state.item.date}</p>

            <textarea onChange={ this.change } value={ this.state.itemDescription } name="itemDescription" form="descriptionForm" placeholder="Description..." />


            <div className="popupButtonWrap">
              <form onSubmit={ this.saveItemChanges } id="descriptionForm">
                <button className="borderlessButton" type="submit"><i className="material-icons md-24">save_alt</i></button>
              </form>
              <button className="borderlessButton" onClick={ this.props.modalClose }><i className="material-icons md-24">close</i></button>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default ItemPopup;
