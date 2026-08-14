import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { Card, Col, Row, List } from 'antd'
export default function News() {
    const [list, setList] = useState([])
    useEffect(() => {
        axios.get("/api/news?publishState=2&_expand=category").then(res => {
            // console.log()
            setList(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })
    }, [])
    return (
        <>
            <div style={{
                width: "95%",
                margin: '0 auto'
            }}>
                <div style={{ height: "50px" }}><b style={{ fontSize: "25px", lineHeight: "50px" }}>全球新闻</b><span style={{ color: "gray", fontSize: "14px", marginLeft: "16px" }}>查看新闻</span></div>
                <Row gutter={[16, 16]}>
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </>
    )
}
