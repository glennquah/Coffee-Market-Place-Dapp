import { useRef, useState } from 'react';
import {
  AiOutlineClose,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineWallet,
} from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import Logo from '../assets/NFTRoasterLogo.svg';
import ResponsiveContainer from './ResponsiveContainer';
import CartDialog from '../components/Dialog/CartDialog';
import useWallet from '../hooks/useWallet';

function Navbar() {
  const [nav, setNav] = useState(false);
  const { connectWallet, disconnectWallet, currentAccount } = useWallet();
  const hasReloaded = useRef(false);

  const handleNav = () => {
    setNav(!nav);
  };

  // Make it such when user logs in it reloads the page
  const handleConnectWallet = async () => {
    await connectWallet();
    if (!hasReloaded.current) {
      hasReloaded.current = true;
      window.location.reload();
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    if (!hasReloaded.current) {
      hasReloaded.current = true;
      window.location.reload();
    }
  };

  return (
    <nav className="fixed w-full h-24 shadow-xl use-main-bg z-10">
      <ResponsiveContainer>
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-12">
            <a href="/">
              <img src={Logo} alt="logo" className="h-24 w-24" />
            </a>
            <ul className="hidden sm:flex gap-12">
              <li>
                <a
                  href="/auction"
                  className="text-xl uppercase hover:border-b-4 hover:border-green-700"
                >
                  AUCTION
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  className="text-xl uppercase hover:border-b-4 hover:border-green-700"
                >
                  MARKETPLACE
                </a>
              </li>
              <li>
                <a
                  href="/voting"
                  className="text-xl uppercase hover:border-b-4 hover:border-green-700"
                >
                  VOTING
                </a>
              </li>
              <li>
                <a
                  href="/leaderboard"
                  className="text-xl uppercase hover:border-b-4 hover:border-green-700"
                >
                  LEADERBOARD
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block cursor-pointer">
              <CartDialog />
            </div>
            {/* Wallet Connection Section */}
            <button
              onClick={currentAccount ? handleDisconnectWallet : handleConnectWallet}
              className={`mx-5 p-3 rounded-full ${
                currentAccount ?  'bg-green-600 hover:bg-green-500' : 'bg-red-500 hover:bg-red-600'
              }`}
              aria-label={currentAccount ? 'Disconnect Wallet' : 'Connect Wallet'}
            >
              <AiOutlineWallet size={24} color="white" />
            </button>
            <div onClick={handleNav} className="sm:hidden cursor-pointer">
              <FaBars size={25} />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
      <div
        className={
          nav
            ? 'fixed left-0 top-0 w-62 sm:hidden h-screen bg-white p-10 ease-in-out duration-500 shadow-lg z-50'
            : 'fixed left-[-100%] top-0 w-48 sm:hidden h-screen bg-white p-10 ease-in-out duration-500 shadow-lg z-50'
        }
      >
        <div className="flex w-full items-center justify-end">
          <div onClick={handleNav} className="cursor-pointer">
            <AiOutlineClose size={25} />
          </div>
        </div>
        <ul className="flex flex-col gap-9 mt-10">
          <li>
            <a
              href="/auction"
              onClick={() => setNav(false)}
              className="text-xl uppercase hover:border-b-4 hover:border-red-300"
            >
              AUCTION
            </a>
          </li>
          <li>
            <a
              href="/marketplace"
              onClick={() => setNav(false)}
              className="text-xl uppercase hover:border-b-4 hover:border-red-300"
            >
              MARKETPLACE
            </a>
          </li>
          <li>
            <a
              href="/voting"
              onClick={() => setNav(false)}
              className="text-xl uppercase hover:border-b-4 hover:border-red-300"
            >
              VOTING
            </a>
          </li>
          <li>
            <a
              href="/leaderboard"
              onClick={() => setNav(false)}
              className="text-xl uppercase hover:border-b-4 hover:border-red-300"
            >
              LEADERBOARD
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
