import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {CloudOutlined, MehOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import ButtonGroup from "antd/es/button/button-group";

function FriendPage(){

    const navigate = useNavigate()


    const handleButtonClickToFriendFind = () => {
        navigate('/friends/find')
    };

    const handleButtonClickToMyFriend = ()=>{
        navigate('/friends/myfriend')
    }

    const handleButtonClickToMyFriendRequests = ()=>{
        navigate('/friends/requests')
    }

    const handleButtonClickToMyFriendMessage = ()=>{
        navigate('/friends/msg')
    }


    return(
        <>
            <h2>Friend Page</h2>

            <ButtonGroup variant="contained" spacing={20}>
                <Button onClick={handleButtonClickToFriendFind}  icon={<SearchOutlined />} >
                    搜索
                </Button>
                <Button onClick={ handleButtonClickToMyFriend} icon = {<UserOutlined />}>
                    我的好友
                </Button>
                <Button onClick={ handleButtonClickToMyFriendRequests} icon = {<MehOutlined />}>
                    好友申请
                </Button>
                <Button onClick={ handleButtonClickToMyFriendMessage} icon = {<MehOutlined />}>
                    好友消息
                </Button>

            </ButtonGroup>



        </>

    )

}

export default FriendPage;