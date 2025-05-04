import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AuthButton from '../auth/AuthButton';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full z-50 bg-primary-100/95 backdrop-blur-sm dark:bg-gray-800/95 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Calendar 
            size={16}
            className="text-accent-800 dark:text-accent-400 mr-2"
          />
          <Link to="/" className="font-heading text-base text-accent-800 dark:text-accent-400">
            Open<span className="text-secondary-400">Calendar</span>
          </Link>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8 font-heading text-[14px]">
            <li>
              <Link to="/" className="text-textPrimary dark:text-primary-100 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
                Calendar
              </Link>
            </li>
            <li>
              <Link to="/directory" className="text-textPrimary dark:text-primary-100 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
                Directory
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-textPrimary dark:text-primary-100 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-textPrimary dark:text-primary-100 hover:text-accent-700 dark:hover:text-accent-400 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <AuthButton />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-primary-200 dark:bg-gray-700 text-textPrimary dark:text-primary-100 hover:bg-primary-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button
            className="md:hidden p-2 rounded-full bg-primary-200 dark:bg-gray-700 text-textPrimary dark:text-primary-100 hover:bg-primary-300 dark:hover:bg-gray-600 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-50 dark:bg-gray-800 animate-slide-down">
          <ul className="container mx-auto px-4 py-4 space-y-4 font-heading text-[14px]">
            <li>
              <Link to="/" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors">
                Calendar
              </Link>
            </li>
            <li>
              <Link to="/directory" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors">
                Directory
              </Link>
            </li>
            <li>
              <Link to="/about" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;