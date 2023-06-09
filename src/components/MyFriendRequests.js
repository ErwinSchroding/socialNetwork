import {useContract} from "../hooks/contract-hook";
import React, {useEffect, useState} from "react";
import {Button} from "antd";
import {List, Card, Avatar} from "antd";
import {useNavigate} from "react-router-dom";
import MyModal from "./common/MyModal";


function MyFriendRequests() {
    const {contractInterfaceContract, account, address} = useContract();
    const [data, setData] = useState([]);
    const [friendsAddressArray, setFriendsAddressArray] = useState(null);
    const [refresh, setRefresh] = useState(false);  //用于鼠标进入Card时引起重新渲染。

    const [myModal, setMyModal] = useState(false);
    const [myModalMsg, setMyModalMsg] = useState("");


    const navigate = useNavigate()
    const data1 = [
        {

            name: 'Alice',
            age: 30,
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {

            name: 'Bob',
            age: 25,
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
        {

            name: 'Charlie',
            age: 35,
            avatar: 'https://i.pravatar.cc/150?img=3',
        },
    ];


    useEffect(() => {
        if (friendsAddressArray !== null) {
            friendsAddressArray.map((item) => {
                console.log(item)
                let resultObj = {};
                contractInterfaceContract.methods.interfaceGetProfileByAccount(item).call()
                    .then((result) => {
                        //结构获得result中的信息
                        const {name, age} = result;
                        //用解构获得信息构建新的对象
                        resultObj = {
                            name: name,
                            age: age,
                            avatar: 'https://i.pravatar.cc/150?img=3',
                            hovered: false,
                            account: item
                        };
                        //将对象插入数组中，组成对象数组
                        setData(data => data.concat(resultObj))

                    })
            })
        }
        console.log(data)


    }, [friendsAddressArray])

    const buttonGetFriends = async () => {
        setData([]);
        await contractInterfaceContract.methods.interfaceGetFriendRequestsByAccount(account).call().then((result) => {
            // console.log(typeof result)
            //返回可以通过result[1] result['1']获取。结果看起来是数组，但是typeof是对象，不过数组也是特殊的对象。
            console.log(result);

            setFriendsAddressArray(result)

        })
    }

    function handleCardMouseEnter(item) {
        //console.log("handleCardMouseEnter")
        setRefresh(r => !r)

        item.hovered = true;

    }

    function handleCardMouseLeave(item) {
        //console.log("handleCardMouseEnter")
        setRefresh(r => !r)
        item.hovered = false;
    }


    const buttonCardHandler = (item) => {

        navigate('/friends/chat', {state: {friendAccount: item.account}})
        //传递item.account的值，chat界面通过friendAccount获取

        //console.log(item)
    }

    //卡片上的按钮，用于接收好友申请，接受后成为双向好友。
    const handleButtonAcceptRequests = async (item) => {
        //console.log(item);
        const {account: friendAccount} = item;
        //console.log(account)
        await contractInterfaceContract.methods.interfaceAddFriend(account, friendAccount, "Hello").send({
            from: address
        })
            .then(() => {
                setMyModalMsg("接受成功 Ta 已经是你的朋友了")
                setMyModal(true)
                console.log("接受成功 Ta 已经是你的朋友了")
            })


            .catch((error) => {
                if (error.message.includes("Friend account not registered")) {
                    setMyModalMsg("你添加的朋友账户存在，但暂未完善用户信息。")
                    setMyModal(true)
                    console.log("你添加的朋友账户存在，但暂未完善用户信息。")

                } else if (error.message.includes("Cannot add yourself as a friend")) {
                    setMyModalMsg("你不能添加自己为好友")
                    setMyModal(true)
                    console.log("你不能添加自己为好友")

                } else if (error.message.includes("He/She is already friend")) {
                    setMyModalMsg("Ta 已经是你的朋友了，无需重复同意")
                    setMyModal(true)
                    console.log("Ta 已经是你的朋友了，无需重复添加")

                } else {
                    console.log(error)
                }

            })


    }
    const myModalOnClose = () => {
        setMyModal(false);
    }


    return (
        <>
            <Button onClick={buttonGetFriends}> 查看好友申请 </Button>
            <h2>你收到的申请</h2>
            {myModal ? < MyModal title={"提示"} msg={myModalMsg} onClose={myModalOnClose}/> : null}


            <List
                grid={{gutter: 16, column: 3}}
                dataSource={data}
                // 对data的便利
                renderItem={item => (
                    <List.Item>
                        <Card
                            // onClick={() => {
                            //     buttonCardHandler(item)
                            // }}
                            onMouseEnter={() => handleCardMouseEnter(item)}
                            onMouseLeave={() => {
                                handleCardMouseLeave(item)
                            }}
                            style={{backgroundColor: item.hovered ? "#24c713" : "#8fbd87"}}
                        >
                            <Card.Meta

                                avatar={<Avatar src={item.avatar}/>}
                                title={item.name}
                                description={`Age: ${item.age}`}

                            />
                            <Button style={{position: "absolute", right: "16px", bottom: "16px"}} onClick={(event) => {
                                event.stopPropagation();
                                handleButtonAcceptRequests(item)
                            }}>同意</Button>
                            {/*而在React中，事件会向上传递到父组件，也就是Card组件。*/}
                            {/*要防止这种情况发生，可以在按钮的onClick事件中调用event.stopPropagation()方法，阻止事件继续向上传递*/}
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default MyFriendRequests;