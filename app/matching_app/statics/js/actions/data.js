import { isAuthToken, getAuthToken, setAuthToken } from '../components/common/service';

export const getDataError = status => ({
    type: 'GET_DATA_ERROR',
    hasError: status
});

export const loadData = status => ({
    type: 'LOAD_DATA',
    isLoading: status
});

export const fetchDataSuccess = data => ({
    type: 'FETCH_DATA_SUCCESS',
    data
});

export const fetchAuthDataSuccess = authData => ({
    type: 'FETCH_AUTH_DATA_SUCCESS',
    authData
});

export const fetchListDataSuccess = listData => ({
    type: 'FETCH_LIST_DATA_SUCCESS',
    listData
});

export const fetchUserDataSuccess = userData => ({
    type: 'FETCH_USER_DATA_SUCCESS',
    userData
});

export const fetchKeywordCloudSuccess = keywordCloud => ({
    type: 'FETCH_KEYWORD_CLOUD_SUCCESS',
    keywordCloud
});

export const fetchUserInfoSuccess = userInfo => ({
    type: 'FETCH_USER_INFO_SUCCESS',
    userInfo
});

export const fetchUserCsvSuccess = userCsv => ({
    type: 'FETCH_USER_CSV_SUCCESS',
    userCsv
});

function createFormData(data) {
    let form = "";
    Object
        .keys(data)
        .forEach(key => (form += `&${key}=${data[key]}`));
    if (form.length > 0) {
        form = form.slice(1)
    }
    return form;
}


export const setListData = (obj, type) => {
    return (dispatch) => {
        if (type === "authData") {
            dispatch(fetchAuthDataSuccess(obj))
        }
    }
}


export const fetchListData = (url, obj, type = "", content = "json") => {
    let accept = 'application/json; charset=UTF-8'
    let responseType = 'json'
    if (content == 'blob') {
        accept = 'text/csv; charset=UTF-8'
        responseType = 'blob'
    }

    const headers = {
        'Accept': accept,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    if (type !== "authData") {
        const token = getAuthToken()
        headers["Authorization"] = `Bearer ${token}`
        obj["token"] = token
        obj["username"] = "anonymous"
    } else {
        obj["username"] = "anonymous"
        obj["password"] = "password"
    }

    const body = createFormData(obj)
    return (dispatch) => {
        dispatch(loadData(true));
        fetch(url,
            {
                method: "POST",
                headers: headers,
                body: body,
                mode: 'cors',
                credentials: 'same-origin',
                responseType: responseType
            })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(loadData(false));
                return response;
            })
            .then((response) => {
                if (content == "blob") {
                    return response.blob()
                } else {
                    return response.json()
                }
            })
            .then((data) => {
                if (type === "authData") {
                    dispatch(fetchAuthDataSuccess(data))
                    setAuthToken(data.access_token)
                } else if (type === "listData") {
                    dispatch(fetchListDataSuccess(data))
                } else if (type === "userData") {
                    dispatch(fetchUserDataSuccess(data))
                } else if (type === "keywordCloud") {
                    dispatch(fetchKeywordCloudSuccess(data))
                } else if (type === "userInfo") {
                    dispatch(fetchUserInfoSuccess(data))
                } else if (type === "userCsv") {
                    dispatch(fetchUserCsvSuccess(data))
                } else {
                    dispatch(fetchDataSuccess(data))
                }
            })
            .catch(() => dispatch(getDataError(true)));
    }
}
