import { FC, ReactElement } from 'react';
import { GoMarkGithub } from 'react-icons/go';

const iconList = [{ icon: <GoMarkGithub />, link: 'https://github.com/aio39' }];

const IconLink: FC<{ iconData: { icon: ReactElement; link: string } }> = ({
  iconData: { icon, link },
}) => {
  return (
    <ul>
      <a href={link} className="text-2xl">
        {icon}
      </a>
    </ul>
  );
};

const Footer = () => {
  return (
    <footer className=" w-full h-14 flex flex-col justify-center items-center  px-8 mb-4">
      <div className="w-full  border-t-2 border-gray-300  "></div>
      <small className="text-base my-2">
        Copyright @ {new Date().getFullYear()}, All Right Reserved Aio
      </small>
      {iconList.map((iconData) => {
        return <IconLink iconData={iconData} />;
      })}
    </footer>
  );
};

export default Footer;
