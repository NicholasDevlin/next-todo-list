"use client";
import React from 'react';
import { useEffect, useState, useRef } from "react";
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
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
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="text-xl font-bold">TO DO!</div>
        <div className="relative">
          <div onClick={toggleDropdown} ref={buttonRef}>
            <FaUserCircle className="text-2xl" />
          </div>
          {dropdownMenu && (
            <div ref={dropdownRef} className="dropdown-container absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 p-2 z-50">
              <ul>
                {!isAuthenticated && (
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => router.push('/pages/sign-in')}>
                    Sign In
                  </li>
                )}
                {isAuthenticated && (
                  <>
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => router.push('/profile')}>
                      Profile
                    </li>
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={logout}>
                      Log Out
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
      <div className="layout-container">
        {children}
      </div>
    </>
  );
};

export default Layout;
