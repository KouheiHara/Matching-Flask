import React from 'react';
import '../../../css/app.scss';
import { Row } from 'antd';
import { connect } from 'react-redux'
import { fetchListData } from '../../actions/data';
import { XS_SIZE } from '../common/config';
import UserList from './user_list';
import UserKeyword from './user_keyword';

var host = location.protocol+"//"+location.host

function get_user_info_url(keyword) {
    return `${host}/api/user_info?user_id=${keyword}`
}

function get_user_list_url(keyword) {
    return `${host}/api/search_user?user_id=${keyword}`
}

function get_keyword_cloud_url(keyword) {
    return `${host}/api/keyword_cloud?user_id=${keyword}`
}

class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            width: window.innerWidth,
            side_percentage: "10%",
            fontsize: 30,
            initLoading: false,
            user_id: 0,
            lastwidth: window.innerWidth,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.getUserData = this.getUserData.bind(this)
        this.eventListenerWidth = this.eventListenerWidth.bind(this)
    }
    updateDimensions() {
        let side_percentage= "20%"
        if (window.innerWidth < XS_SIZE) {
            side_percentage = "10%"
        }
        this.setState({
            width: window.innerWidth,
            side_percentage: side_percentage
        });
    }
    getUserData() {
        var params = location.pathname.split('/')
        var user_id = params[2].split("?")[0]
        this.setState({user_id: user_id})
        this.props.fetchData(get_user_info_url(user_id), "userInfo")
        this.props.fetchData(get_user_list_url(user_id), "userData")
    }
    eventListenerWidth() {
        if (this.state.lastwidth != window.innerWidth) {
            this.setState({
                lastwidth: window.innerWidth
            })
            this.updateDimensions()
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.eventListenerWidth);
        this.updateDimensions()
        this.getUserData()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.eventListenerWidth);
    }
    render() {
        if (this.props.userData.data && !this.state.initLoading) {
            this.state.initLoading=true
            this.props.fetchData(get_keyword_cloud_url(this.state.user_id), "keywordCloud")
        }
        return (
            <Row>
                <UserKeyword />
                <UserList />
            </Row>
        );
    } 
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
    userData: state.userData,
    keywordCloud: state.keywordCloud,
    userInfo: state.userInfo
});
  
const mapDispatchToProps= dispatch => ({
    fetchData: (url, type) => dispatch(fetchListData(url, type)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserDetail)
