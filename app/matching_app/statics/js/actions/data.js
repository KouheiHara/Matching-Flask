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


export const fetchListData = (url, type="") => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    };    
    return (dispatch) => {
        dispatch(loadData(true));
        fetch(url, 
            { 
                method: "GET",
                mode: 'cors', 
                credentials: 'same-origin',
                headers:headers,
            })
            .then((response) => {
                if(!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(loadData(false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                if (type == "listData") {
                    dispatch(fetchListDataSuccess(data))
                } else {
                    dispatch(fetchDataSuccess(data))
                }
            })
            .catch(() => dispatch(getDataError(true)));
    }
}
