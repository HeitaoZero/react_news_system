import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import { Spin } from "antd"
import { connect } from 'react-redux'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": < RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": < AuditList />,
    "/publish-manage/unpublished": < Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />
}
function NewsRouter(props) {
    const [BackRouteList, setBackRouterList] = useState([])
    const [rights, setRights] = useState([])

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const parsed = JSON.parse(token);
                setRights(parsed?.role?.rights || []);
            }
        } catch { }
    }, [])
    // const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        Promise.all([
            axios.get('/api/rights'),
            axios.get('/api/children'),
        ]).then(res => {
            setBackRouterList([...res[0].data, ...res[1].data])
        })
    }, [])

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }
    return (
        <Spin spinning={props.isLoading}>
            <Routes>
                {
                    BackRouteList.map(item => {
                        if (checkRoute(item) && checkUserPermission(item))
                            return <Route path={item.key} element={LocalRouterMap[item.key]} key={item.key} />
                        else
                            return null
                    })
                }
                <Route path="/" element={<Navigate to="/home" />} />
                {
                    BackRouteList.length > 0 && <Route path="*" element={<Nopermission />} />
                }

            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({ isLoading })
export default connect(mapStateToProps)(NewsRouter)