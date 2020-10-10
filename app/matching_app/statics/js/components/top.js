import React from 'react';
import { connect } from 'react-redux'
import { Layout } from 'antd';
import '../../css/app.scss';
import Carousel from 'nuka-carousel';
import Slide1Img from '../../img/top/slide1_5.png';
import Slide2Img from '../../img/top/slide2_5.png';
import SearchForm from './search_keyword/search_form';
import { fetchListData, setListData } from '../actions/data';
import Header from './common/header';
import Footer from './common/footer';
import MenuSider from './common/sider';
import { isAuthToken, getAuthToken } from './common/service';
import { MD_SIZE } from './common/config';


var host = location.protocol + "//" + location.host

function getAuthDataUrl() {
    return `${host}/auth`
}


class TopSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            defwidth: 1024,
            cellspace: 100,
            slidewidth: "1024px"
        }
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth });
        if (this.state.width > this.state.defwidth) {
            this.setState({
                cellspace: this.state.width - this.state.defwidth
            })
        } else {
            this.setState({
                slidewidth: String(this.state.width) + "px"
            })
        }
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
    }
    render() {
        return (
            <Carousel
                slidesToShow={1}
                autoplay={true}
                cellAlign={"center"}
                wrapAround={true}
                dragging={true}
                cellSpacing={this.state.cellspace}
                slideWidth={this.state.slidewidth}
                //width="1024px"
                speed={750}
                className="gutter128"
                style={{ textAlign: "center" }}
            >
                <img id="slideimg1" className="" src={Slide1Img} alt="スライド1" />
                <img id="slideimg2" className="" src={Slide2Img} alt="スライド2" />
            </Carousel>
        );
    }
}


class Top extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            access_token: ""
        }
        this.authToken = this.authToken.bind(this)
        this.updateDimensions = this.updateDimensions.bind(this)
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth })
    };
    authToken() {
        const flag = isAuthToken()
        if (flag) {
            const token = getAuthToken()
            this.props.setData({
                "username": "anonymous",
                "access_token": token
            })
        } else {
            this.props.fetchData(getAuthDataUrl())
        }
    }
    componentDidMount() {
        this.authToken()
        window.addEventListener('resize', this.updateDimensions)
    }
    render() {
        if (this.state.width <= MD_SIZE) {
            return (
                <Layout>
                    <MenuSider />
                    <div>
                        <Header />
                        <TopSlider />
                        <SearchForm />
                        <Footer />
                    </div>
                </Layout>
            );
        } else {
            return (
                <Layout>
                    <div>
                        <Header />
                        <TopSlider />
                        <SearchForm />
                        <Footer />
                    </div>
                </Layout>
            );
        }
    }
}

const mapStateToProps = state => ({
    data: state.data,
    hasError: state.getDataError,
    isLoading: state.loadData,
    authData: state.authData,
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url) => dispatch(fetchListData(url, {}, "authData")),
    setData: (obj) => dispatch(setListData(obj, "authData"))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Top)
