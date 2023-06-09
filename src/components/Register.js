import {useContract} from "../hooks/contract-hook";
import RegisterForm from "./common/RegisterForm";
import UserProfileForm from "./common/UserProfileForm";
import React, {useEffect, useState} from "react";
import {Modal} from "antd";
import {useNavigate} from "react-router-dom";
import MyModal from "./common/MyModal";


export default function Register() {
    const {contractSocialNetwork, contractInterfaceContract, address} = useContract();
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate()

    const [myModal, setMyModal] = useState(false)
    const [myModalWithRefresh, setMyModalWithRefresh] = useState(false)
    const [modalMsg, setModalMsg] = useState("");
    const handleFormSubmit = async (values) => {


        let name = values['accountName']
        let email = values['accountEmail']
        let age = values['accountAge']
        //console.log(name,email,age)
        await contractInterfaceContract.methods.interfaceRegisterUser(name, email, age).send({
            from: address
        })
            .then(() => {
                console.log("信息更新成功")

                }
            )
            .catch(error => {
                if (error.message.includes('The adderss hasn\'t joined,Register failed')) {
                    console.log("你的账户还没有加入系统，注册信息失败！")
                    setIsVisible(true);
                } else {
                    console.log(error)
                }
            })

    }

    useEffect(() => {
        console.log("interfaceRegisterUserEvent事件监听开始")

        const interfaceRegisterUserEventHandler = contractInterfaceContract && contractInterfaceContract.events.interfaceRegisterUserEvent().on('data', function (data) {
            console.log("interfaceRegisterUserEvent事件发生")
            let msg = data.returnValues['msg'];
            console.log(msg)
            setModalMsg("信息添加完成");
            setMyModal(true);
        }).on("error", console.error);




        return () => {
            console.log("interfaceRegisterUserEvent事件监听取消")
            if (interfaceRegisterUserEventHandler)
                interfaceRegisterUserEventHandler.unsubscribe();
        };

    }, [contractInterfaceContract])

    function toAccount(){
        navigate('/account')
    }

    const handleOk = () => {
        setIsVisible(false);
    };
    const handleCancel = () => {
        setIsVisible(false);
    };
    const myModalOnClose = () => {

        setMyModal(false);
        toAccount();
    }



    return (
        <>
            <UserProfileForm onSubmit={handleFormSubmit}/>
            {myModal ? <MyModal title={"提示"} msg={modalMsg} onClose={myModalOnClose}/> : null}


            <Modal
                title="提示"
                open={isVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{borderRadius: "4px", background: "#202229"}} // 设置浮层的样式
                width={520} //设置浮层的宽度
                centered={true} //垂直居中显示
                closable={true} //是否显示右上角关闭按钮 默认显示true
                // closeIcon = {} //自定义关闭按钮
                mask={true} //是否显示遮罩 默认显示true
                maskCloseable={false} //点击遮罩是否关闭 默认关闭true
                maskStyle={{background: "rgba(0, 0, 0, 0.85)"}} //遮罩样式
                okText="确认"
                cancelText="取消"
                // footer={
                //     <div>
                //         <button onClick={handleOk}>OK</button>
                //     </div>
                // }
            >
                <div style={{color: "rgb(211,32,32)"}}>{`你的账户还没有加入系统，注册信息失败！`}</div>
            </Modal>
        </>
    )

}