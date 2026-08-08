import React from 'react'
import styles from './NewsAdd.module.css'
import { Button, Steps, Form, Input, Select } from 'antd'
export default function NewsAdd() {
  const [current, setCurrent] = React.useState(0)
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
  return (
    <>
      <div className={styles.title}>撰写新闻</div>
      <Steps
        className={styles.steps}
        current={current}
        onChange={onChangeCurrent}
        items={newsAddFlowList}
      />
      <div className={styles.content}>
        <div className={current === 0 ? "" : styles.active}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="newsTitle"
              rules={[{ required: true, message: 'Please input your title!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categories"
              rules={[{ required: true, message: 'Please select your category!' }]}
            >
              <Select
                options={[
                  { label: 'Designer', value: 'designer' },
                  { label: 'Developer', value: 'developer' },
                  { label: 'Product Manager', value: 'product-manager' },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : styles.active}>22222222</div>
        <div className={current === 2 ? "" : styles.active}>3333333333</div>
      </div>
      <div className={styles.button}>
        {
          current > 0 && <Button onClick={() => setCurrent(current - 1)}>上一步</Button>
        }
        {
          current < 2 && <Button type='primary' onClick={() => setCurrent(current + 1)}>下一步</Button>
        }
        {
          current === 2 && <> <Button type='primary'>保存草稿</Button> <Button type='primary' danger>提交审核</Button></>
        }
      </div>

    </>
  )
}
