import React from 'react';
import { Row, Col } from 'antd';
import IconImg from '../../../img/footer/icon.png';
import { HomeFilled, UpOutlined } from '@ant-design/icons';
import FooterBackgroundImg from '../../../img/header/header_background.png';
import { XS_SIZE, MD_SIZE } from './config';
import { moveToPageAndJumpAnchor } from './service';


function FooterImgIcon({window_size=100}) {
    if (window_size < XS_SIZE) {
        return <img className="icon-profile" src={IconImg} alt="icon" width="100" height="100" />
    } else {
        return <img className="icon-profile" src={IconImg} alt="icon" width="150" height="150" />
    }
}


class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            width: window.innerWidth,
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.onClickScroll = this.onClickScroll.bind(this)
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth });
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    onClickScroll() {
        window.scroll({
            top: 0,
            behavior: "smooth"
        })
    }
    render() {
        return (
            <div style={{ backgroundImage: `url(${FooterBackgroundImg})`}}>
            <Row className="footer-panel" align="middle">
                <Row>
                    <HomeFilled className="footer-home-icon" style={{ fontSize: '30px' }} onClick={() => (moveToPageAndJumpAnchor("/", "#top"))}/>
                    <div className="footer-link" onClick={() => (moveToPageAndJumpAnchor("/","#top"))}>TOP</div>
                </Row>
                <Row className="footer-up-icon">
                    <UpOutlined style={{ fontSize: '30px' }} onClick={this.onClickScroll}/>
                </Row>
            </Row>
            <Row className="footer-body">
                <div className="footer-profile">
                    <div className="profile-icon">
                        <FooterImgIcon  window_size={this.state.width} />
                        <p className="profile-name">システム管理者</p>
                    </div>
                    <div className="profile-text">
                        <p className="profile-str">
                            データを活用するアプリを提供しています。ユーザの需要にあったデータを提供できるよう改修していきます。
                        </p>
                    </div>
                </div>
            </Row>
            <Row className="footer-copyright" align="middle">
                <div className="copyright">
                    <p>©2020 ツイッター×人探し</p>
                </div>
            </Row>
        </div>
        );
    }
}

export default Footer;