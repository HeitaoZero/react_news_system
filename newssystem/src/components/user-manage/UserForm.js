import React from 'react'
import { Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
export default function UserForm(props) {
    const [form] = Form.useForm();
    const [regionList, setRegionList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [isRoot, setIsRoot] = useState(false);
    const GetToken = () => {
        return JSON.parse(localStorage.getItem('token'))
    }
    const { roleId, region } = GetToken()

    useEffect(() => {
        const fetchOptions = async () => {
            const userObj = {
                "1": "superAdmin",
                "2": "admin",
                "3": "audit"
            }
            try {
                // 并行请求，提高性能
                const [regionRes, roleRes] = await Promise.all([
                    axios.get('/api/regions'),
                    axios.get('/api/roles')
                ]);
                // 使用 map 构建新数组，不修改原数据
                const regionOptions = regionRes.data.map(item => {
                    if (userObj[roleId] === "superAdmin") {
                        return {
                            value: item.id,
                            label: item.title
                        }
                    } else if (userObj[roleId] === "admin") {
                        if (item.value === region) {
                            return {
                                value: item.id,
                                label: item.title
                            }
                        } else {
                            return {}
                        }
                    } else if (userObj[roleId] === "audit") {
                        if (item.value === region) {
                            return {
                                value: item.id,
                                label: item.title
                            }
                        } else {
                            return {}
                        }
                    } else {
                        return {}
                    }
                });
                const roleOptions = roleRes.data.map(item => {
                    if (userObj[roleId] === "superAdmin") {
                        return {
                            value: item.id,
                            label: item.roleName
                        }
                    } else if (userObj[roleId] === "admin") {
                        if (userObj[item.id] === "audit" || userObj[item.id] === "admin") {
                            return {
                                value: item.id,
                                label: item.roleName
                            }
                        } else {
                            return {}
                        }
                    } else if (userObj[roleId] === "audit") {
                        if (userObj[item.id] === "audit") {
                            return {
                                value: item.id,
                                label: item.roleName
                            }
                        } else {
                            return {}
                        }
                    } else {
                        return {}
                    }
                });
                const newRegionOptions = regionOptions.filter(item => Object.keys(item).length > 0)
                const newRoleOptions = roleOptions.filter(item => Object.keys(item).length > 0)
                setRegionList(newRegionOptions);
                setRoleList(newRoleOptions);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOptions()
    }, [region, roleId])

    useEffect(() => {
        if (isRoot) {
            form.setFieldsValue({
                region: null,
            });
        }
    }, [isRoot, form]);
    const createUser = async (values) => {
        try {
            const { roleName, ...data } = values;
            await axios.post('/api/users', {
                ...data,
                roleState: true,
                default: isRoot ? true : false,
                region: isRoot ? "" : regionList.filter(item => item.value === values.region)[0].label,
                roleId: roleName,
            }).then(res => {
                if (res.data.region === "") res.data.region = '全球'
                props.setDataSource([...props.dataSource, { ...res.data, roleName: roleList.filter(item => item.value === roleName)[0].label }])

                form.resetFields();
                props.setIsVisible(false);
                setIsRoot(false);
            })

        } catch (error) {
            console.log(error)
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields()
            createUser(values)
        }
        catch (error) {
            console.log(error)
        }
    };
    const clearAll = () => {
        form.resetFields()
    }

    useEffect(() => {
        form.setFieldsValue(props.dataSource.filter(data => data.id === props.chooseId)[0])
        // console.log(props.dataSource.filter(data => data.id === props.chooseId)[0]?.roleId === 1)
        if (props.dataSource.filter(data => data.id === props.chooseId)[0]?.roleId === 1) {
            setIsRoot(true)
        }
    }, [props.chooseId, props.dataSource, form])

    const handleUpdate = async (id) => {
        try {
            const userData = props.dataSource.find(data => data.id === id)
            const values = await form.validateFields()
            console.log(values)
            console.log(userData.username === values.username && userData.region === values.region && userData.roleName === values.roleName && userData.password === values.password)
            if (userData.username === values.username && userData.region === values.region && userData.roleName === values.roleName && userData.password === values.password) {
                props.setIsVisible(false)
            } else {
                props.dataSource.find(data => data.id === id).username = values.username
                props.dataSource.find(data => data.id === id).region = values.region
                props.dataSource.find(data => data.id === id).roleId = roleList.filter(item => item.label === values.roleName)[0].value
                props.dataSource.find(data => data.id === id).password = values.password
                props.dataSource.find(data => data.id === id).roleName = values.roleName
                try {
                    await axios.patch(`/api/users/${id}`, { username: values.username, region: values.region, roleId: roleList.filter(item => item.label === values.roleName)[0].value, password: values.password })
                    props.setDataSource([...props.dataSource])
                    props.setIsVisible(false)
                } catch (err) { console.log(err) }
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    return (
        <Modal
            title={props.title}
            open={props.isVisible}
            okText={props.title === '添加用户' ? 'Create' : 'Update'}
            cancelText="Cancel"
            okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
            onCancel={() => {
                props.setIsVisible(false)
                setIsRoot(false)
                clearAll()
                props.setChooseId?.(null)
            }}
            onOk={() => { props.title === "添加用户" ? handleCreate() : handleUpdate(props.chooseId) }}
            destroyOnHidden
            forceRender
            modalRender={dom =>
            (
                <Form
                    layout="vertical"
                    form={form}
                    name={props.title === "添加用户" ? "form_in_add_modal" : "form_in_edit_modal"}
                    clearOnDestroy
                    onFinish={(values) => { }}
                >
                    {dom}
                </Form>
            )}>

            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input type="textarea" />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isRoot ? null : [{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select options={regionList} disabled={isRoot} />
            </Form.Item>
            <Form.Item
                name="roleName"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select options={roleList} onChange={(value) => { value === 1 ? setIsRoot(true) : setIsRoot(false) }} />
            </Form.Item>
        </Modal>
    )
}
