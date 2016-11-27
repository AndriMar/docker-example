import React, {ProtTypes} from 'react';
import {render} from 'react-dom';
import Container from './container';
import style from './style.css';

render(
  <Container className={style.app} />,
  document.getElementById('app')
);
