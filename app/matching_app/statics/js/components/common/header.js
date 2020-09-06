import React from 'react';
import { Row, Col } from 'antd';
import TitleImg from '../../../img/header/logo.png';
import HeaderBackgroundImg from '../../../img/header/header_background.png';
import { XS_SIZE, MD_SIZE } from './config';


function TitleIcon(key) {
    if (key["width"] > MD_SIZE) {
        return <img id="top" className="" src={TitleImg} alt="トップ画像" width="45%" height="45%" />
    } else if (key["width"] > XS_SIZE ) {
        return <img id="top" className="" src={TitleImg} alt="トップ画像" width="60%" height="60%" />
    } else {
        return <img id="top" className="" src={TitleImg} alt="トップ画像" width="75%" height="75%" />   
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            width: window.innerWidth,
        }
        this.updateDimensions = this.updateDimensions.bind(this)    
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth });
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    render() {
        return (
            <Col 
                style={{ textAlign: "center", backgroundImage: `url(${HeaderBackgroundImg})`}}
                gutter={[0, 128]}>
                    <TitleIcon width={this.state.width}/>
            </Col>
        );
    }
}

export default Header;