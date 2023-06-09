

import {Button, Layout, Menu} from 'antd';

import {Link, useNavigate} from "react-router-dom";
import {Content, Header} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {CloudOutlined, HomeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import AccountPage from "./AccountPage";


function Home() {
    const navigate = useNavigate()

    const handleButtonClickToPage = () => {
       navigate('/account')
    };

    const handleButtonClickToStorage = ()=>{
        navigate('/storage')
    }

    const handleButtonClickToFriends = ()=>{
        navigate('/friends')
    }



    return (

        // <Layout style={{ minHeight: '100vh' }}>
        //     <Sider>
        //         <div className="logo" />
        //         <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        //             <Menu.Item  icon={<HomeOutlined />}>
        //                 <Link to="/Home">SocialNetwork</Link>
        //             </Menu.Item>
        //             <Menu.Item key="1" icon={<UserOutlined />}>
        //                 <Link to="/account">Account</Link>
        //             </Menu.Item>
        //             <Menu.Item key="2" icon={<CloudOutlined />}>
        //                 <Link to="/storage">Storage</Link>
        //             </Menu.Item>
        //             <Menu.Item key="3" icon={<TeamOutlined />}>
        //                 <Link to="/friends">Friends</Link>
        //             </Menu.Item>
        //         </Menu>
        //     </Sider>
        //     <Layout className="site-layout">
        //         <Header className="site-layout-background" style={{ padding: 0 }} />
        //         <Content style={{ margin: '0 16px' }}>
        //             <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
        //                 {/*<AccountPage/>*/}
        //             </div>
        //         </Content>
        //     </Layout>
        // </Layout>

        // <Layout>
        //     <Header>
        //         <div className="logo" />
        //         <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
        //             <Menu.Item key="1"><Link to="/account">Account</Link></Menu.Item>
        //             <Menu.Item key="2"><Link to="/storage">Storage</Link></Menu.Item>
        //             <Menu.Item key="3"><Link to="/friends">Friends</Link></Menu.Item>
        //         </Menu>
        //     </Header>
        //     <Content className="content">
        //         {/* 页面内容 */}
        //     </Content>
        // </Layout>



        // <div>
        //     <Button onClick={handleButtonClickToPage} >
        //         Go to AccountPage
        //     </Button>
        //     <Button onClick={ handleButtonClickToStorage}>
        //         Go to Storage
        //     </Button>
        //     <Button onClick={ handleButtonClickToFriends}>
        //         Go to FriendPage
        //     </Button>
        //
        // </div>
        <></>
    );
}

export default Home;
