import React from 'react';
import {shallow} from 'enzyme';
import Messageline from '../app/channel/messageline';
describe('Tests for messageline', () => {
  it('Should take props', () => {
    let data = {id:'1212-1212-1212-1212',username:'Andri',message:'Hello'};
    const msg = shallow(
      <Messageline data={data} />
    );

    expect(msg.find('span').length).toEqual(2);
    expect(msg.childAt(0).text()).toEqual(data.username+":");
    expect(msg.childAt(1).text()).toEqual(data.message);

  });
});
