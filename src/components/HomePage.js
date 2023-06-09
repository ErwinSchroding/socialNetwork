import { Button, Layout, Menu } from 'antd';
import '../style/HomePage.css'
import { Link, useNavigate } from "react-router-dom";
import { CloudOutlined, HomeOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import AccountPage from "./AccountPage";
import {useState} from "react";

const { Header, Sider, Content } = Layout;

function HomePage() {
    const navigate = useNavigate()

    const handleButtonClickToPage = () => {
        navigate('/account')
    };

    const handleButtonClickToStorage = () => {
        navigate('/storage')
    }

    const handleButtonClickToFriends = () => {
        navigate('/friends')
    }

    const [containerStyle, setContainerStyle] = useState({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    });

    return (
        <div style={containerStyle}>
            <Button onClick={handleButtonClickToPage} >
                Go to Account Page
            </Button>
            <Button onClick={handleButtonClickToStorage} >
                Go to Storage
            </Button>
            <Button onClick={handleButtonClickToFriends}>
                Go to Friend Page
            </Button>
        </div>
    );
}

export default HomePage;
