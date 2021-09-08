import { IoSettingsSharp } from 'react-icons/io5';
import DarkModeToggle from './DarkModeToggle';
const Navigation = () => {
  return (
    <header className="flex flex-row justify-between px-4 py-2 mb-6  bg-mint w-full h-12 shadow-lg ">
      <div>
        <IoSettingsSharp className="text-3xl cursor-pointer" />
      </div>
      <div>
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navigation;