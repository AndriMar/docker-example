import React, {ProtTypes} from 'react';
import style from './style.css';
import axios from 'axios';
let socket;
export default class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username,
      message: ""
    };
    socket = props.socket;
  }
  handleKeyDown(e) {
    if (e.key == 'Enter' && !e.nativeEvent.shiftKey) {
      this.sendMessage()
    }
  }
  messageChange(event) {
    this.setState({"message":event.target.value});
  }
  sendMessage() {
    axios.post("/api/send_message",{
      username: this.state.username,
      message: this.state.message
    })
    .then((res) => {
        this.setState({"message":""});
      })
    .catch((err) => {
      console.error('Error sending message:');
      console.error(err);
    });
  }
  render() {
    let message = this.state.message;
    return (
      <div className={style.container}>
        <textarea className={style.textarea} rows="4"  value={message} onKeyUp={this.handleKeyDown.bind(this)} onChange={this.messageChange.bind(this)}>
        </textarea> <button onClick={this.sendMessage.bind(this)}>Send message</button>
      </div>
    );
  }
}
