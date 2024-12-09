"use client";
import { useState } from 'react';
import { Input, Button, Row, Col, Form } from 'antd';
import type { FormProps } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

const SignIn = () => {
  const router = useRouter();
  type FieldType = {
    email?: string;
    password?: string;
  };

  const [error, setError] = useState<string | null>(null);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      const response = await fetch('/api/auth/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values }),
      });

      if (!response.ok) {
        throw new Error('SignIn failed');
      }

      const res = await response.json();
      if (!res.ok) throw new Error(res.error);
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      router.push('/');
    } catch (err: any) {
      setError(`An error occurred while signing in. Please try again.\n${err}`);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="grid place-items-center content-center w-screen h-screen">
      <div className="w-full sm:w-8/12 md:w-7/12 bg-gray-100 rounded-md">
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Row className="p-3">
            <Col xs={24} md={8} className="text-xl text-black font-medium">Email</Col>
            <Col xs={24} md={16}>
              <Form.Item<FieldType>
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row className="p-3">
            <Col xs={24} md={8} className="text-xl text-black font-medium">Password</Col>
            <Col xs={24} md={16}>
              <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Row className="p-3 grid place-items-center">
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Sign In
              </Button>
            </Form.Item>
          </Row>
          {error && (
            <Row className="p-3 text-red-500 text-center">
              <div>{error}</div>
            </Row>
          )}
        </Form>
      </div>
      <div className='pt-3 font-medium text-xl'>
        Create an account?
        <Link className='ps-2' href='/pages/sign-up'>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
