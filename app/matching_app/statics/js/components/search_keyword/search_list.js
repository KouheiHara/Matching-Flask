import React from 'react';
import '../../../css/app.scss';
import { Row, Col, List, Avatar } from 'antd';
import { connect } from 'react-redux'
import { fetchListData } from '../../actions/data';
import { XS_SIZE } from './../common/config';
import LikeDislikeButton from './likedislike_button';


class SearchList extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            width: window.innerWidth,
            side_percentage: "10%",
            fontsize: 30,
            initLoading: true,
            loading: false,
            data: [],
            list: [],
        }
        this.updateDimensions = this.updateDimensions.bind(this)
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
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    render() {
        if (this.props.listData.data) {
            return (
                <Row
                    className="gutter128"
                    style={{
                        paddingLeft: this.state.side_percentage,
                        paddingRight: this.state.side_percentage
                    }}>
                    <Col>
                        <List
                            itemLayout="horizontal"
                            dataSource={this.props.listData.data}
                            renderItem={item => (
                                <List.Item>
                                    <Col>
                                        <List.Item.Meta
                                            style={{fontSize: this.state.fontsize}}
                                            avatar={<Avatar src={item["icon_url"]} />}
                                            title={<a href={item["user_url"]} target="_blank" rel='noopener'>{item["user_name"]}</a>}
                                            description={item["user_description"]}
                                        />
                                        <LikeDislikeButton item={item} />
                                    </Col>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            );
        } else {
            return (
                <Row>
                </Row>
            );
        }
    } 
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
    listData: state.listData
});
  
const mapDispatchToProps= dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchList)
