import React from 'react';
import { connect } from 'react-redux'
import '../../css/app.scss';
import Carousel from 'nuka-carousel';
import { Tabs, Radio } from 'antd';
import Slide1Img from '../../img/top/slide1_5.png';
import Slide2Img from '../../img/top/slide2_5.png';
import SearchForm from './search_keyword/search_form';
import { fetchListData, setListData } from '../actions/data';
import Header from './common/header';
import Footer from './common/footer';
import { isAuthToken, getAuthToken } from './common/service';


const { TabPane } = Tabs;


var host = location.protocol + "//" + location.host

function getAuthDataUrl() {
    return `${host}/auth`
}


// class SlidingTabs extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             mode: 'person',//keyword, person
//         };
//     }

//     handleModeChange = e => {
//       const mode = e.target.value;
//       this.setState({ mode });
//     };

//     render() {
//       const { mode } = this.state;
//       return (
//         <div>
//           <Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
//             <Radio.Button value="top">Horizontal</Radio.Button>
//             <Radio.Button value="left">Vertical</Radio.Button>
//           </Radio.Group>
//           <Tabs defaultActiveKey="1" tabPosition={mode} style={{ height: 220 }}>
//             {[...Array.from({ length: 30 }, (v, i) => i)].map(i => (
//               <TabPane tab={`Tab-${i}`} key={i} disabled={i === 28}>
//                 Content of tab {i}
//               </TabPane>
//             ))}
//           </Tabs>
//         </div>
//       );
//     }
// }


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
            access_token: ""
        }
        this.authToken = this.authToken.bind(this)
    }
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
