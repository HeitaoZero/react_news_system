import React from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

import './NewsSandBox.css'
import { Layout, theme } from 'antd'
import NewsRouter from '../../components/news-router/NewsRouter'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
const { Content } = Layout;
export default function NewsSandBox() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const location = useLocation();
    useEffect(() => {
        NProgress.start()
        const timer = setTimeout(() => {
            NProgress.done();
        }, 200); // 适当延时，让用户看到进度动画

        return () => clearTimeout(timer); // 清理定时器
    }, [location])
    return (
        <Layout>
            <SideMenu />
            <Layout>
                <TopHeader />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <NewsRouter />

                </Content>
            </Layout>
        </Layout>
    )
}
