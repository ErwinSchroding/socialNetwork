import {useContract} from "../hooks/contract-hook";
import {useEffect, useState} from "react";
import {Button} from "antd";
import {List, Card, Avatar} from "antd";
import {useNavigate} from "react-router-dom";


function Explore() {
    const {contractInterfaceContract, account} = useContract();
    const [data, setData] = useState([]);
    const [tweetsAccountArray, setTweetsAccountArray] = useState(null); //需要获取推文的账户数组，包括自己的朋友和自己
    const [refresh, setRefresh] = useState(false);  //用于鼠标进入Card时引起重新渲染。

    const navigate = useNavigate()


    useEffect(() => {
        if (tweetsAccountArray !== null) {
            tweetsAccountArray.map(async (item) => {
                const senderProfile = await contractInterfaceContract.methods.interfaceGetProfileByAccount(item).call();
                const senderName = senderProfile['name'];
                console.log(item)
                let resultObj = {};
                contractInterfaceContract.methods.interfaceGetArticlesByAccount(item).call()
                    .then((result) => {
                        if (result !== null) {
                            result.map(item => {
                                console.log("result:", item)
                                //结构获得result中的信息
                                const {title, article} = item;
                                //用解构获得信息构建新的对象
                                resultObj = {
                                    name: senderName,
                                    title: title,
                                    article: article,
                                    avatar: 'https://i.pravatar.cc/150?img=3',
                                    hovered: false,
                                    account: item
                                };
                                console.log(resultObj)
                                //将对象插入数组中，组成对象数组
                                setData(data => data.concat(resultObj))
                            })


                        }
                    })
            })
        }
        //console.log(data)
        //这里的输出是空白的
        //在 React 中，useState 和 useEffect 都是异步的，它们在更新状态之后不会立即生效，而是会等待下一次渲染才会更新。
        // 因此，在 useEffect 中更新 data 状态后，console.log(data) 不会立即输出更新后的值，而是输出更新之前的值。


    }, [tweetsAccountArray])

    const buttonGetFriends = async () => {
        setData([]);
        await contractInterfaceContract.methods.interfaceGetFriendsByAccount(account).call().then((result) => {
            // console.log(typeof result)
            //返回可以通过result[1] result['1']获取。结果看起来是数组，但是typeof是对象，不过数组也是特殊的对象。
            console.log(result);
            const r = [...result, account];
            //在结果中加入自己的账户
            setTweetsAccountArray(r)

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


    return (
        <>
            <Button onClick={buttonGetFriends}> 展开 </Button>
            <h2>Explore</h2>


            <List
                grid={{gutter: 16, column: 1}}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Card
                            // onClick={()=>{buttonCardHandler(item)}}
                            onMouseEnter={() => handleCardMouseEnter(item)}
                            onMouseLeave={() => {
                                handleCardMouseLeave(item)
                            }}
                            style={{backgroundColor: item.hovered ? "#c4d0a7" : "#cadcc7"}}
                        >
                            <Card.Meta

                                avatar={<Avatar src={item.avatar}/>}
                                title={item.name}
                                description={`主题: ${item.title}`}

                            >

                            </Card.Meta>
                            <div>
                                <p style={{ whiteSpace: 'pre-line' }}>{`内容: ${item.article}`}</p>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default Explore;