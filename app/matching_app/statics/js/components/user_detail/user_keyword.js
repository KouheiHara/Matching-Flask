import React from 'react';
import '../../../css/app.scss';
import { Row, Col, Avatar }from 'antd';
import ReactWordcloud from 'react-wordcloud';
import { connect } from 'react-redux';
import { LoadingOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { fetchListData } from '../../actions/data';


class DisplayKeyowrdCloud extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            callbacks : {
                getWordColor: word => word.value > 50 ? "blue" : "red",
                onWordClick: console.log,
                onWordMouseOver: console.log,
                getWordTooltip: word => `${word.text} (${word.value}) [${word.value > 50 ? "good" : "bad"}]`,
            },
            size : [500, 500], //横,縦
            words: this.props.data
        }
        this.setWords = this.setWords.bind(this)
    }
    setWords() {
        const cwidth = window.innerWidth
        var words = this.props.data
        var new_words = []
        words.forEach(element => 
            new_words.push({
                "text": element["text"],
                "value": element["value"]
            })
        )
        this.setState({
            size : [cwidth, 300],
            words: new_words
        })
    }
    componentDidMount() {
        this.setWords()
        setInterval(() => {
            this.forceUpdate();
        }, 4000);
    }
    render() {
      return (
        <ReactWordcloud
            size={this.state.size}
            words={this.state.words}
        />
      );
    }
  }

class UserKeyword extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            width: window.innerWidth,
            submit: false,
            error: false,
            loading: false,
            fontSize: "30px",
            padding_width: 10
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
        if (this.props.keywordCloud.data) {
            return (
                <Col>
                    <Col className="gutter64">
                        <Row
                            style={{
                                paddingLeft: this.state.padding_width,
                                paddingRight: this.state.padding_width
                            }}>
                            <p style={{fontSize: this.state.fontSize}}>
                                <Avatar src={this.props.userInfo.data["icon_url"]} />
                                {<a href={this.props.userInfo.data["user_url"]} target="_blank" rel='noopener'>{this.props.userInfo.data["user_name"]}</a>}
                            </p>
                        </Row>
                        <Row
                            style={{
                                paddingLeft: this.state.padding_width,
                                paddingRight: this.state.padding_width
                            }}>
                            <LikeOutlined style={{fontSize: '30px'}} />
                                <span style={{fontSize: '20px'}}>{this.props.userInfo.data["like"]}</span>
                            <DislikeOutlined style={{fontSize: '30px'}} />
                                <span style={{fontSize: '20px'}}>{this.props.userInfo.data["dislike"]}</span>
                        </Row>
                    </Col>
                    <Col span={24} className="gutter32" >
                        <DisplayKeyowrdCloud data={this.props.keywordCloud.data["words"]}/>
                    </Col>
                </Col>
            );
        } else {
            if (this.props.userInfo.data) {
                return (
                    <Col>
                        <Col className="gutter64">
                            <Row
                                style={{
                                    paddingLeft: this.state.padding_width,
                                    paddingRight: this.state.padding_width
                                }}>
                                <p style={{fontSize: this.state.fontSize}}>
                                    <Avatar src={this.props.userInfo.data["icon_url"]} />
                                    {<a href={this.props.userInfo.data["user_url"]} target="_blank" rel='noopener'>{this.props.userInfo.data["user_name"]}</a>}
                                </p>
                            </Row>
                            <Row
                                style={{
                                    paddingLeft: this.state.padding_width,
                                    paddingRight: this.state.padding_width
                                }}>
                                <LikeOutlined style={{fontSize: '30px'}} />
                                    <span style={{fontSize: '20px'}}>{this.props.userInfo.data["like"]}</span>
                                <DislikeOutlined style={{fontSize: '30px'}} />
                                    <span style={{fontSize: '20px'}}>{this.props.userInfo.data["dislike"]}</span>
                            </Row>
                        </Col>
                        <Col span={24} className="form-col gutter32" >
                            <LoadingOutlined style={{ fontSize: '50px' }} />
                        </Col>
                    </Col>
                );
            } else {
                return (
                    <Col>
                        <Col className="gutter64">
                        </Col>
                        <Col span={24} className="form-col gutter32" >
                            <LoadingOutlined style={{ fontSize: '50px' }} />
                        </Col>
                    </Col>
                );
            }
        }
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
    fetchData: (url) => dispatch(fetchListData(url))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserKeyword)
