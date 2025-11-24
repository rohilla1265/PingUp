import React from 'react';
import { NavLink } from 'react-router-dom';
import { menuItemsData } from '../src/assets/assets';
import { Icon } from 'lucide-react';
// If your data is in format: [[to, label, Icon], ...]
const MenuItems = ({ setSidebarOpen }) => {
    return(
        <div className="flex flex-col space-y-2">
            {menuItemsData.map(({to, label, Icon}) => (
                <NavLink 
                    key={to} 
                    to={to} 
                    end={to === '/'}
                    onClick={() => setSidebarOpen && setSidebarOpen(false)}
                    className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive 
                                ? 'bg-blue-100 text-indigo-500 font-medium' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`
                    }
                >
                    <Icon size={20} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </div>
    )
}
export default MenuItems;
// If your data is in format: [[to, label, Icon], ...]