'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, 
  X, 
  LogOut, 
  Earth,
  LayoutDashboard,
  KeySquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const AdminSideBar = ({ children }: { 
  children: ReactNode;
}) => {
  
//   const { user } = useUser();
//   const { logout } = useLogout();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

//   const handleLogout = () => {
//     logout();
//   };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
    { icon: <Earth size={20} />, label: 'API', href: '/admin/api' },
    { icon: <KeySquare size={20} />, label: 'Keys', href: '/admin/keys' },
  ];


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-800">

      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-800 border-r border-slate-700 
                   transition-all duration-300 ease-in-out
                   ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                   ${collapsed ? 'w-20' : 'w-64'}`}
      >

        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full text-white backdrop-blur-sm">
              {/* <LogoSVG /> */}
            </div>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-white hidden lg:block"
          >
            <Menu size={20} className={collapsed ? 'block' : 'hidden'} />
            <X size={20} className={collapsed ? 'hidden' : 'block'} />
          </button>
          <button 
            onClick={toggleMobileSidebar}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item, index) => {
              const isActive = 
                item.href === '/admin' 
                  ? pathname === '/admin' || pathname === '/admin/' 
                  : pathname.startsWith(item.href);
                  
              return (
                <li key={index}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors
                              ${isActive ? 'bg-blue-600 text-white' : ''}`}
                  >
                    <span className="flex items-center justify-center">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-slate-700 p-4">
          {!collapsed && (
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 border border-slate-600">
                {/* <AvatarImage src={user?.avatar} alt="User" /> */}
                <AvatarFallback className="bg-blue-600">
                  {'U'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="font-medium text-white">
                  {/* {user?.name} */}
                </div>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className={`w-full justify-${collapsed ? 'center' : 'start'} text-slate-300 hover:text-white hover:bg-slate-700`}
            // onClick={handleLogout}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      <div className={`flex-1 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300 ease-in-out w-full`}>
        
        <header className="h-16 border-b border-slate-200 backdrop-blur-md bg-white/90 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <button
            onClick={toggleMobileSidebar}
            className="text-slate-600 hover:text-slate-900 lg:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1 max-w-md ml-4 lg:ml-0">

          </div>
          
          <div className="flex items-center space-x-3">

            <Avatar className="h-8 w-8 border border-slate-200">
              {/* <AvatarImage src={user?.avatar} alt="User" /> */}
              <AvatarFallback className="bg-blue-600">
                {'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {children}

      </div>
    </div>
  );
};

export default AdminSideBar;