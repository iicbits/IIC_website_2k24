"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const navItems = [
    { name: "About Us", href: "/About" },
    { name: "BITS TEXMiN", href: "/BITS_TEXMiN" },
    { name: "Initiatives", href: "/Initiatives" },
    { name: "Incubation", href: "/Incubation" },
    { name: "Team", href: "/Team" },
    { name: "Gallery", href: "/Gallery" },
  ];

  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const currentItem = navItems.find((item) => pathname.startsWith(item.href));
    if (currentItem) {
      setActiveItem(currentItem.name);
    } else {
      setActiveItem("");
    }
  }, [pathname]);

  return (
    <header className="bg-foreground z-50">
      <div className="h-9 hidden md:flex bg-neutral-700">
        <div className="bg-foreground w-2/5 h-full rounded-tr-3xl"></div>
        <div className="bg-foreground h-full w-1/5">
          <div className="bg-neutral-700 w-full h-full rounded-b-2xl text-center text-sm font-semibold flex items-center text-white pl-12">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Inductions 2.0 Open for 2k25
          </div>
        </div>
        <div className="bg-foreground w-2/5 h-full rounded-tl-3xl"></div>
      </div>

      <div className="pr-8 md:px-16 flex justify-between items-center relative">
        <div className="flex items-center h-20">
          <a
            href="https://www.bitsindri.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/logos/BIT logo.png"
              alt="BIT Logo"
              width={100}
              height={100}
              className="w-16 md:w-auto h-auto"
            />
          </a>
          <div className="w-[1px] md:w-[2px] h-1/3 md:h-1/2 bg-accent"></div>
          <Link href="/" className="ml-2">
            <Image
              src="/images/logos/IIC logo.png"
              alt="IIC Logo"
              width={100}
              height={100}
              className="ml-2 w-20 md:w-auto h-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-secondary">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`transition-all duration-300 ${
                activeItem === item.name
                  ? "text-orange-500 border-b border-orange-500"
                  : "hover:text-accent border-b border-transparent hover:border-accent"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4">
          {/* Desktop Contact Button */}
          <Link
            href="/Registration-form"
            className={`hidden md:block px-4 py-2 border-2 border-neutral-700 rounded-full text-sm transition-colors duration-300 hover:bg-neutral-300`}
          >
            Join Us
          </Link>
          <Link
            href="/Contact"
            className={`hidden md:block px-4 py-2 border-2 border-neutral-700 rounded-full text-sm transition-colors duration-300 ${
              activeItem === "Contact"
                ? "text-orange-500 bg-orange-100 border-orange-500"
                : "text-white bg-neutral-600 hover:bg-neutral-500"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-secondary transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-secondary transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-secondary transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute z-50 top-full left-0 right-0 bg-foreground transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col justify-center items-center py-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-8 py-3 text-secondary transition-all duration-300 ${
                  activeItem === item.name
                    ? "text-orange-500"
                    : "hover:text-accent hover:bg-neutral-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex gap-2 mt-4">
              <Link
                href="/Registration-form"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 border border-neutral-700 rounded-full text-sm text-center transition-colors duration-300 hover:bg-neutral-300`}
              >
                Join Us
              </Link>
              <Link
                href="/Contact"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 border border-neutral-700 rounded-full text-sm text-center transition-colors duration-300 text-white bg-neutral-600 hover:bg-neutral-500`}
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
