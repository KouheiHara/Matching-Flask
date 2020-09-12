import React from 'react';
import '../../../css/app.scss';
import { Row} from 'antd';
import { connect } from 'react-redux'
import { fetchListData } from '../../actions/data';
import { LikeOutlined, DislikeOutlined, SearchOutlined } from '@ant-design/icons';


const neutralcolor = "#696969"
const likecolor = "#ff4500"
const dislikecolor= "#4169e1"


var host = location.protocol+"//"+location.host

function get_plus_like_num_url(id) {
    return `${host}/api/check_like?user_id=${id}&like=1&check=1`
}
function get_minus_like_num_url(id) {
    return `${host}/api/check_like?user_id=${id}&like=1&check=0`
}
function get_plus_dislike_num_url(id) {
    return `${host}/api/check_like?user_id=${id}&like=0&check=1`
}
function get_minus_dislike_num_url(id) {
    return `${host}/api/check_like?user_id=${id}&like=0&check=0`
}
function get_user_url(user_id) {
    return `${host}/user/${user_id}`
}

class LikeDislikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state={
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
        window.open(get_user_url(this.props.item["user_id"]), '_blank'); 
    }
    clickLikeIcon() {
        if (this.state.clickedlike) {
            this.setState({
                clickedlike:false,
                likenum: this.state.likenum-1,
                likecolor: neutralcolor
            })
            this.props.fetchData(get_minus_like_num_url(this.props.item["user_id"]));
        } else {
            if (this.state.clickeddislike) {
                this.setState({
                    clickeddislike:false,
                    dislikenum: this.state.dislikenum-1,
                    dislikecolor: neutralcolor
                })  
                this.props.fetchData(get_minus_dislike_num_url(this.props.item["user_id"]));
            }
            this.setState({
                clickedlike:true,
                likenum: this.state.likenum+1,
                likecolor: likecolor
            }) 
            this.props.fetchData(get_plus_like_num_url(this.props.item["user_id"]));            
        }
    }
    clickDislikeIcon() {
        if (this.state.clickeddislike) {
            this.setState({
                clickeddislike:false,
                dislikenum: this.state.dislikenum-1,
                dislikecolor: neutralcolor
            })
            this.props.fetchData(get_minus_dislike_num_url(this.props.item["user_id"]));
        } else {
            if (this.state.clickedlike) {
                this.setState({
                    clickedlike:false,
                    likenum: this.state.likenum-1,
                    likecolor: neutralcolor
                })  
                this.props.fetchData(get_minus_like_num_url(this.props.item["user_id"]));
            }
            this.setState({
                clickeddislike:true,
                dislikenum: this.state.dislikenum+1,
                dislikecolor: dislikecolor
            }) 
            this.props.fetchData(get_plus_dislike_num_url(this.props.item["user_id"]));            
        }
    }
    render() {
        return (
            <Row>
                <LikeOutlined
                    style={{fontSize: '30px', color:this.state.likecolor, cursor: 'pointer' }}
                    onClick={()=>this.clickLikeIcon()}/>
                    <span style={{fontSize: '20px', color:this.state.likecolor}}>{this.state.likenum}</span>
                <DislikeOutlined
                    style={{fontSize: '30px', color:this.state.dislikecolor, cursor: 'pointer'}}
                    onClick={()=>this.clickDislikeIcon()}/>
                    <span style={{fontSize: '20px', color:this.state.dislikecolor}}>{this.state.dislikenum}</span>
                <SearchOutlined
                    style={{fontSize: '30px', cursor: 'pointer'}}
                    onClick={()=>this.clickSearchIcon()}/>
            </Row>
        );    
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
});
  
const mapDispatchToProps= dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LikeDislikeButton)
