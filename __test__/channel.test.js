import React from 'react';
import {shallow} from 'enzyme';
import Channel from '../app/channel';
describe('Tests for Channel', () => {
  it('Should take props', () => {
    let data = [];
    const channelData = shallow(
      <Channel username="Andri" initData={data} />
    );
    expect(channelData.state().initData).toEqual([]);
  });
  it('Should take username and render', () => {
    const channelusername = shallow(
      <Channel username="Andri" initData={[]} />
    );

    expect(channelusername.find('h3').text()).toEqual('Welcome Andri');

  });
  it('Should render children', () => {
    let initData = [];
    const channelData = shallow(
      <Channel username="" initData={initData} />
    );
    expect(channelData.node.props.children.length).toBe(2);

  });
});
