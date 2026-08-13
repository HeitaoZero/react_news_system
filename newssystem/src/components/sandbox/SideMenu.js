import React from 'react'
import { useState } from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  UploadOutlined,
  UserOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  HighlightFilled,
  EditFilled,
  AuditOutlined
} from '@ant-design/icons';
import styles from './SideMenu.module.css'
const { Sider } = Layout



function SideMenu(props) {
  const navigate = useNavigate();
  const location = useLocation()
  const [menuList, setMenuList] = useState([])
  const handlePushPath = (e) => {
    const { key } = e;
    navigate(key);
  };

  const [rights, setRights] = useState([]);

  useEffect(() => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      if (token?.role?.rights) {
        setRights(token.role.rights);
      }
    } catch (error) {
      console.warn('读取 token 失败，可能未登录');
    }
  }, []);



  useEffect(() => {
    const menuItemIcon = {
      "/home": <HomeOutlined />,
      "/user-manage": <UserOutlined />,
      "/user-manage/list": <UnorderedListOutlined />,
      "/right-manage": <TeamOutlined />,
      "/right-manage/role/list": <UnorderedListOutlined />,
      "/right-manage/right/list": <UnorderedListOutlined />,
      "/news-manage": <HighlightFilled />,
      "/news-manage/add": <EditFilled />,
      "/news-manage/draft": <EditFilled />,
      "/news-manage/category": <EditFilled />,
      "/audit-manage": <AuditOutlined />,
      "/audit-manage/audit": <AuditOutlined />,
      "/audit-manage/list": <UnorderedListOutlined />,
      "/publish-manage": <UploadOutlined />,
      "/publish-manage/unpublished": <UploadOutlined />,
      "/publish-manage/published": <UploadOutlined />,
      "/publish-manage/sunset": <UploadOutlined />,
    }
    const checkPagePermission = (item) => {
      return item.pagepermisson && rights.includes(item.key)
    }
    // 迭代菜单list，过滤掉没有权限的菜单项，并将其转换为antd Menu组件所需的格式
    const transformMenu = ((items) => {
      return items
        .filter(item => item.pagepermisson === 1)
        .map(item => {
          const result = {
            key: item.key,
            label: item.title,
            icon: menuItemIcon[item.key]
          }
          if (!checkPagePermission(item)) {
            return null
          }
          if (checkPagePermission(item) && item.children && item.children.length > 0) {
            result.children = transformMenu(item.children)
          }
          return result
        })
    })
    axios.get('/api/rights?_embed=children').then((res) => {
      setMenuList(transformMenu(res.data))
    })
  }, [rights])

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      {props.isCollapsed ? null : <div className={`demo-logo-vertical ${styles.logo}`} >
        全球新闻管理系统
      </div>}
      <div className={styles.menuContainer}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
          items={menuList}
          onClick={(e) => { handlePushPath(e); }}
        />
      </div>
    </Sider >
  )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}
export default connect(mapStateToProps)(SideMenu)