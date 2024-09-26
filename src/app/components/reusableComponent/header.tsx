'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const excludedRoutes = ['/user/Home','/user/Appointments/camara'];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  if (excludedRoutes.includes(pathname)) {
    return null;
  }



  return (
    <header className="bg-[#EAEAEA] py-4 px-6 mt-4 rounded-full shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="relative">
          <Image
            src={logo}
            alt="Logo"
            width={220}
            height={20}
            className="w-auto h-7 md:h-24"
          />
        </div>
        
        <div className="md:hidden z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        <nav className={`
          md:flex md:flex-row md:items-center md:space-x-4
          fixed md:relative top-0 right-0 bottom-0
          w-72 md:w-auto
          bg-gradient-to-b from-gray-900 to-black md:bg-none
          text-white md:text-black
          p-8 md:p-0
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          md:transform-none
          flex flex-col md:flex-row
          space-y-6 md:space-y-0
          z-40
          overflow-y-auto
        `}>
          <div className="mb-8 md:hidden">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="w-auto h-16"
            />
          </div>
          {['Home', 'About', 'Services', 'UserProfile'].map((item, index) => (
            <React.Fragment key={item}>
              <a 
                href={  item === 'Home' ? '/user/Home' :
                  item === 'About' ? '/user/Home#about' :
                  item === 'UserProfile' ? '/user/UserProfile' : `#${item.toLowerCase()}`}
                className="block text-xl md:text-base font-semibold hover:text-gray-300 md:hover:text-gray-700 transition duration-300 ease-in-out relative group"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white md:bg-black transition-all duration-300 group-hover:w-full"></span>
              </a>
              {index < 3 && <span className="hidden md:inline-block text-black mx-1">&bull;</span>}
            </React.Fragment>
          ))}
          <a 
            href="/login"
            className="block text-lg md:text-base bg-white text-black md:bg-black md:text-white hover:bg-gray-200 md:hover:bg-gray-800 px-6 py-3 rounded-full transition duration-300 ease-in-out mt-8 md:mt-0 text-center font-semibold"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </a>
        </nav>
        
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
      </div>
    </header>
  );
};

export default Header;