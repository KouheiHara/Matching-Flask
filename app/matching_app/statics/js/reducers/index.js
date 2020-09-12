import { combineReducers } from 'redux';
import { 
    getDataError,
    loadData,
    data,
    listData,
    userData,
    keywordCloud,
    userInfo
} from './data';

export default combineReducers({
    getDataError,
    loadData,
    data,
    listData,
    userData,
    keywordCloud,
    userInfo
});