"use client";
import { Col, Row, Badge } from "antd";
import { useEffect, useState, useRef } from "react";
import { FaPlus, FaUserCircle } from 'react-icons/fa';
import ToDoEditor from '@/app/components/todo/home/todoEditor';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({});

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
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownMenu((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
      setDropdownMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchTodo();
  }, [newTodo]);

  const fetchTodo = async () => {
    const response = await fetch('/api/todo', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const res = await response.json();
      setTodos(res);
    }
  }

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="text-xl font-bold">Logo</div>
        <div className="relative">
          <div onClick={toggleDropdown} ref={buttonRef}>
            <FaUserCircle className="text-2xl" />
          </div>
          {dropdownMenu && (
            <div ref={dropdownRef} className="dropdown-container absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2 z-50">
              <ul>
                <li className="p-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => router.push("/pages/sign-in")}>Sign In</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer text-black">Profile</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer text-black">Log Out</li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      <Row gutter={[10, 10]} className="p-3">
        {
          todos.map((todo: any, index: any) => (
            <Col key={index} xs={24} md={12}>
              <Badge.Ribbon color={todo.status === "COMPLETED" ? "green" : "blue"} text={todo.status}>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3
                  onClick={() => {setNewTodo(todo); showDrawer();}}
                  className="font-semibold text-xl text-black hover:text-blue-500 cursor-pointer capitalize">
                    {todo.title}
                  </h3>
                  <p className="text-gray-600">{todo.content}</p>
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
      <ToDoEditor onClose={onClose} open={open} data={newTodo}/>
    </>
  );
}
