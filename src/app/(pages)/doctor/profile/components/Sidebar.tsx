"use client";
import doctor from '../../../../../../public/images/profile.png'
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../../../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/app/utils/util";
import Profile from './profile';
import appoinment from '../../../../../../public/images/icons8.png'
import { MessageCircle } from 'lucide-react';

export function SidebarDemo() {
  const links:any = [
    // {
    //   label:(
    //     <span className="text-white dark:text-neutral-200">Dashboard</span>
    //   ),
    //   href: "/doctor/dashboard",
    //   icon: (
    //     <IconBrandTabler className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    {
      label:(
        <span className="text-white dark:text-neutral-200">Profile</span>
      ),
      href: "/doctor/profile",
      icon: (
        <IconUserBolt className="text-white dark:text-neutral-200 h-5 w-5 fl  ex-shrink-0" />
      ),
    },
    {
      label:(
        <span className="text-white dark:text-neutral-200">Appoinments</span>
      ),
      href: "/doctor/appoinments",
      icon: (
        <IconUserBolt className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label:(
        <span className="text-white dark:text-neutral-200">Chat</span>
      ),
      href: "/doctor/chat",
      icon: (
        <MessageCircle className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />

      ),
    },
    {
      label:(
        <span className="text-white dark:text-neutral-200" onClick={()=>logout()}>Logout</span>
      ),
      href: "/login",
      icon: (
        <IconArrowLeft className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  let logout =()=>{
    console.log('its working mahn')
    sessionStorage.removeItem('doctor');
    sessionStorage.removeItem('token');
    localStorage.removeItem('doctor');
  }
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-[#0E0A3C]">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2 ">
              {links.map((link:any, idx:number) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    
       <div className="flex-1 overflow-auto">
  <Profile />
</div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white dark:text-white whitespace-pre"
      >
        Care Point
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

