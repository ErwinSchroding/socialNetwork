//用于展示个人资料。

import {Descriptions} from 'antd';
import {useState} from "react";

function UserProfileDisplay({data}) {


    const account = data.account;
    const name = data.name;
    const age = data.age;
    const email = data.email;
    const isVerified = data.isVerified;


    console.log(data.name);


    return (
        <>


            <Descriptions title="User Info">
                <Descriptions.Item label="User Account">{account}</Descriptions.Item>
                <Descriptions.Item label="User Name">{name}</Descriptions.Item>
                <Descriptions.Item label="User Age">{age}</Descriptions.Item>
                <Descriptions.Item label="User Email">{email}</Descriptions.Item>
                <Descriptions.Item
                    label="IsVerified">{isVerified ? "用户已经完善信息" : "用户未验证身份"}</Descriptions.Item>

                {/*<Descriptions.Item label="Remark">empty</Descriptions.Item>*/}
                {/*<Descriptions.Item label="Address">*/}
                {/*    No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China*/}
                {/*</Descriptions.Item>*/}
            </Descriptions>

        </>


    )
}


export default UserProfileDisplay;