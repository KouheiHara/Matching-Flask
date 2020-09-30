import React from 'react';
import '../../../css/app.scss';
import { Row, Col, Radio } from 'antd';
import { MD_SIZE } from './../common/config';
import KeywordIconImg from '../../../img/search/keyword.svg';
import { connect } from 'react-redux'
import { fetchListData } from '../../actions/data';
import SearchList from './search_list';
import UserList from './user_list';
import MobileForm from './mobile_form';
import PcForm from './pc_form';


const search_text = "直近でキーワードに関係する投稿をした人を表示します。"
const user_text = "直近で投稿したユーザで一致した人を表示します。"


function KeywordIcon() {
    return <img
        id="keywordicon"
        className="gutter48"
        src={KeywordIconImg}
        alt="キーワード"
        width="50%"
        height="50%"
    />
}

function KeywordList(key) {
    if (key['search_type'] == "keyword") {
        return <SearchList />
    } else if (key['search_type'] == "user_id") {
        return <UserList />
    } else {
        return <></>
    }
}

function KeywordText(key) {
    if (key['search_type'] == "keyword") {
        return <>{search_text}</>
    } else if (key['search_type'] == "user_id") {
        return <>{user_text}</>
    } else {
        return <></>
    }
}


class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            submit: false,
            error: false,
            loading: false,
            fontSize: 30,
            padding_width: 20,
            search_type_value: 1,
            search_types: {
                1: "keyword",
                2: "user_id"
            }
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.onChangeSearchType = this.onChangeSearchType.bind(this)
    }
    onChangeSearchType(e) {
        this.setState({
            search_type_value: e.target.value,
        });
    }
    updateDimensions() {
        this.setState({
            width: window.innerWidth,
            padding_width: Math.floor(window.innerWidth * 0.1)
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
        if (this.state.width < MD_SIZE) {
            return (
                <Col>
                    <Row className="gutter128">
                        <Col className="form-col" span={24}>
                            <KeywordIcon />
                        </Col>
                        <Col className="form-col" span={24}>
                            <Radio.Group
                                size={"large"}
                                style={{ marginTop: 16, marginBottom: 16 }}
                                onChange={this.onChangeSearchType}
                                value={this.state.search_type_value}>
                                <Radio.Button value={1}><span className="radiolabel">検索ワード</span></Radio.Button>
                                <Radio.Button value={2}><span className="radiolabel">ユーザID</span></Radio.Button>
                            </Radio.Group>
                        </Col>
                        <MobileForm search_type={this.state.search_types[this.state.search_type_value]} />
                    </Row>
                    <Row className="gutter0128">
                        <p style={{
                            fontSize: this.state.fontSize,
                            paddingLeft: this.state.padding_width,
                            paddingRight: this.state.padding_width
                        }}>
                            <KeywordText search_type={this.state.search_types[this.state.search_type_value]} />
                        </p>
                    </Row>
                    <KeywordList search_type={this.state.search_types[this.state.search_type_value]} />
                </Col >
            );
        } else {
            return (
                <Col>
                    <Row className="gutter128">
                        <Col className="form-col" span={24}>
                            <KeywordIcon padding_width={this.state.padding_width} />
                        </Col>
                        <Col className="form-col" span={24}>
                            <Radio.Group
                                size={"large"}
                                style={{ marginTop: 16, marginBottom: 16 }}
                                onChange={this.onChangeSearchType}
                                value={this.state.search_type_value}>
                                <Radio.Button value={1}><span className="radiolabel">検索ワード</span></Radio.Button>
                                <Radio.Button value={2}><span className="radiolabel">ユーザID</span></Radio.Button>
                            </Radio.Group>
                        </Col>
                        <PcForm search_type={this.state.search_types[this.state.search_type_value]} />
                    </Row>
                    <Row className="gutter0128 form-col">
                        <p style={{
                            fontSize: this.state.fontSize,
                            paddingLeft: this.state.padding_width,
                            paddingRight: this.state.padding_width
                        }}>
                            <KeywordText search_type={this.state.search_types[this.state.search_type_value]} />
                        </p>
                    </Row>
                    <KeywordList search_type={this.state.search_types[this.state.search_type_value]} />
                </Col>
            );
        }
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
    authData: state.authData
});

const mapDispatchToProps = dispatch => ({
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchForm)
