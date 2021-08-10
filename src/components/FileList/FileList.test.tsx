import React from 'react';
import FileList from './FileList';
import { shallow, mount, render } from 'enzyme';

import File from '../../types/File'
const files1: File[] = [];
const files2: File[] = [
  {name: '1.exe', device: 'phone', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\1.exe', status: 'scheduled'},
  {name: '3.gif', device: 'pc', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\3.gif', status: 'available'},
  {name: '5.png', device: 'mac', path: '\\Users\\5.png', status: 'available'},
  {name: '#$00)wrel.test.app', device: 'mac', path: '\\Users\\#$00)wrel.test.app', status: 'scheduled'},
]

describe("FileList", () => {
    test('Renders the correct number of rows.', () => {
        const wrapper = shallow(<FileList files={files1} />);
        const rows = wrapper.find('tbody tr');
        expect(rows.length).toEqual(files1.length);
    });
    test('Renders the correct number of rows.', () => {
        const wrapper = shallow(<FileList files={files2} />);
        const rows = wrapper.find('tbody tr');
        expect(rows.length).toEqual(files2.length);
    });
    test('Choosing to select all selects every available file', ()=> {
        const wrapper = shallow(<FileList files={files2} />);
        const selectAll = wrapper.find('.controls').find('input[type="checkbox"]').simulate("change", { target: { checked: true } });
        const selectedRows = wrapper.find('tbody tr.selected');
        expect(selectedRows.length).toEqual(files2.filter(element => element.status === "available").length);
    })
    test('Clicking download button triggers an alert', ()=> {
        const wrapper = shallow(<FileList files={files2} />);
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        const button = wrapper.find('.controls button');
        button.simulate("click");
        expect(window.alert).toHaveBeenCalled();
    })
})
