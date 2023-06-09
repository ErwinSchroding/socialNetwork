
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import {useState} from "react";
const UserProfileForm = ({onSubmit}) => {
    const [form] = Form.useForm();
    const clearForm = () => {
        //console.log("clear form")
        form.resetFields(); // 调用 resetFields 方法清空表单

    };
    const onFinish = (values) => {
        //console.log('Received values of form: ', values);
        onSubmit(values);
    };

    //如果想将表单数据传递给父组件，您可以使用回调函数的方式，在子组件中调用父组件传递的回调函数，并将表单数据作为参数传递给该回调函数。
    return (
        // name 属性用于给表单设置一个名称，方便在提交表单、重置表单等操作时进行标识。比如，在提交表单时，我们可以通过 onFinish 回调函数获取表单数据，并在数据中添加一个 formName 字段，表示这个表单的名称：
        // className 属性用于给表单设置一个样式类名，方便在 CSS 中进行样式设置。比如，在这个例子中，我们可以在 CSS 中定义一个 .profile-form 类，来设置表单的样式：
        <Form
            form={form} // 将 form 实例传递给 Form 组件
            name="profile"
            className="profile-from"

            onFinish={onFinish}
        >
            <Form.Item
                name="accountName"  // name用于values中的key名
                rules={[
                    {
                        required: true,
                        message: 'Name',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
            </Form.Item>

            <Form.Item
                name="accountEmail"
                rules={[
                    {
                        required: true,
                        message: 'Email',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>

            <Form.Item
                name="accountAge"
                rules={[
                    {
                        required: true,
                        message: 'Age',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="age" />
            </Form.Item>




            <Form.Item>
                <Button type="primary" htmlType="submit" className="profile-form-button">
                    Submit
                </Button>
                <Button onClick={clearForm} className="profile-form-button">
                    Clear
                </Button>
            </Form.Item>
        </Form>
    );
};
export default UserProfileForm;
