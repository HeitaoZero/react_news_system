import { useEffect, useState } from 'react'
import { notification } from 'antd'
import axios from 'axios'

function usePublish(type) {
    const [dataSource, setDataSource] = useState([])
    const [user, setUser] = useState()
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('token'))
            setUser(user)
        } catch (error) {
            console.log(error)
        }
    }, [])
    useEffect(() => {
        if (user)
            axios.get(`/api/news?_expand=category&${user.username}&publishState=${type}`).then(res => {
                setDataSource(res.data)
            })
    }, [user, type])
    const handlePublish = (id) => {
        setDataSource(dataSource.filter(data => data.id !== id))

        axios.patch(`/api/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                title: `通知`,
                description:
                    `您可以到【发布管理/已经发布】中查看您的新闻`,
                placement: "bottomRight"
            });
        })
    }
    const handleSunset = (id) => {
        setDataSource(dataSource.filter(data => data.id !== id))

        axios.patch(`/api/news/${id}`, {
            "publishState": 3,
        }).then(res => {
            notification.info({
                title: `通知`,
                description:
                    `您可以到【发布管理/已下线】中查看您的新闻`,
                placement: "bottomRight"
            });
        })
    }

    const handleDelete = (id) => {
        setDataSource(dataSource.filter(data => data.id !== id))

        axios.delete(`/api/news/${id}`).then(res => {
            notification.info({
                title: `通知`,
                description:
                    `您已经删除了已下线的新闻`,
                placement: "bottomRight"
            });
        })

    }



    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}


export default usePublish