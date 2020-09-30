import React from 'react';
import '../../../css/app.scss';
import {
    Col,
    Form,
    Input,
    Button,
} from 'antd';
import { connect } from 'react-redux'
import { fetchListData } from '../../actions/data';


var host = location.protocol + "//" + location.host

function getSearchListUrl() {
    return `${host}/api/search_list`
}

function getUserListUrl() {
    return `${host}/api/user_list`
}

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: 'キーワードは入力必須です',
};


class MobileForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            submit: false,
            error: false,
            loading: false,
            max_search_width: 900,
            searchtext_width: 600,
            searchbutton_width: 120,
            searchbutton_height: 60,
            padding_width: 20,
            fontsize: 20,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.onFinish = this.onFinish.bind(this)
    }
    updateDimensions() {
        this.setState({
            width: window.innerWidth
        });
        const padding_width = Math.floor(this.state.width * 0.1)
        this.setState({
            padding_width: padding_width,
            searchtext_width: this.state.width - padding_width * 2,
            searchbutton_width: this.state.width - padding_width * 2
        });
    }
    onFinish(value) {
        if (this.props.search_type == "keyword") {
            this.props.fetchData(
                getSearchListUrl(),
                { "keyword": value["search"]["keyword"] },
                "listData"
            )
        } else {
            this.props.fetchData(
                getUserListUrl(),
                { "user_id": value["search"]["keyword"] },
                "userList"
            )
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    render() {
        return (
            <Col span={24} className="form-col">
                <Form {...layout}
                    name="search-keyword"
                    validateMessages={validateMessages}
                    onFinish={(value) => (this.onFinish(value))}>
                    <Form.Item
                        name={['search', 'keyword']}
                        label=""
                        maxLength={100}
                        rules={[
                            {
                                required: true,
                            },
                        ]}>
                        <Input className="form-textbot" style={{
                            width: this.state.searchtext_width + "px",
                            height: this.state.searchbutton_height + "px",
                            fontSize: this.state.fontsize
                        }} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            className="form-button"
                            style={{
                                width: this.state.searchbutton_width + "px",
                                height: this.state.searchbutton_height + "px"
                            }}>
                            <span className="button-text"
                                style={{
                                    fontSize: this.state.fontsize
                                }}>
                                送信
                            </span>
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        );
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
    listData: state.listData
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, obj, type) => dispatch(fetchListData(url, obj, type)),
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MobileForm)
