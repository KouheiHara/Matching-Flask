import React from 'react';
import { Layout, Menu } from 'antd';
import { AreaChartOutlined, ContainerOutlined } from '@ant-design/icons';


const { Sider } = Layout;


class MenuSider extends React.Component {
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
        this.setState({ width: window.innerWidth });
    }
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
            <Sider
                breakpoint="md"
                collapsedWidth="0"
                style={{
                    fontSize: '25px', backgroundColor: '#f0f8ff'
                }}
            >
                <Menu
                    mode="inline"
                    style={{
                        backgroundColor: '#f0f8ff', color: "#000000"
                    }}
                    defaultSelectedKeys={[this.state.current]}>
                    <Menu.Item key="/" icon={<AreaChartOutlined style={{ fontSize: '25px' }} />} onClick={(e) => { this.handleClick(e) }}>
                        トップ
                    </Menu.Item>
                    <Menu.Item key="/terms" icon={<ContainerOutlined style={{ fontSize: '25px' }} />} onClick={(e) => { this.handleClick(e) }}>
                        利用規約
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}


export default MenuSider