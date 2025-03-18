"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import "../../app/globals.css";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [toggle, setToggle] = useState(false);
  const [componentMount, setComponentMount] = useState(false);

  // Function to check authentication
  const checkAuth = () => {
    const storedAuth = localStorage.getItem("auth");
    setIsAuthenticated(storedAuth === "true");
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("auth");
      const isLoggedIn = storedAuth === "true";
      setIsAuthenticated(isLoggedIn);
  
      if (!isLoggedIn) {
        router.push("/"); // 🔥 Redirect to login page if not authenticated
      }
    };
  
    checkAuth();
  
    const handleStorageChange = () => {
      checkAuth(); // Recheck auth status when localStorage changes
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]); // ✅ Include `router` dependency
  

  if (isAuthenticated === false) {
    return null; // Prevent rendering if not authenticated
  }

  const handleToggle = () => {
    setToggle(!toggle);
    if (!componentMount) {
      setComponentMount(true);
    }
  };

  const navLinks = [
    { title: "Home", link: "/" },
    { title: "About", link: "/about" },
    { title: "Chronology", link: "/chronology" },
    { title: "Family Tree", link: "/family-tree" },
    { title: "Photos", link: "/photos" },
  ];

  return (
    <div className="flex font-inter header sticky top-0 w-full z-[50] justify-center items-center h-[100px]">
      {/* links */}
      <div className="rounded-md w-1/2 hidden lg:flex justify-center p-[2px] gap-8">
        {navLinks.map((link, index) => (
          <Link
            href={link.link}
            key={index}
            className={`capitalize text-center ${
              pathname === link.link
                ? "text-brown-gradient underline"
                : "text-foreground"
            }`}
          >
            {link.title}
          </Link>
        ))}
      </div>

      {/* RESPONSIVENESS */}
      <span className="absolute right-[2rem] lg:hidden" onClick={handleToggle}>
        {toggle ? (
          <RiCloseLargeLine size={27} className="text-appBrown" />
        ) : (
          <Image width={32} height={32} src="/images/home/Menu.svg" alt="menu" />
        )}
      </span>

      <div
        className={`flex flex-col ${
          !componentMount && !toggle
            ? "hidden"
            : toggle && componentMount
            ? "slide-in-left"
            : "slide-out-left"
        } items-start justify-start glass-background opacity-50 top-0 bg-foreground text-appBrown2 absolute py-[38px] px-[20px] left-0 z-10 w-[65%] md:w-[45%] h-dvh nav shadow-lg transition-all duration-300 gap-4 lg:hidden`}
      >
        <div className="h-[50px]"></div>
        {navLinks.map((link, index) => (
          <Link
            href={link.link}
            key={index}
            onClick={handleToggle}
            className={`my-[5px] capitalize text-center ${
              pathname === link.link
                ? "text-brown-gradient underline"
                : "text-appBrown"
            }`}
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;
