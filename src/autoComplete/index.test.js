import React from 'react';
import { shallow, mount } from '../../../../../__mocks__/config';
import {Option, AutoComplete} from './index';


// describe('test AutoComplete dataSource', () => {
//
// })
function wait(time) {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve();
    },time);
  });
}

describe('AutoComplete', () => {
  function testEvent (wrapper, fakeProps) {
    // before
    expect(wrapper.update().exists('.option')).toBe(false);
    // emit
    wrapper.find('input').simulate('focus');
    // wrapper.find('.option').first().simulate('mouseenter');
    wrapper.find('.option').first().simulate('click');
    const value = wrapper.find('.option').first().props().value;
    expect(fakeProps.onSelect).toHaveBeenCalledTimes(1);
    expect(fakeProps.onSelect).toHaveBeenCalledWith(value);
    expect(wrapper.find('input').props().value).toBe(value);
    // after
    wrapper.find('input').simulate('blur');
    return wait(500).then(() => {
      // expect(wrapper.update().exists('.option')).toBe(false);
    });
  }
  describe('children', () => {
    it('input as children', () => {
      const fakeProps = {
        children: <input id="need-replace"/>,
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [<Option value={"a"}>a</Option>, <Option value={"b"}>b</Option>]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      expect(wrapper.exists('#need-replace')).toBe(false);
      return testEvent(wrapper, fakeProps);
    });
  });

  describe('props defaultValue', () => {
    it('defaultValue type string && dataSource have it', () => {
      const fakeProps = {
        defaultValue: 'a',
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [<Option value={"a"}><span>a</span></Option>, <Option value={"b"}>b</Option>]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      return testEvent(wrapper, fakeProps);
    });
    it('defaultValue type string && !dataSource have it', () => {
      const fakeProps = {
        defaultValue: 'c',
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [<Option value={"a"}><span>a</span></Option>, <Option value={"b"}>b</Option>]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      wrapper.find('input').simulate('focus');
      expect(wrapper.update().exists('.option')).toBe(false);
    });
  });


  describe('props filterOption', () => {
    it('filterOption null buy have case', () => {
      const fakeProps = {
        defaultValue: 'A',
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [<Option value={"a"}><span>a</span></Option>, <Option value={"b"}>b</Option>]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      wrapper.find('input').simulate('focus');
      expect(wrapper.update().exists('.option')).toBe(false);
    });
    it('filterOption fix case', () => {
      const fakeProps = {
        filterOption: (inputValue, itemValue) => {console.log('ruan');return itemValue.toUpperCase().match(inputValue.toUpperCase())},
        defaultValue: 'a',
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [<Option value={"bAbbbAbb"}><span>bAbbbAbb</span></Option>, <Option value={"b"}>b</Option>]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      return testEvent(wrapper, fakeProps);
    });
  });

  describe('props of dataSource', () => {
    it('type === component Option', () => {
      // 2
      const fakeProps = {
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [<Option value={"1"}><span>1</span></Option>, <Option value={"2"}>2</Option>]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      return testEvent(wrapper, fakeProps);
    });
    it('type === div', () => {
      // 2
      const fakeProps = {
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [<div value={1}><span>1</span></div>, <div>2</div>]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      return testEvent(wrapper, fakeProps);
    });
    it('type === number', () => {
      // 2
      const fakeProps = {
        onSearch: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        dataSource: [1,2,3]
      };
      const wrapper = mount(<AutoComplete {...fakeProps} />);
      return testEvent(wrapper, fakeProps);
    });
  });
});

describe('Option', () => {
  describe('props of onClick', () => {
    it('=== beenCalled', () => {
      // 2
      const fakeProps = {
        onClick: jest.fn(() => {}),
        onSelect: jest.fn(() => {}),
        children: '选项1'
      };

      const wrapper = shallow(<Option {...fakeProps} />);
      // 3
      wrapper.find('.option').simulate('click');
      // 5
      expect(fakeProps.onClick).toHaveBeenCalledTimes(1);
    });
  });
});

