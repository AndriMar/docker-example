import React, {ProtTypes} from 'react';
import style from './style.css';
import axios from 'axios';


export default class Messageline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }
  render() {
    return (
      <div className={style.line} >
        <span className={style.linename}>{this.state.data.username + ':'}</span>
        <span className={style.linemessage}>{this.state.data.message}</span>
      </div>
    );
  }
}
