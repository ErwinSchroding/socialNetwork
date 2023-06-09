// import {Modal} from "antd";
// import React from "react";

//提示框，即使抽象出来也要在父组件中实现回调函数，故暂时未抽象。
// 采取新的逻辑实现，实现组件为 MyModal.js

//
// function PromtBox(){
//
//
//     const handleOk = () => {
//         setIsVisible(false);
//     };
//     const handleCancel = () => {
//         setIsVisible(false);
//     };
//
//
//     return(
//         <>
//             <Modal
//                 title="提示"
//                 open={true}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//                 style={{ borderRadius: "4px", background: "#202229" }} // 设置浮层的样式
//                 width={520} //设置浮层的宽度
//                 centered={true} //垂直居中显示
//                 closable={true} //是否显示右上角关闭按钮 默认显示true
//                 // closeIcon = {} //自定义关闭按钮
//                 mask={true} //是否显示遮罩 默认显示true
//                 maskCloseable={false} //点击遮罩是否关闭 默认关闭true
//                 maskStyle={{ background: "rgba(0, 0, 0, 0.85)" }} //遮罩样式
//                 okText="确认"
//                 cancelText="取消"
//                 // footer={
//                 //     <div>
//                 //         <button onClick={handleOk}>OK</button>
//                 //     </div>
//                 // }
//             >
//                 <div style={{ color: "rgb(211,32,32)" }}>{`你的账户还没有加入系统，注册信息失败！`}</div>
//             </Modal>
//         </>
//     )
// }
//
// export default PromtBox;