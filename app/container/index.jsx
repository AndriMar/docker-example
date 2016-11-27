import React, {ProtTypes} from 'react';
import style from './style.css';
import axios from 'axios';
import Channel from '../channel';
import Message from '../message';

var socket = io.connect();
export default class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      clientUsername: "",
      channelData: []
    };
  }

  setUser(){
    this.setState({"username":this.state.clientUsername})
  }

  componentDidMount() {
    axios.get("/api/get_messages")
      .then(res => {
        const channelData = res.data;
        this.setState({ channelData });
      });
  }
  handleUsernameChange(event) {
    this.setState({"clientUsername":event.target.value});
  }
  handleKeyDown(e) {
    if (e.key == 'Enter') {
      this.setUser()
    }
  }
  render() {
    if(this.state.username){
      return (
        <div className={style.container}>
          <Channel username={this.state.username} socket={socket} initData={this.state.channelData}/>
          <Message username={this.state.username} socket={socket} />
        </div>
      );
    }
    else {
      let username = this.state.clientUsername;
      return (
        <div className={style.container}>
          <div className={style.login}>
            <div>Tell me your name</div>
            <input type="text" value={username} onKeyPress={this.handleKeyDown.bind(this)} onChange={this.handleUsernameChange.bind(this)}></input>
            <button onClick={this.setUser.bind(this)}>Lets chat!</button>
          </div>
        </div>
      );
    }
  }
}
