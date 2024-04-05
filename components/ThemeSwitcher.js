// components/ThemeSwitcher.js
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSun,faMoon, faS} from "@fortawesome/free-solid-svg-icons"

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? <FontAwesomeIcon icon={faMoon} className='w-[30px] h-[30px]'/> : <FontAwesomeIcon icon={faSun} className='w-[30px] h-[30px] text-white'/>}
    </button>
  );
};

export default ThemeSwitcher;
