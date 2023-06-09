import {Button, Input} from "antd";
import {SendOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useContract} from "../hooks/contract-hook";

function Publish() {

    const [content, setContent] = useState();
    const [title, setTitle] = useState();
    const {contractInterfaceContract,account,address} = useContract();

    const handleSendMessage = () => {
        contractInterfaceContract.methods.interfaceSendArticlesByAccount(account,title,content).send({
            from:address
        })


        console.log("发布成功")


    }

    const onContentInputChange = (e) => {
        setContent(e.target.value);

    }
    const onTitleInputChange = (e) => {
        setTitle(e.target.value)
    }


    return (
        <>
            <Input value={title} allowClear={true} onChange={onTitleInputChange} placeholder="标题"/>
            <Input.TextArea value={content} allowClear={true} onChange={onContentInputChange} placeholder="请输入内容"/>
            <Button onClick={handleSendMessage} icon={<SendOutlined/>}>发送</Button>
        </>
    )
}

export default Publish;