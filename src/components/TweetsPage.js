import {useNavigate} from "react-router-dom";
import ButtonGroup from "antd/es/button/button-group";
import {Button} from "antd";
import {MehOutlined, SearchOutlined, SendOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";

function TweetsPage(){

    const navigate = useNavigate()


    const handleButtonClickToPublish= () => {
        navigate('/tweets/publish')
    };

    const handleButtonClickToExplore= ()=>{
        navigate('/tweets/explore')
    }




    return(
        <>
            <h2>Publish Page</h2>

            <ButtonGroup variant="contained" spacing={20}>

                <Button onClick={ handleButtonClickToPublish} icon = {<SendOutlined />}>
                    发布推文
                </Button>

                <Button onClick={handleButtonClickToExplore}  icon={<SearchOutlined />} >
                    探索
                </Button>




            </ButtonGroup>



        </>

    )

}

export default TweetsPage;