import React from 'react';
import { Row, Col, Menu, Button } from 'antd';
import { AreaChartOutlined, ContainerOutlined } from '@ant-design/icons';
import TitleImg from '../../../img/header/logo.png';
import HeaderBackgroundImg from '../../../img/header/header_background.png';
import { XS_SIZE, MD_SIZE } from './config';


function TitleIcon(key) {
    if (key["width"] > MD_SIZE) {
        return <img id="top" className="" src={TitleImg} alt="トップ画像" width="45%" height="45%" />
    } else if (key["width"] > XS_SIZE) {
        return <img id="top" className="" src={TitleImg} alt="トップ画像" width="60%" height="60%" />
    } else {
        return <img id="top" className="" src={TitleImg} alt="トップ画像" width="75%" height="75%" />
    }
}


class Menubar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            current: '/',
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.setCurrent = this.setCurrent.bind(this)
    }
    updateDimensions() {
        this.setState({ width: window.innerWidth })
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions)
        this.setCurrent()
    }
    setCurrent() {
        let path = window.location.pathname
        if (path === "/terms") {
            this.setState({ current: "/terms" })
        } else {
            this.setState({ current: "/" })
        }
    }
    handleClick(e) {
        this.setState({ current: e.key })
        window.location.href = `${e.key}`
    }
    render() {
        return (
            <Menu
                onClick={(e) => { this.handleClick(e) }}
                selectedKeys={[this.state.current]}
                style={{
                    fontSize: '25px', backgroundColor: '#00ced1', color: '#ffffff'
                }}
                mode="horizontal" >
                <Menu.Item
                    key="/"
                    style={{ fontSize: '25px' }}
                    color={'#ffffff'}
                    icon={<AreaChartOutlined style={{ fontSize: '25px' }} />}>
                    トップ
                </Menu.Item>
                <Menu.Item
                    key="/terms"
                    style={{ fontSize: '25px' }}
                    color={'#ffffff'}
                    icon={< ContainerOutlined style={{ fontSize: '25px' }} />}>
                    利用規約
                </Menu.Item >
            </Menu >
        )
    }
}


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if (this.state.width > MD_SIZE) {
            return (
                <>
                    <Menubar />
                    <Col
                        style={{ textAlign: "center", backgroundImage: `url(${HeaderBackgroundImg})` }}
                        gutter={[0, 128]}>
                        <TitleIcon width={this.state.width} />
                    </Col>
                </>
            );
        } else {
            return (
                <>
                    <Col
                        style={{ textAlign: "center", backgroundImage: `url(${HeaderBackgroundImg})` }}
                        gutter={[0, 128]}>
                        <TitleIcon width={this.state.width} />
                    </Col>
                </>
            );
        }
    }
}


export default Header