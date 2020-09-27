import React from 'react';
import '../../../css/app.scss';
import { Row } from 'antd';
import { connect } from 'react-redux'
import { fetchListData } from '../../actions/data';
import { LikeOutlined, DislikeOutlined, SearchOutlined } from '@ant-design/icons';


const neutralcolor = "#696969"
const likecolor = "#ff4500"
const dislikecolor = "#4169e1"


var host = location.protocol + "//" + location.host

function getPlusLikeNumUrl() {
    return `${host}/api/check_like`
}
function getMinusLikeNumUrl() {
    return `${host}/api/check_like`
}
function getPlusDislikeNumUrl() {
    return `${host}/api/check_like`
}
function getMinusDislikeNumUrl() {
    return `${host}/api/check_like`
}
function getUserUrl(user_id) {
    return `${host}/user/${user_id}`
}

class LikeDislikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedlike: false,
            clickeddislike: false,
            likenum: this.props.item["like"],
            dislikenum: this.props.item["dislike"],
            likecolor: neutralcolor,
            dislikecolor: neutralcolor,
        }
        this.clickLikeIcon = this.clickLikeIcon.bind(this)
        this.clickDislikeIcon = this.clickDislikeIcon.bind(this)
        this.clickSearchIcon = this.clickSearchIcon.bind(this)
    }
    clickSearchIcon() {
        window.open(getUserUrl(this.props.item["user_id"]), '_blank');
    }
    clickLikeIcon() {
        if (this.state.clickedlike) {
            this.setState({
                clickedlike: false,
                likenum: this.state.likenum - 1,
                likecolor: neutralcolor
            })
            this.props.fetchData(
                getMinusLikeNumUrl(),
                {
                    "user_id": this.props.item["user_id"],
                    "like": 1,
                    "check": 0
                }
            );
        } else {
            if (this.state.clickeddislike) {
                this.setState({
                    clickeddislike: false,
                    dislikenum: this.state.dislikenum - 1,
                    dislikecolor: neutralcolor
                })
                this.props.fetchData(
                    getMinusDislikeNumUrl(),
                    {
                        "user_id": this.props.item["user_id"],
                        "like": 0,
                        "check": 0
                    }
                );
            }
            this.setState({
                clickedlike: true,
                likenum: this.state.likenum + 1,
                likecolor: likecolor
            })
            this.props.fetchData(
                getPlusLikeNumUrl(),
                {
                    "user_id": this.props.item["user_id"],
                    "like": 1,
                    "check": 1
                }
            );
        }
    }
    clickDislikeIcon() {
        if (this.state.clickeddislike) {
            this.setState({
                clickeddislike: false,
                dislikenum: this.state.dislikenum - 1,
                dislikecolor: neutralcolor
            })
            this.props.fetchData(
                getMinusDislikeNumUrl(),
                {
                    "user_id": this.props.item["user_id"],
                    "like": 0,
                    "check": 0
                }
            );
        } else {
            if (this.state.clickedlike) {
                this.setState({
                    clickedlike: false,
                    likenum: this.state.likenum - 1,
                    likecolor: neutralcolor
                })
                this.props.fetchData(
                    getMinusLikeNumUrl(),
                    {
                        "user_id": this.props.item["user_id"],
                        "like": 1,
                        "check": 0
                    }
                );
            }
            this.setState({
                clickeddislike: true,
                dislikenum: this.state.dislikenum + 1,
                dislikecolor: dislikecolor
            })
            this.props.fetchData(
                getPlusDislikeNumUrl(),
                {
                    "user_id": this.props.item["user_id"],
                    "like": 0,
                    "check": 1
                }
            );
        }
    }
    render() {
        return (
            <Row>
                <LikeOutlined
                    style={{ fontSize: '30px', color: this.state.likecolor, cursor: 'pointer' }}
                    onClick={() => this.clickLikeIcon()} />
                <span style={{ fontSize: '20px', color: this.state.likecolor }}>{this.state.likenum}</span>
                <DislikeOutlined
                    style={{ fontSize: '30px', color: this.state.dislikecolor, cursor: 'pointer' }}
                    onClick={() => this.clickDislikeIcon()} />
                <span style={{ fontSize: '20px', color: this.state.dislikecolor }}>{this.state.dislikenum}</span>
                <SearchOutlined
                    style={{ fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => this.clickSearchIcon()} />
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, obj) => dispatch(fetchListData(url, obj))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LikeDislikeButton)
