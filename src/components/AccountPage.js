import React, {useEffect, useState} from "react";
import {useContract} from "../hooks/contract-hook";
import {Button, Layout, Menu, Modal} from "antd";
import {Link, useNavigate} from "react-router-dom";
import UserProfileDisplay from "./common/UserProfileDisplay";
import MyModal from "./common/MyModal";
import Sider from "antd/es/layout/Sider";
import {CloudOutlined, HomeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {Content, Header} from "antd/es/layout/layout";

export default function AccountPage() {

    const {contractSocialNetwork, contractInterfaceContract, account, address} = useContract();
    const [myAccount, setMyAccount] = useState("")
    const [isBoxVisible, setIsBoxVisible] = useState(false);
    const [data, setData] = useState(false);
    const [isVisible, setIsVisible] = useState(false)
    const [myModal, setMyModal] = useState(false)
    const [myModalWithRefresh, setMyModalWithRefresh] = useState(false)
    const [modalMsg, setModalMsg] = useState("");
    const handleOk = () => {
        setIsBoxVisible(false);
    };
    const handleCancel = () => {
        setIsBoxVisible(false);
    };
    const navigate = useNavigate()


    // console.log(contractSocialNetwork)
    // console.log(contractInterfaceContract)

    useEffect(() => {
        //console.log("渲染")
        //事件逻辑更改，已统一返回msg，而非复杂的status信息。
        const joinEventHandler = contractInterfaceContract && contractInterfaceContract.events.interfaceJoinEvent().on('data', function (data) {
            let status = data.returnValues['status'];
            // console.log(typeof status)   //不知为什么这里会返回字符串,可能是Web3.js 会自动将 Solidity 事件返回值转换成 JavaScript 对象，并将其中的整数类型转换成字符串类型
            if (status === "1") {
                console.log("加入成功")
            } else if (status === "0") {
                console.log("该账户已经加入")
            }
            // console.log(event.returnValues['status']);
        })


        return () => {
            // console.log("监听事件取消订阅")
            if (joinEventHandler)
                joinEventHandler.unsubscribe();
        };

    }, [contractInterfaceContract])

    //刷新执行逻辑：刷新后Contract的hooks需要重新新建智能合约，而hooks中的合约初始化为null，且由其中的useEffect赋值
    // 所以此时contractSocialNetwork初始化为null，之后打印，之后执行useEffect，
    //由于初始化为空，则joinEventHandler为空。
    //之后Contract的hooks初始化完成，修改上下文内容，迫使当前page组件重新渲染，此时将执行useEffect中的卸载函数，由于joinEventHandler为空，所以报错，故增加非空判断，
    // 之后useState获取新的合约值
    //由于合约变化，page组件的useEffect在重新渲染中重新执行。

    useEffect(() => {
        //console.log("GetProfile事件监听开始")
        //没有交易的函数的调用不会触发事件
        const GetProfileEventHandler = contractInterfaceContract && contractInterfaceContract.events.interfaceGetProfileByAddressEvent().on('data', function (data) {
            console.log("GetProfile事件发生")
            let msg = data.returnValues['msg'];
            console.log(msg)
            // console.log(event.returnValues['status']);
        }).on("error", console.error);

        console.log(GetProfileEventHandler)


        return () => {
            console.log("GetProfile事件监听取消")
            if (GetProfileEventHandler)
                GetProfileEventHandler.unsubscribe();
        };

    }, [contractInterfaceContract])

    useEffect(() => {
        console.log("joinEvent事件监听开始")
        //没有交易的函数的调用不会触发事件
        const joinEventHandler = contractInterfaceContract && contractInterfaceContract.events.interfaceJoinEvent().on('data', function (data) {
            console.log("joinEvent事件发生")
            let msg = data.returnValues['msg'];
            console.log(msg)
            // console.log(event.returnValues['status']);
        }).on("error", console.error);

        //console.log(joinEventHandler)


        return () => {
            console.log("joinEvent事件监听取消")
            if (joinEventHandler)
                joinEventHandler.unsubscribe();
        };

    }, [contractInterfaceContract])

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


    const join = async () => {
        await contractInterfaceContract.methods.interfaceJoin().send({
            from: address
        }).then(() => {
            setModalMsg("你的地址加入成功！");
            setMyModalWithRefresh(true)

        })
            .catch(error => {
                if (error.message.includes("this address has joined")) {
                    console.log("此地址已经加入，加入失败！");
                    setModalMsg("此地址已经加入，加入失败！");
                    setMyModal(true)

                } else {
                    console.log(error);

                }
            })


        // await contractSocialNetwork.methods.join().send({
        //     from:account
        // }).then((r) => console.log(r))
    }

    const getAccount = async () => {
        const myAccount = await contractInterfaceContract.methods.interfaceGetAccountByAddress(address).call();
        //避免hook没有更新，故手动读取account
        setMyAccount(myAccount);
        setIsBoxVisible(true);


    }

    const getProfile = async () => {
        await contractInterfaceContract.methods.interfaceGetProfileByAccount(account).call()
            .then(result => {
                const data = {...result, account: account}
                console.log(data);
                setData(data)
                setIsVisible(set => !set)
            }).catch((e) => {
                if (e.message.includes('The account you want to get profile hasn\'t registered')) {
                    console.log("用户未验证个人信息")
                    setModalMsg("用户未验证个人信息");
                    setMyModal(true)
                }

            })
    }

    const myModalOnCloseWithRefresh = () => {
        //调用join函数加入系统后，应该刷新页面来使hooks获取正确的account
        //使用metamask切换账号后也需要刷新页面
        if (window && window.location && window.location.reload) {
            window.location.reload();
        } else {
            console.error('无法刷新页面');
        }
        setMyModal(false);
    }

    const myModalOnClose = () => {

        setMyModal(false);
    }


    function toUserProfile() {
        navigate('/account/register')
    }

    return (

        <>
            <h1>Account Page</h1>

            <Button onClick={join}>
                加入
            </Button>

            <Button onClick={getAccount}>
                查看账户
            </Button>

            <Button onClick={toUserProfile}>
                完善信息
            </Button>

            <Button onClick={getProfile}>
                {isVisible ? "关闭" : "查看信息"}
            </Button>

            {isVisible ? <UserProfileDisplay data={data}/> : null}


            <h2> {myAccount} </h2>
            {myModal ? <MyModal title={"提示"} msg={modalMsg} onClose={myModalOnClose}/> : null}
            {myModalWithRefresh ? <MyModal title={"提示"} msg={modalMsg} onClose={myModalOnCloseWithRefresh}/> : null}
            {/*对话框会在关闭时自动刷新页面，目前针对Join而设计，为了刷新hooks而获取正确的account*/}

            <Modal
                title="提示"
                open={isBoxVisible}
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
                footer={
                    <div>
                        <button onClick={handleOk}>OK</button>
                    </div>
                }
            >
                <div style={{color: "rgb(211,32,32)"}}>{`你的个人账户为${myAccount}`}</div>
            </Modal>


        </>

    )
}

