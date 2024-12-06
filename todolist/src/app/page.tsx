"use client";
import Drawer from "antd/es/drawer";
import { useEffect, useState, useRef } from "react";
import { FaPlus, FaUserCircle } from 'react-icons/fa';


export default function Home() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null); 

  const showDrawer = () => {
      setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   fetch('/api/users')
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data) => console.log(data))
  //     .catch((error) => console.error('Error fetching users:', error));
  // }, []);

  useEffect(() => {
  }, []);

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="text-xl font-bold">Logo</div>
        <div>
          <FaUserCircle className="text-2xl" />
        </div>
      </nav>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-semibold text-xl">Todo Title</h3>
          <p className="text-gray-600">Description of the todo item...</p>
        </div>
      </div>


      <div className="fixed bottom-8 right-8">
        <button
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
          aria-label="Add Todo"
          onClick={showDrawer}
        >
          <FaPlus className="text-white text-2xl" />
        </button>
      </div>
      <Drawer panelRef={drawerRef} placement="bottom" title="Add to do" onClose={onClose} open={open}>

      </Drawer>
    </>
  );
}
