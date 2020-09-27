import { combineReducers } from 'redux';
import {
    getDataError,
    loadData,
    data,
    authData,
    listData,
    userData,
    keywordCloud,
    userInfo,
    userCsv
} from './data';


export default combineReducers({
    getDataError,
    loadData,
    data,
    authData,
    listData,
    userData,
    keywordCloud,
    userInfo,
    userCsv
});