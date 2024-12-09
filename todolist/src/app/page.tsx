"use client";
import { Col, Row, Badge, Popconfirm } from "antd";
import { useEffect, useState, useRef } from "react";
import { FaPlus, FaTrash } from 'react-icons/fa';
import ToDoEditor from '@/app/components/todo/home/todoEditor';
import Layout from "./components/layout/layout";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState<any>({});
  const [delIconVisible, setDelIconVisible] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);

  const isFirstRender = useRef(true); 

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
    setPage(1);
    setTodos([]);
    fetchTodo(1);
  };

  const fetchTodo = async (currentPage: number) => {
    if (isLoading) return;
    setIsLoading(true);

    const user = localStorage.getItem("user");
    if (!user) return;
    const parsedUser = JSON.parse(user);

    try {
      const response = await fetch(`/api/todo?userId=${parsedUser.id}&page=${currentPage}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodos((prevTodos) => [...prevTodos, ...data.todos]);
        setPage((prevPage) => prevPage + 1); 
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      fetchTodo(page);
      isFirstRender.current = false; 
    }
  }, []); 

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const bottom = (target.scrollHeight - 0.5) === target.scrollTop + target.clientHeight;

    if (bottom && !isLoading) {
      fetchTodo(page);
    }
  };

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
      data = { ...data, deletedAt: new Date() };
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
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== data.id));
      setDelIconVisible(new Set());
    } catch (err: any) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <>
      <Layout>
        <Row gutter={[10, 10]} className="p-3" onScroll={handleScroll} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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
            onClick={showDrawer}>
            <FaPlus className="text-white text-2xl" />
          </button>
        </div>
        <ToDoEditor onClose={onClose} open={open} data={newTodo} />
      </Layout>
    </>
  );
}
