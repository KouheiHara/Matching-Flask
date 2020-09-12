import React from 'react';
import '../../../css/app.scss';
import { Row, Col, List } from 'antd';
import { connect } from 'react-redux'
import { HeartOutlined, RetweetOutlined } from '@ant-design/icons';
import { fetchListData } from '../../actions/data';

const user_text = "直近の投稿を表示します。"


class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            width: window.innerWidth,
            fontSize: "30px",
            initLoading: true,
            loading: false,
            padding_width: 20,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    updateDimensions() {
        this.setState({
            width: window.innerWidth,
            padding_width: Math.floor(window.innerWidth*0.1)
        });
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    render() {
        if (this.props.userData.data) {
            return (
                <Col className="gutter64">
                    <p style={{
                            fontSize: this.state.fontSize,
                            paddingLeft: this.state.padding_width,
                            paddingRight: this.state.padding_width
                        }}>
                        {user_text}
                    </p>
                    <List
                        itemLayout="horizontal"
                        style={{
                            paddingLeft: this.state.padding_width,
                            paddingRight: this.state.padding_width
                        }}
                        dataSource={this.props.userData.data}
                        renderItem={item => (
                            <List.Item>
                                <Col>
                                    <List.Item.Meta
                                        style={{fontSize: this.state.fontsize}}
                                        title={<a href={item["tweet_url"]} target="_blank" rel='noopener'>{item["datetime"]}</a>}
                                        description={item["text"]}
                                    />
                                    <Row>
                                        <HeartOutlined style={{fontSize: '30px' }} />
                                            <span style={{fontSize: '20px'}}>{item["favorite_count"]}</span>
                                        <RetweetOutlined style={{fontSize: '30px'}} />
                                            <span style={{fontSize: '20px'}}>{item["retweet_count"]}</span>
                                    </Row>
                                </Col>
                            </List.Item>
                        )}
                    />
                </Col>
            );
        } else {
            return (
                <Col className="gutter64">
                    <p style={{
                            fontSize: this.state.fontSize,
                            paddingLeft: this.state.padding_width,
                            paddingRight: this.state.padding_width
                        }}>
                        {user_text}
                    </p>
                </Col>
            );
        }
    } 
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
    userData: state.userData
});
  
const mapDispatchToProps= dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList)
