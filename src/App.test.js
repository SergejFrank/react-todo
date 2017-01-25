import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


// Storage Mock
function storageMock() {
    var storage = {};

    return {
        setItem: function (key, value) {
            storage[key] = value || '';
        },
        getItem: function (key) {
            return key in storage ? storage[key] : null;
        },
        removeItem: function (key) {
            delete storage[key];
        },
        get length() {
            return Object.keys(storage).length;
        },
        key: function (i) {
            var keys = Object.keys(storage);
            return keys[i] || null;
        }
    };
}

it('renders without crashing', () => {
    // mock the localStorage
    window.localStorage = storageMock();
    // mock the sessionStorage
    window.sessionStorage = storageMock();

    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});

