import React from 'react';
import '../../../css/app.scss';
import { Row, Col, Avatar }from 'antd';
import ReactWordcloud from 'react-wordcloud';
import { connect } from 'react-redux';
import { LoadingOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { fetchListData } from '../../actions/data';

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

const keywordcloud_text = "直近の投稿でよく発言されている単語"

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
            width : (window.innerWidth > 600) ? 600 : window.innerWidth,
            lastwidth: window.innerWidth,
            words: this.props.data
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.eventListenerWidth = this.eventListenerWidth.bind(this)
        this.setWords = this.setWords.bind(this)
    }
    updateDimensions() {
        this.setState({
            width: (window.innerWidth > 600) ? 600 : window.innerWidth,
        });
    }
    setWords() {
        var words = this.props.data
        var new_words = []
        words.forEach(element => 
            new_words.push({
                "text": element["text"],
                "value": element["value"]
            })
        )
        this.setState({
            words: new_words
        })
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
        this.setWords()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.eventListenerWidth);
    }
    render() {
      return (
        <div style={{ backgroundColor: '#efefef',
            height: "300px",
            width: "100%" }}>
            <ReactWordcloud
                options={{
                    fontSizes: [15, 50],
                    rotations: 1,
                    rotationAngles: [0, 0],
                }}
                className="form-col"
                size={[this.state.width, 100]}
                words={this.state.words}
            />
        </div>
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
            padding_width: 10,
            lastwidth: window.innerWidth,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.eventListenerWidth = this.eventListenerWidth.bind(this)
    }
    updateDimensions() {
        this.setState({ 
            width: window.innerWidth,
            padding_width: Math.floor(window.innerWidth*0.1)
        });
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
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.eventListenerWidth);
    }
    render() {
        if (this.props.keywordCloud.data) {
            return (
                <Col style={{width:"100%"}}>
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
                    <Col className="gutter32" span={24}>
                        <p style={{
                                fontSize: "20px",
                                paddingLeft: this.state.padding_width,
                                paddingRight: this.state.padding_width
                            }}>
                            {keywordcloud_text}
                        </p>
                        <DisplayKeyowrdCloud data={this.props.keywordCloud.data["words"]}/>
                    </Col>
                </Col>
            );
        } else {
            if (this.props.userInfo.data) {
                return (
                    <Col style={{width:"100%"}}>
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
                    <Col style={{width:"100%"}}>
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
