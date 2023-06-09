//简单的提示box

import { Button, Modal } from 'antd';
import { useState } from 'react';

const MyModal = ({title="title",msg="msg",onClose=()=>{ }}) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const showModal = () => {
        onClose();
        //setIsModalOpen(true);
    };
    const handleOk = () => {
        onClose();
        //setIsModalOpen(false);
    };
    const handleCancel = () => {
        //setIsModalOpen(false);
    };


    return (
        <>
            {/*<Button type="primary" onClick={showModal}>*/}
            {/*    Open Modal*/}
            {/*</Button>*/}
            <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {/*<p>{title}</p>*/}
                <p>{msg}</p>
                {/*<p>Some contents...</p>*/}
            </Modal>
        </>
    );
};
export default MyModal;



// 回调函数onClose的函数，请在父组件中定义好MyModal和setMyModal，并实现这个函数，然后将函数传递给该子组件实现父组件对该组件的控制
// const myModalOnClose = ()=>{
//     setMyModal(false);
// }