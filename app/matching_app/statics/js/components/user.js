import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import '../../css/app.scss';
import UserDetail from './user_detail/user_detail';
import { fetchListData, setListData } from '../actions/data';
import Header from './common/header';
import Footer from './common/footer';
import MenuSider from './common/sider';
import { isAuthToken, getAuthToken } from './common/service';
import { MD_SIZE } from './common/config';


var host = location.protocol + "//" + location.host

function getAuthDataUrl() {
    return `${host}/auth`
}

const { Content } = Layout;


class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            access_token: ""
        }
        this.authToken = this.authToken.bind(this)
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth })
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
        window.addEventListener('resize', this.updateDimensions)
    }
    render() {
        if (this.state.width <= MD_SIZE) {
            return (
                <Layout>
                    <MenuSider />
                    <Content>
                        <Header />
                        <UserDetail />
                        <Footer />
                    </Content>
                </Layout>
            );
        } else {
            return (
                <Layout>
                    <Header />
                    <UserDetail />
                    <Footer />
                </Layout>
            );
        }
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
