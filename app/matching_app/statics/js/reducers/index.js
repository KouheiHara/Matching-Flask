import { combineReducers } from 'redux';
import {
    getDataError,
    loadData,
    data,
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
    listData,
    userData,
    keywordCloud,
    userInfo,
    userCsv
});