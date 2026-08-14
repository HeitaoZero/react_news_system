import { Button, Descriptions } from 'antd'
import React, { useEffect, useState } from 'react'
import Icon, { LeftOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

export default function Detail() {
    const [newsInfo, setNewsInfo] = useState({})
    const params = useParams()
    const HeartSvg = () => (
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
            <title>heart icon</title>
            <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );
    const HeartIcon = props => <Icon component={HeartSvg} {...props} />;
    const items = [
        {
            key: '1',
            label: '创建者',
            children: newsInfo.author,
        },
        {
            key: '2',
            label: '发布时间',
            children: newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-",
        },
        {
            key: '3',
            label: '区域',
            children: newsInfo.region,
        },
        {
            key: '4',
            label: '访问数量',
            children: newsInfo.view,
        },
        {
            key: '5',
            label: '点赞数量',
            children: newsInfo.star,
        },
        {
            key: '6',
            label: '评论数量',
            children: 0,
        },
    ];
    useEffect(() => {
        try {
            axios.get(`/api/news/${params.id}?_expand=category`).then(res => {
                setNewsInfo({ ...res.data, view: res.data.view + 1 })
                return res.data
            }).then(res => {
                axios.patch(`/api/news/${params.id}`, { view: res.view + 1 })
            })
        } catch (e) {
            console.log(e)
        }
    }, [params.id])
    const handleStar = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/api/news/${params.id}`, {
            star: newsInfo.star + 1
        })
    }
    function Title() {
        const navigate = useNavigate()
        return (
            <>
                {
                    newsInfo ? (<><Button size={"large"} color="default" type='text' icon={<LeftOutlined />} onClick={() => { navigate(-1) }}></Button >
                        <span style={{ fontSize: "20px", fontWeight: "bolder", margin: "0 10px" }}>{newsInfo.title}</span>
                        <span style={{ fontSize: "14px", margin: "0 10px", color: "gray" }}>{newsInfo.category?.title}</span>
                        <span><HeartIcon style={{ color: 'hotpink' }} onClick={() => { handleStar() }} /></span>
                    </>) : null
                }
            </>
        )
    }
    return (
        <>
            <Descriptions title={<Title />} items={items} column={3} />
            <div dangerouslySetInnerHTML={{
                __html: newsInfo.content
            }} style={{
                border: "1px solid gray"
            }}>
            </div>
        </>
    )
}
