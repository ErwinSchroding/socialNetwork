import React, {createContext, useContext, useEffect, useState} from "react";
import Web3 from 'web3';
import StorageJson from '../build/Storage.json'
import SocialJson from '../build/SocialNetwork.json'
import InterfaceContractJson from '../build/InterfaceContract.json'


const ContractContext = createContext();


export default function ContractProvider({children}) {
    const [contractStorage, setContractStorage] = useState(null);
    const [contractSocialNetwork, setcontractSocialNetwork] = useState(null);
    const [contractInterfaceContract, setcontractInterfaceContract] = useState(null)
    const [address, setAddress] = useState("");
    const [account, setAccount] = useState("");


    //console.log("渲染")
    async function getSmartContract() {
        if (window.ethereum) {
            var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
            //切换网络后记得切换metamask连接的链
            //授权
            const address = await window.ethereum.enable()
            console.log("以授权登录的账户：", address[0]) //注意是account[0]
            setAddress(address[0])
            //获取networkID
            const networkID = await web3.eth.net.getId()
            console.log("网络ID；", networkID)

            const contractStorage = await new web3.eth.Contract(StorageJson.abi, StorageJson.networks[networkID].address)
            //console.log(StorageContract)
            setContractStorage(contractStorage)
            //此处新增需要链接的只能合约对象，并通过对象导出，在需要的组件处析构即可。

            const contractSocialNetwork = await new web3.eth.Contract(SocialJson.abi, SocialJson.networks[networkID].address)
            //console.log(StorageContract)
            setcontractSocialNetwork(contractSocialNetwork)

            const contractInterfaceContract = await new web3.eth.Contract(InterfaceContractJson.abi, InterfaceContractJson.networks[networkID].address)
            setcontractInterfaceContract(contractInterfaceContract);

            //如下是连接部署在测试网络Mordor上的智能合约
            // const abi = [{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"retrieve","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"store","inputs":[{"type":"uint256","name":"num","internalType":"uint256"}]}]
            // const MordorContractStorage = await new web3.eth.Contract(abi, "0xAd6EDB78e05E04b9C8082D974943a89aCF8F8E94")
            // console.log(MordorContractStorage)
            // setMordorContractStroage(MordorContractStorage)
        } else {
            console.log('请安装MetaMask插件来连接到以太坊区块链');
        }
    }

    useEffect(() => {
        if (address === "") {
            console.log("hooks初始化智能合约中")
            getSmartContract();
            //在getSmartContract中调用的set方法时，均会导致页面重新渲染，但是实验证明该effect只会执行一次
            //可能的原因是，如果是uesEffect函数本身导致自己的依赖的改变，则不会去再次执行Effect，防止无限循环
        }


    }, [contractInterfaceContract])

    useEffect(() => {
        if (address !== "") {
            console.log("hooks初始化智能合约完成, address = ", address)
            contractInterfaceContract.methods.interfaceGetAccountByAddress(address).call()
                .then(result => {
                        console.log("账户地址为：",result)
                        setAccount(result)
                    }
                )
        }


    }, [contractInterfaceContract])


    return (
        <ContractContext.Provider
            value={{address, account, contractStorage, contractSocialNetwork, contractInterfaceContract}}>
            {children}
        </ContractContext.Provider>
    )
}


export const useContract = () => useContext(ContractContext)
//当使用 useContext(ContractContext) 时，React 将会在组件树中查找最近的 ContractContext.Provider，并返回它的 value 属性。
// value 属性通常被设置为一个对象，包含了与合约交互所需的函数和数据。