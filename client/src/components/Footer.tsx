import {
  Facebook,
  GitHub,
  Instagram,
  LinkedIn,
  Telegram,
  Twitter,
} from '@mui/icons-material';
import ResponsiveContainer from './ResponsiveContainer';

function Footer() {
  return (
    <footer className="fixed bottom-0 w-full h-24 shadow-xl use-main-bg">
      <ResponsiveContainer>
        <div className="flex flex-col items-center justify-center h-full gap-3 bg-primary-white py-4 rounded-2xl">
          <h2>Follow us</h2>
          <div className="flex gap-20">
            <Facebook fontSize="large" className="cursor-pointer" />
            <GitHub fontSize="large" className="cursor-pointer" />
            <Twitter fontSize="large" className="cursor-pointer" />
            <Telegram fontSize="large" className="cursor-pointer" />
            <Instagram fontSize="large" className="cursor-pointer" />
            <LinkedIn fontSize="large" className="cursor-pointer" />
          </div>
        </div>
      </ResponsiveContainer>
    </footer>
  );
}

export default Footer;
