import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
// import { useEffect } from 'react'
import styles from './Login.module.css'
export default function Login() {
    const navigate = useNavigate()
    const onFinish = (values) => {
        console.log('Success:', values);
        axios.get(`/api/users?username=${values.username}&password=${values.password}&_expand=role`).then(res => {
            console.log(res.data, res.data[0].roleState)
            if (res.data.length === 1 && res.data[0].roleState) {
                localStorage.setItem('token', JSON.stringify(res.data[0]))
                console.log(res.data[0])
                navigate('/home')
                console.log(res.data[0])
            } else {
                message.error('用户名密码错误')
            }
        })
    };


    return (
        <div className={styles.loginBox} >

            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ maxWidth: 400 }}
                onFinish={onFinish}
                className={styles.login}
            >
                <div className={styles.title}>新闻发布系统</div>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>

    )
}
