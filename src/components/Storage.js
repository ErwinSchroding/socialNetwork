import React, {useRef, useState } from "react";
//import smartContractModule from '../initContractModule.js';
import { Button } from "antd";
import { useContract } from "../hooks/contract-hook";

export default function Storage() {
    const [ , setreFresh] = useState(false)
    //const [contract, setContract] = useState(null)
    //const [account, setAccount] = useState(null)
    const [storeNumber,setSoreNumber] = useState(0)
    const {contractStorage , account ,contractSocialNetwork} = useContract();
    const numberToStore = useRef()


    console.log(contractStorage)
    console.log(contractSocialNetwork)

    const store = async (number) => {

        // const isValidAddress = web3.utils.isAddress(account);
        // if (!isValidAddress) {
        //     console.log("Invalid Ethereum address:", account);
        //     return;
        // } else {
        //     console.log("Right Ethereum address:", account);
        // }
        //const num = number.parseInt()
        await contractStorage.methods.store(number).send({
            from: account
        })
    }

    const retrieve = async () => {
        // 构造智能合约对象


        // 调用视图函数，获取number的值
        const value = await contractStorage.methods.retrieve().call();
        setSoreNumber(value)
        console.log('Number:', value);
    };

    const submit = ()=>{
        // console.log("你提交的数字为",numberToStore.current.value)
        store(numberToStore.current.value).then(r => console.log(r))
    }

    return (
        <>
            <div>account = {account}</div>
            <button onClick={setreFresh}> click to refresh </button>

            <Button onClick={retrieve}>Retrieve {storeNumber} </Button>

            <form onSubmit={submit}>
                <input ref = {numberToStore} type = "text" placeholder="number store" required/>
                <Button onClick={submit}> Submint </Button>
            </form>

        </>

    )
}