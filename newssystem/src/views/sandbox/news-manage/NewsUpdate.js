import React from 'react'
import styles from './NewsAdd.module.css'
import { Button, Steps, Form, Input, Select, notification, message } from 'antd'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
const { Option } = Select;
export default function NewsAdd() {
    const [current, setCurrent] = useState(0)
    const [content, setContent] = useState('')
    const [formInfo, setFormInfo] = useState({})
    const navigate = useNavigate()
    const params = useParams()
    const [user, setUser] = useState()
    const [categoryList, setCategoryList] = useState([])
    const NewsForm = useRef(null)

    const onChangeCurrent = (value) => {
        setCurrent(value)
    }
    const newsAddFlowList = [
        {
            title: '基本信息',
            content: '新闻标题，新闻分类',
        },
        {
            title: '新闻内容',
            content: '新闻主题内容',
        },
        {
            title: '新闻提交',
            content: '保存草稿或者提交审核',
        },
    ]
    useEffect(() => {
        axios.get("/api/categories").then(res => {
            console.log(res.data)
            setCategoryList(res.data)
        })
    }, [])
    useEffect(() => {
        try {
            setUser(JSON.parse(localStorage.getItem('token')));
        } catch (error) {
            console.log(error)
        }
    }, [])
    const handleSave = (auditState) => {
        axios.patch(`/api/news/${params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            notification.info({
                title: `通知`,
                description:
                    `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您修改后的新闻`,
                placement: "bottomRight"
            });
        })
    }
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res)
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            // console.log(content)
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
            } else {
                setCurrent(current + 1)
            }
        }
    }

    useEffect(() => {
        // console.log()
        axios.get(`/api/news/${params.id}?_expand=category&_expand=role`).then(res => {
            // setnewsInfo(res.data)
            console.log(res.data)
            // content , 
            // formInfo 
            let { title, categoryId, content } = res.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })

            setContent(content)
        })
    }, [params.id])
    return (
        <>
            <div className={styles.title}>修改新闻</div>
            <Steps
                className={styles.steps}
                current={current}
                onChange={onChangeCurrent}
                items={newsAddFlowList}
            />
            <div className={styles.content}>
                <div className={current === 0 ? styles.show : styles.active}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className={styles.form}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your title!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please select your category!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? "" : styles.active}>
                    <NewsEditor getContent={(value) => {
                        console.log(value)
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? "" : styles.active}></div>
            </div>
            <div className={styles.button}>
                {
                    current > 0 && <Button onClick={() => setCurrent(current - 1)}>上一步</Button>
                }
                {
                    current < 2 && <Button type='primary' onClick={() => handleNext()}>下一步</Button>
                }
                {
                    current === 2 && <> <Button type='primary' onClick={() => handleSave(0)}>保存草稿</Button> <Button type='primary' danger onClick={() => handleSave(1)}> 提交审核</Button></>
                }
            </div >

        </>
    )
}
