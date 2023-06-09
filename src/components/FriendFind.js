import {useContract} from "../hooks/contract-hook";

import FindFriendForm from "./common/FindFriendForm";
import {useEffect, useState} from "react";
import UserProfileDisplay from "./common/UserProfileDisplay";
import MyModal from "./common/MyModal";
import {Button} from "antd";

export default function FriendFind() {

    const {contractInterfaceContract, account,address} = useContract();

    const [userProfileDisplay, setUserProfileDisplay] = useState(false);
    const [myModal,setMyModal] = useState(false);
    const [myModalMsg,setMyModalMsg] = useState("");
    const [data, setData] = useState(null);
    const [friendAccount,setFriendAccount] = useState("")



    useEffect(()=>{


    },[])


    // 这是传递给FindFriendForm的回调函数
    const handleFormSubmit = async (values) => {

        setUserProfileDisplay(false)
        console.log(values.userAccount)
        setFriendAccount(values.userAccount)
        const userAccount = values.userAccount;
        // console.log("渲染")

        await contractInterfaceContract.methods.interfaceGetProfileByAccount(userAccount).call()
            .then((result) => {
                const data = {...result,account:userAccount}
                setData(data)
                setUserProfileDisplay(true)
                console.log(result)
            })
            .catch((error) => {
                if (error.message.includes('Your Find\'s Address doesn\'t exist')) {
                    setMyModalMsg("你的朋友地址不存在!");

                    setMyModal(true);
                    console.log('你的朋友地址不存在！');

                }else if(error.message.includes('bad address checksum')) {
                    //报错貌似不是在该页被捕获,无法正确显示错误提示，请使用控制台查看
                    setMyModalMsg("请输入正确的地址");
                    setMyModal(true);
                    console.log('你的朋友地址不存在！');
                }else if(error.message.includes('The account you want to get profile hasn\'t registered')){
                    setMyModalMsg("你的朋友地址正确，但是Ta还没有完善信息！");

                    setMyModal(true);

                    console.log('你的朋友地址正确，但是Ta还没有完善信息！');
                }
                else {
                    //console.log(typeof error)
                    console.log("错误",error.message)
                }
            })

        // await contractSocialNetwork.methods.getUserProfile(userAddress).call()
        //     .then((result) => {
        //         //console.log(typeof result)  //Object
        //         //console.log(result)  //返回的东西既不是对象也不是数组，但是可以用访问对象的方式去访问，姑且当作对象吧
        //         const data = {...result,account:userAddress}
        //         console.log(data)
        //         setData(data)
        //         setIsVisible(true)
        //     })
        //     .catch((error) => {
        //         if (error.message.includes('Your Find\'s Address doesn\'t exist')) {
        //             console.log('你的朋友地址不存在！');
        //         } else {
        //             //console.log(typeof error)
        //             console.log(error)
        //         }
        //     })


    }

    const  buttonAddFriendHandle = async ()=>{
        await contractInterfaceContract.methods.interfaceAddFriend(account,friendAccount,"Hello").send({
            from : address
        })
            .then(()=>{
                setMyModalMsg("添加成功")
                setMyModal(true)
            })
            .catch((error)=>{
            if(error.message.includes("Friend account not registered")){
                setMyModalMsg("你添加的朋友账户存在，但暂未完善用户信息。")
                setMyModal(true)
                console.log("你添加的朋友账户存在，但暂未完善用户信息。")

            }else if(error.message.includes("Cannot add yourself as a friend")){
                setMyModalMsg("你不能添加自己为好友")
                setMyModal(true)
                console.log("你不能添加自己为好友")

            }else if(error.message.includes("He/She is already friend")){
                setMyModalMsg("Ta 已经是你的朋友了，无需重复添加")
                setMyModal(true)
                console.log("Ta 已经是你的朋友了，无需重复添加")

            }else{
                console.log(error)
            }

        })


    }



    const myModalOnClose = ()=>{
        setMyModal(false);
    }


    return (
        <>
            <FindFriendForm onSubmit={handleFormSubmit}/>
            <Button onClick={buttonAddFriendHandle} > Add this friend </Button>
            {userProfileDisplay ? <UserProfileDisplay data={data}/> : null}
            {myModal? < MyModal title={"提示"} msg={myModalMsg} onClose={myModalOnClose}/> : null}

        </>
    )
}

