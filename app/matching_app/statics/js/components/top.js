import React from 'react';
import { connect } from 'react-redux'
import '../../css/app.scss';
import Carousel from 'nuka-carousel';
import { Row, Col } from 'antd';
import Slide1Img from '../../img/top/slide1_5.png';
import Slide2Img from '../../img/top/slide2_5.png';
import SearchForm from './search_keyword/search_form';
import { fetchListData } from '../actions/data';
import Header from './common/header';
import Footer from './common/footer';

class TopSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state={
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
                slidewidth: String(this.state.width)+"px"
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
    }
    render() {
        return (
            <div>
                <Header />
                <TopSlider />
                <SearchForm />
                <Footer />
            </div>
        );
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
)(Top)
