export const getDataError = (state = false, action) => {
    switch (action.type) {
        case 'GET_DATA_ERROR':
            return action.hasError;
        default:
            return state;
    }
}

export const loadData = (state = false, action) => {
    switch (action.type) {
        case 'LOAD_DATA':
            return action.isLoading;
        default:
            return state;
    }
}

export const data = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_DATA_SUCCESS':
            return action.data;
        default:
            return state;
    }
}

export const listData = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_LIST_DATA_SUCCESS':
            return action.listData;
        default:
            return state;
    }
}

export const userData = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_USER_DATA_SUCCESS':
            return action.userData;
        default:
            return state;
    }
}

export const keywordCloud = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_KEYWORD_CLOUD_SUCCESS':
            return action.keywordCloud;
        default:
            return state;
    }
}

export const userInfo = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_USER_INFO_SUCCESS':
            return action.userInfo;
        default:
            return state;
    }
}

export const userCsv = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_USER_CSV_SUCCESS':
            return action.userCsv;
        default:
            return state;
    }
}