"use client";
import { Col, Row, Badge, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from 'react-icons/fa';
import ToDoEditor from '@/app/components/todo/home/todoEditor';
import Layout from "./components/layout/layout";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({});
  const [delIconVisible, setDelIconVisible] = useState<Set<number>>(new Set());

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setNewTodo({
      title: "",
      content: "",
      id: null,
      status: ""
    });
    fetchTodo();
  };

  useEffect(() => {
    fetchTodo();
  }, [newTodo]);

  const fetchTodo = async () => {
    const user = localStorage.getItem("user");
    if (!user) return;
    const parsedUser = JSON.parse(user);
    const response = await fetch(`/api/todo?userId=${parsedUser.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const res = await response.json();
      setTodos(res);
    }
  }

  const toggleDelIcon = (todoId: number) => {
    setDelIconVisible((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(todoId)) {
        newSet.delete(todoId);
      } else {
        newSet.add(todoId);
      }
      return newSet;
    });
  };

  const handleDelete = async (data: any) => {
      try {
        data = {...data, deletedAt: new Date()};
        debugger
        const response = await fetch('/api/todo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...data }),
        });
  
        if (!response.ok) {
          throw new Error('Save failed');
        }
  
        const res = await response.json();
        if (!res.ok) throw new Error(res.error);
        fetchTodo();
        setDelIconVisible(new Set());
      } catch (err: any) {
        // setError(`An error occurred while signing up. Please try again.\n${err}`);
      }
  };

  return (
    <>
      <Layout>
        <Row gutter={[10, 10]} className="p-3">
          {
            todos.map((todo: any, index: any) => (
              <Col key={index} xs={24} md={12}>
                <Badge.Ribbon color={todo.status === "COMPLETED" ? "green" : "blue"} text={todo.status}>
                  <div className="bg-white p-6 rounded-lg shadow-lg group">
                    <h3
                      onClick={() => { setNewTodo(todo); showDrawer(); }}
                      className="font-semibold text-xl text-black hover:text-blue-500 cursor-pointer capitalize">
                      {todo.title}
                    </h3>
                    <p className="text-gray-600">{todo.content}</p>
                    <div className={`flex ${delIconVisible.has(todo.id) ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity justify-end`}>
                      <Popconfirm title="Sure to delete?" onCancel={() => setDelIconVisible(new Set())} onConfirm={() => handleDelete(todo)}>
                        <FaTrash onClick={() => toggleDelIcon(todo.id)} className="fill-red-500 cursor-pointer" />
                      </Popconfirm>
                    </div>
                  </div>
                </Badge.Ribbon>
              </Col>
            ))
          }
        </Row>

        <div className="fixed bottom-8 right-8">
          <button
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
            aria-label="Add Todo"
            onClick={showDrawer}
          >
            <FaPlus className="text-white text-2xl" />
          </button>
        </div>
        <ToDoEditor onClose={onClose} open={open} data={newTodo} />
      </Layout>
    </>
  );
}
