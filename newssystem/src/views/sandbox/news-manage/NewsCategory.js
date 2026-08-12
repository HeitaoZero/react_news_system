import React, { useContext, useEffect, useRef, useState } from 'react';
import { Table, Button, Form, Input } from 'antd';
import { createStyles } from 'antd-style';
import axios from 'axios';
const useStyles = createStyles(props => {
  const { css, cssVar } = props;
  return {
    editableRow: css`
      position: relative;
      .editable-cell-value-wrap {
        cursor: pointer;
        padding: ${cssVar.paddingXXS} ${cssVar.paddingSM};
        border-width: ${cssVar.lineWidth};
        border-style: ${cssVar.lineType};
        border-color: transparent;
        border-radius: ${cssVar.borderRadiusSM};
        transition: all ${cssVar.motionDurationFast} ${cssVar.motionEaseInOut};
      }
      &:hover {
        .editable-cell-value-wrap {
          border-color: ${cssVar.colorBorder};
        }
      }
    `,
  };
});
const EditableContext = React.createContext(null);
const EditableCell = props => {
  const { title, editable, children, dataIndex, record, handleSave, ...restProps } = props;
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(prev => !prev);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} variant="filled" onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])
  const { styles } = useStyles();
  const defaultColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      editable: true,
    },
    {
      title: '操作',
      render: item => (
        <div>
          <Button type="primary" danger>删除</Button>
        </div>
      ),

    },
  ];
  const handleSave = (record) => {
    // console.log(record)

    setDataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          id: item.id,
          title: record.title,
          value: record.title
        }
      }
      return item
    }))

    axios.patch(`/api/categories/${record.id}`, {
      title: record.title,
      value: record.title
    })
  }
  const components = {
    body: { row: EditableRow, cell: EditableCell },
  };
  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  useEffect(() => {
    axios.get("/api/categories").then(res => {
      setDataSource(res.data)
    })
  }, [])
  return (
    <>
      <Table
        components={components}
        rowClassName={() => styles.editableRow}
        bordered
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      />
    </>
  )
}
