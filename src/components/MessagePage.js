import {useContract} from "../hooks/contract-hook";
import {Avatar, Button, Card, List} from "antd";
import {useEffect, useState} from "react";


function MessagePage(){

    const {contractInterfaceContract,account,address} = useContract();
    const [refresh,setRefresh] = useState(false);  //用于鼠标进入Card时引起重新渲染。
    const [msgAccount,setMsgAccount] = useState([]); //记录所有给本账户发送过信息的用户
    const [data,setData] = useState([]);


    useEffect(() => {
        if (msgAccount !== null) {

            msgAccount.map(async (item) => {
                // 每个item都是一个account地址
                //console.log(item)
                 const senderProfile =  await contractInterfaceContract.methods.interfaceGetProfileByAccount(item).call();
                 const senderName = senderProfile['name'];
                 await contractInterfaceContract.methods.interfaceGetMessagesByAccount(account,item).call()
                    .then((result)=>{
                        if(result !== null)
                        {
                            result.map((item)=>{
                                console.log(item);
                                let resultObj = {};
                                //结构获得item中的信息
                                const {sender,content,timestamp} = item;
                                //用解构获得信息构建新的对象
                                resultObj = {senderName:senderName,sender:sender, content:content, avatar: 'https://i.pravatar.cc/150?img=3',hovered:false,time:timestamp};
                                //将对象插入数组中，组成对象数组
                                setData(data => data.concat(resultObj))
                            })
                        }

                    } )
            })
        }

        //console.log(data)
        //这里的输出是空白的
        //在 React 中，useState 和 useEffect 都是异步的，它们在更新状态之后不会立即生效，而是会等待下一次渲染才会更新。
        // 因此，在 useEffect 中更新 data 状态后，console.log(data) 不会立即输出更新后的值，而是输出更新之前的值。



    }, [msgAccount])

    const handlerGetMessage = async ()=>{
        setData([]);
        await contractInterfaceContract.methods.interfaceGetMsgAccountByAccount(account).call()
            .then((r)=>{
               // console.log(r)
                setMsgAccount(r)

            })

    }
    function handleCardMouseEnter(item) {
        //console.log("handleCardMouseEnter")
        setRefresh(r => !r)

        item.hovered = true;

    }

    function handleCardMouseLeave(item) {
        //console.log("handleCardMouseEnter")


        item.hovered = false;
        setRefresh(r => !r)
    }


    return(
        <>
            <Button onClick={handlerGetMessage}> 查看消息 </Button>

            <List
                grid={{gutter: 16, column: 1}}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card
                            onClick={()=>{}}
                            onMouseEnter={() => handleCardMouseEnter(item)}
                            onMouseLeave={()=>{handleCardMouseLeave(item)}}
                            style={{ backgroundColor: item.hovered ? "#24c713" : "#8fbd87" }}
                        >
                            <Card.Meta

                                avatar={<Avatar src={item.avatar}/>}
                                title={item.senderName}
                                description={`消息: ${item.content}`}
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default MessagePage;