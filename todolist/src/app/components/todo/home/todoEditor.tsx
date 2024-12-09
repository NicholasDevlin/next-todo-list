"use client";
import { Drawer, Form, Input, Segmented, Button } from "antd";
import { TodoStatus } from "@/app/DTOs/todos";
import type { FormProps } from 'antd';
import { useEffect } from "react";

const ToDoEditor = ({ onClose, open, data }: any) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  type FieldType = {
    id: number;
    title: string;
    content: string;
    authorId: number;
    status: TodoStatus;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      values = {...data, ...values};
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        values.authorId = parsedUser.id;
      }
      values.status = values.status || TodoStatus.PENDING;
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      const res = await response.json();
      if (!res.ok) throw new Error(res.error);
      onClose();
    } catch (err: any) {
      // setError(`An error occurred while signing up. Please try again.\n${err}`);
    }
  };

  useEffect(() => {
    form.setFieldsValue({title: data.title, content: data.content, status: data.status, id: data.id})
  }, [data])

  return (
    <>
      <Drawer placement="bottom" title="Add to do" onClose={onClose} open={open}>
        <Form onFinish={onFinish} form={form}>
          <Form.Item<FieldType>
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input your title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            name="content"
            label="To Do"
            rules={[{ required: true, message: 'Please input your content!' }]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Segmented options={['PENDING', 'COMPLETED']} />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default ToDoEditor;