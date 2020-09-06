import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import configureStore from './store/configureStore';
import Top from './components/top';


const store = configureStore();

class Root extends React.Component {
    render() {
        return (
            <Provider store={ store }>
                <Top />
            </Provider>
        );    
    }
};

ReactDOM.render(<Root />, document.getElementById('root'));
