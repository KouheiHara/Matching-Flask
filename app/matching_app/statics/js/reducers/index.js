import { combineReducers } from 'redux';
import { getDataError, loadData, data, listData } from './data';

export default combineReducers({
    getDataError,
    loadData,
    data,
    listData,
});