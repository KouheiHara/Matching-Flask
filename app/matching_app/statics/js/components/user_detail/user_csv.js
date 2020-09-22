import React from 'react';
import '../../../css/app.scss';
import { Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { fetchListData } from '../../actions/data';

var host = location.protocol + "//" + location.host


function get_user_csv_url(keyword) {
    return `${host}/api/user_csv?user_id=${keyword}`
}


function create_blob_and_download_csv(data, user_id) {
    const filename = `${user_id}.csv`
    var blob = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob, {
            type: "text/plain"
        });
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}


class UserCsv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            loading: false,
            fontSize: "30px",
            padding_width: 10,
            lastwidth: window.innerWidth,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.eventListenerWidth = this.eventListenerWidth.bind(this)
        this.downloadCsv = this.downloadCsv.bind(this)
    }
    updateDimensions() {
        this.setState({
            width: window.innerWidth,
            padding_width: Math.floor(window.innerWidth * 0.1)
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
    downloadCsv() {
        this.state.loading = true
        this.props.fetchData(get_user_csv_url(this.props.user_id))
    }
    componentDidMount() {
        window.addEventListener('resize', this.eventListenerWidth);
        this.updateDimensions()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.eventListenerWidth);
    }
    render() {
        if (this.props.userCsv.size && this.state.loading) {
            this.state.loading = false
            create_blob_and_download_csv(this.props.userCsv, this.props.user_id)
        }
        if (this.props.user_id) {
            return (
                <Col
                    span={24}
                    className="right-side"
                    style={{
                        paddingLeft: this.state.padding_width,
                        paddingRight: this.state.padding_width
                    }}>
                    <Button
                        className="right-side"
                        type="primary"
                        shape="round"
                        icon={<DownloadOutlined />}
                        size="large"
                        onClick={() => (this.downloadCsv())}>
                        Download
                    </Button>
                </Col >
            );
        } else {
            return (
                <Col
                    span={24}
                    className="right-side"
                    style={{
                        paddingLeft: this.state.padding_width,
                        paddingRight: this.state.padding_width
                    }}
                >
                    <Button
                        className="right-side"
                        type="primary"
                        shape="round"
                        icon={<DownloadOutlined />}
                        size="large"
                        disabled={true}>
                        Download
                    </Button>
                </Col>
            );
        }
    }
}

const mapStateToProps = state => ({
    hasError: state.getDataError,
    isLoading: state.loadData,
    userCsv: state.userCsv
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url, 'userCsv', 'blob'))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserCsv)
