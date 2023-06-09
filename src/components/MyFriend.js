import {useContract} from "../hooks/contract-hook";
import {useEffect, useState} from "react";
import {Button} from "antd";
import {List, Card, Avatar} from "antd";
import {useNavigate} from "react-router-dom";


function MyFriend() {
    const {contractInterfaceContract, account} = useContract();
    const [data, setData] = useState([]);
    const [friendsAddressArray, setFriendsAddressArray] = useState(null);
    const [refresh,setRefresh] = useState(false);  //用于鼠标进入Card时引起重新渲染。

    const navigate = useNavigate()



    useEffect(() => {
        if (friendsAddressArray !== null) {
            friendsAddressArray.map((item) => {
                console.log(item)
                let resultObj = {};
                contractInterfaceContract.methods.interfaceGetProfileByAccount(item).call()
                    .then((result)=>{
                        //结构获得result中的信息
                        const {name,age} = result;
                        //用解构获得信息构建新的对象
                        resultObj = {name:name, age:age, avatar: 'https://i.pravatar.cc/150?img=3',hovered:false,account:item};
                        //将对象插入数组中，组成对象数组
                        setData(data => data.concat(resultObj))

                    } )
            })
        }
        //console.log(data)
        //这里的输出是空白的
        //在 React 中，useState 和 useEffect 都是异步的，它们在更新状态之后不会立即生效，而是会等待下一次渲染才会更新。
        // 因此，在 useEffect 中更新 data 状态后，console.log(data) 不会立即输出更新后的值，而是输出更新之前的值。


    }, [friendsAddressArray])

    const buttonGetFriends = async () => {
        setData([]);
        await contractInterfaceContract.methods.interfaceGetFriendsByAccount(account).call().then((result) => {
            // console.log(typeof result)
            //返回可以通过result[1] result['1']获取。结果看起来是数组，但是typeof是对象，不过数组也是特殊的对象。
            console.log(result);

            setFriendsAddressArray(result)

        })
    }

    function handleCardMouseEnter(item) {
        //console.log("handleCardMouseEnter")
        item.hovered = true;
        setRefresh(r => !r)



    }

    function handleCardMouseLeave(item) {
        //console.log("handleCardMouseEnter")
        item.hovered = false;
        setRefresh(r => !r)

    }


    const buttonCardHandler = (item) =>{

        navigate('/friends/chat', { state: { friendAccount: item.account } })
        console.log(item)
    }

    return (
        <>
            <Button onClick={buttonGetFriends}> 查看朋友列表 </Button>
            <h2>MyFriend</h2>
            <h1>点击好友卡片即可发送私信</h1>

            <List
                grid={{gutter: 16, column: 3}}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card
                            onClick={()=>{buttonCardHandler(item)}}
                            onMouseEnter={() => handleCardMouseEnter(item)}
                            onMouseLeave={()=>{handleCardMouseLeave(item)}}
                            style={{ backgroundColor: item.hovered ? "#24c713" : "#8fbd87" }}
                        >
                            <Card.Meta

                                avatar={<Avatar src={item.avatar}/>}
                                title={item.name}
                                description={`Age: ${item.age}`}
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default MyFriend;