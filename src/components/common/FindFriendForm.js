
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import {useEffect} from "react";
const FindFriendForm = ({onSubmit}) => {
    const onFinish = (values) => {
        //console.log('Received values of form: ', values);
        onSubmit(values);
    };

    useEffect(()=>{console.log("This is FindFriendForm")},[])
    //console.log("This is FindFriendForm")



    //如果想将表单数据传递给父组件，您可以使用回调函数的方式，在子组件中调用父组件传递的回调函数，并将表单数据作为参数传递给该回调函数。
    return (
        <Form
            name="add-friend"
            className="add-friend-from"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="userAccount"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Friend\'s account!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Account" />
            </Form.Item>



            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Find!
                </Button>
            </Form.Item>
        </Form>
    );
};
export default FindFriendForm;
