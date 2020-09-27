import React from 'react';
import { connect } from 'react-redux'
import '../../css/app.scss';
import UserDetail from './user_detail/user_detail';
import { fetchListData, setListData } from '../actions/data';
import Header from './common/header';
import Footer from './common/footer';
import { isAuthToken, getAuthToken } from './common/service';

var host = location.protocol + "//" + location.host

function getAuthDataUrl() {
    return `${host}/auth`
}


class User extends React.Component {
    constructor(props) {
        super(props);
        this.authToken = this.authToken.bind(this)
    }
    authToken() {
        const flag = isAuthToken()
        if (flag) {
            const token = getAuthToken()
            this.props.setData({
                "username": "anonymous",
                "access_token": token
            })
        } else {
            this.props.fetchData(getAuthDataUrl())
        }
    }
    componentDidMount() {
        this.authToken()
    }
    render() {
        return (
            <div>
                <Header />
                <UserDetail />
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url, {}, "authData")),
    setData: (obj) => dispatch(setListData(obj, "authData"))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(User)
