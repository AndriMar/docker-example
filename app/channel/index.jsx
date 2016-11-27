import React, {ProtTypes} from 'react';
import style from './style.css';
import axios from 'axios';
import Messageline from './messageline'

let socket;
export default class Channel extends React.Component {

  constructor(props) {
    super(props);
    socket = props.socket
    this.state = {
      username: props.username,
      initData: props.initData,
    };
  }
  addNewMessage(message) {
    let initData = this.state.initData;
    initData.push(message);
    this.setState({initData});
    this.scrollDown();
  }
  newUser(user) {
    let {username,id} = user;
    this.addNewMessage({message:username + ' joined us!',username:'BOT',id})
  }
  userLeft(user) {
    let {username,id} = user;
    this.addNewMessage({message:username + ' left us!',username:'BOT',id})
  }
  scrollDown(){
    let objDiv = document.getElementById("message_window");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
  componentDidMount() {
    socket.emit('user:join',{username:this.state.username})
		socket.on('in:message', this.addNewMessage.bind(this));
		socket.on('user:join', this.newUser.bind(this));
		socket.on('user:left', this.userLeft.bind(this));
    this.scrollDown();
  }

  render() {
    return (
      <div className={style.container}>
        <h3 className={style.title}>Welcome {this.state.username}</h3>
        <div className={style.chat}>
          <div className={style.channelname}>Docker Chat</div>
            <div id="message_window" className={style.messages}>
              {this.state.initData.map(msg =>
                  <Messageline data={msg} key={msg.id}/>
                )}
            </div>
        </div>
      </div>
    );
  }
}
