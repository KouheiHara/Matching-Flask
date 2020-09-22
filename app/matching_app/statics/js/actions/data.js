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


export const fetchListData = (url, type = "", content = "json") => {
    let application = 'application/json; charset=UTF-8'
    let responseType = 'json'
    if (content == 'blob') {
        application = 'text/csv; charset=UTF-8'
        responseType = 'blob'
    }
    const headers = {
        'Accept': application,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    return (dispatch) => {
        dispatch(loadData(true));
        fetch(url,
            {
                method: "GET",
                mode: 'cors',
                credentials: 'same-origin',
                headers: headers,
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
                if (type === "listData") {
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
