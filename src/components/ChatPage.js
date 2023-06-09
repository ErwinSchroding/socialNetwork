//此页面产生使用Ref控制输入，而不是使用其他组件


import React, {useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useContract} from "../hooks/contract-hook";
import {Button, Input} from "antd";
import {SendOutlined} from "@ant-design/icons";

function ChatPage() {
    const [message, setMessage] = useState("");
    //存储当前页面发送的所有字符串，并使用数组map方法生成li在页面展示


    const {contractInterfaceContract, account,address} = useContract();

    const navigate = useNavigate()


    const location = useLocation();
    const friendAccount = location.state?.friendAccount;
    // 获取navigate函数第二参数传递的数据

    //console.log("渲染")
    // 每次输入后的OnChange会导致重新渲染，但是Ref无法使用，故不得不妥协


    const handleSendMessage = async () => {



        // console.log("信息；",message)
        // console.log("你的账户：",account)
        // console.log("好友账户："friendAccount)
        await contractInterfaceContract.methods.interfaceSendMessageByAccount(account,friendAccount,message).send({
            from: address
        })
            .then(()=>{
                console.log("发送成功")
            })
            .catch(error => {
            if (error.message.includes("Your friend request has not been approved")) {
                console.log("你的好友申请还没被通过，请通知对方同意好友申请");
                // setModalMsg("此地址已经加入，加入失败！");
                // setMyModal(true)

            } else {
                console.log(error);

            }
        })

        navigate('/friends')


        





        //console.log(messages)

        // React 在执行更新时会将多个 setState 调用合并为一个批量更新，以提高性能。这种批量更新机制被称为“合成事件”。

        // 当执行 setState 函数时，React 并不会立即更新组件的状态，而是将更新操作加入到更新队列中等待执行。React 会在合适的时机（例如浏览器空闲时）执行更新队列中的更新操作，并重新计算组件的状态，并重新渲染组件。

        // 因此，有时候多个 setState 函数调用并不会导致多次渲染，而是将多个状态更新操作合并为一个更新操作，并通过一次渲染完成所有状态更新的页面。这种机制可以提高页面的性能，减少不必要的渲染。

    };



    const onInputChange=(event)=>{
        setMessage(event.target.value)

    }

    return (
        <>
            <Input.TextArea value={message}  allowClear={true} onChange={onInputChange} placeholder="请输入消息"/>
            <Button onClick={handleSendMessage} icon={<SendOutlined/>}>发送</Button>
        </>
    )


}

export default ChatPage;
