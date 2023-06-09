import Sider from "antd/es/layout/Sider";
import {Layout, Menu} from "antd";
import {CloudOutlined, HomeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {Content, Header} from "antd/es/layout/layout";
import App from "../../App";
import React from "react";

function NavigationBar({children}){
    //接受的参数名字必须为children，否则出错
    // NavigationBar 组件将无法正确访问其子元素，因为它期望 children 属性而不是 childre 属性。
    return(

        <Layout style={{ minHeight: '100vh' }}>
            <Sider>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item  icon={<HomeOutlined />}>
                        <Link to="/">SocialNetwork</Link>
                    </Menu.Item>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link to="/account">Account</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<CloudOutlined />}>
                        <Link to="/tweets">Tweets</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<TeamOutlined />}>
                        <Link to="/friends">Friends</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 10px' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        {children}

                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}
export  default  NavigationBar;