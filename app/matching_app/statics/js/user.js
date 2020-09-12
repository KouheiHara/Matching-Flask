import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store/configureStore';
import User from './components/user';


const store = configureStore();

class Root extends React.Component {
    render() {
        return (
            <Provider store={ store }>
                <User />
            </Provider>
        );    
    }
};

ReactDOM.render(<Root />, document.getElementById('root'));
