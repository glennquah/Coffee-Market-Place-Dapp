import {
  AiOutlineClose,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import Logo from '../assets/NFTRoasterLogo.svg';

import { useState } from 'react';

function Navbar() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <nav className="fixed w-full h-24 shadow-xl use-main-bg">
      <div className="flex justify-between items-center w-full h-full px-4 2xl:px-16">
        <a href="/">
          <img src={Logo} alt="logo" className="h-24 w-24" />
        </a>
        <div className="hidden sm:flex">
          <ul className="hidden sm:flex gap-2">
            <li className="mr-8">
              <a
                href="/marketplace"
                className="text-xl uppercase hover:border-b-4 hover:border-red-300"
              >
                MARKETPLACE
              </a>
            </li>
            <li className="mr-8">
              <a
                href="/"
                className="text-xl uppercase hover:border-b-4 hover:border-red-300"
              >
                About
              </a>
            </li>
            <li className="mr-8">
              <a
                href="/"
                className="text-xl uppercase hover:border-b-4 hover:border-red-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div onClick={handleNav} className="sm:hidden cursor-pointer pl-24">
          <FaBars size={25} />
        </div>
      </div>
      <div
        className={
          nav
            ? 'fixed left-0 top-0 w-48 sm:hidden h-screen bg-white p-10 ease-in-out duration-500 shadow-lg'
            : 'fixed left-[-100%] top-0 w-48 sm:hidden h-screen bg-white p-10 ease-in-out duration-500 shadow-lg'
        }
      >
        <div className="flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <AiOutlineClose size={25} />
          </div>
        </div>
        <ul className="flex flex-col gap-9 mt-10 ">
          <li>
            <a
              href="/"
              onClick={() => setNav(false)}
              className="text-xl uppercase hover:border-b-4 hover:border-red-300"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/"
              onClick={() => setNav(false)}
              className="text-xl uppercase hover:border-b-4 hover:border-red-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/"
              onClick={() => setNav(false)}
              className="text-xl uppercase hover:border-b-4 hover:border-red-300"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="flex flex-row justify-between pt-20 items-center">
          <a href="/">
            <AiOutlineInstagram size={25} className="cursor-pointer" />
          </a>
          <a href="/">
            <AiOutlineFacebook size={25} className="cursor-pointer" />
          </a>
          <a href="/">
            <AiOutlineTwitter size={25} className="cursor-pointer" />
          </a>
        </div>
        <img src={Logo} alt="logo" className="h-24 w-24 mt-10" />
      </div>
    </nav>
  );
}

export default Navbar;
