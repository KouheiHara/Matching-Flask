import React from 'react';
import '../../../css/app.scss';
import { 
    Row,
    Col,

} from 'antd';
import { XS_SIZE, MD_SIZE } from './../common/config';
import KeywordIconImg from '../../../img/search/keyword.svg';
import { connect } from 'react-redux'
import { fetchListData } from '../../actions/data';
import SearchList from './search_list';
import MobileForm from './mobile_form';
import PcForm from './pc_form';


const keyword_text = "直近でキーワードに関係する投稿をした人を表示します。"

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


class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            width: window.innerWidth,
            submit: false,
            error: false,
            loading: false,
            padding_width: 20
        }
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth });
    }
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions());
    }
    render() {
        this.state.padding_width = Math.floor(this.state.width*0.1)
        if (this.state.width < MD_SIZE) {
            return (
            <Col>
                <Row className="gutter128">
                    <Col className="form-col" span={24}>
                        <KeywordIcon /> 
                    </Col>
                    <MobileForm />
                </Row>
                <Row className="gutter0128">
                    <p style={{
                            fontSize:20,
                            paddingLeft: this.state.padding_width,
                            paddingRight: this.state.padding_width
                        }}>
                        {keyword_text}
                    </p>
                </Row>
                <SearchList />
            </Col>
            );
        } else {
            return (
            <Col>
                <Row className="gutter128">
                    <Col className="form-col" span={24}>
                        <KeywordIcon padding_width={this.state.padding_width}/> 
                    </Col>
                    <PcForm />
                </Row>
                <Row className="gutter0128 form-col">
                    <p style={{
                            fontSize:20,
                            paddingLeft: this.state.padding_width,
                            paddingRight: this.state.padding_width
                        }}>
                        {keyword_text}
                    </p>
                </Row>
                <SearchList />
            </Col>
            );
        }
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData
});
  
const mapDispatchToProps= dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url))
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchForm)
