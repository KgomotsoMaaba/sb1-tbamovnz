import React, { useState } from 'react';
import { MapPin, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { getDirectoryItems } from '../../data/directory';

interface DirectoryCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const Directory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Mock directory categories
  const categories: DirectoryCategory[] = [
    { id: 'adventure', name: 'Adventure', icon: '🏞️', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { id: 'accommodation', name: 'Accommodation', icon: '🏠', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { id: 'dining', name: 'Dining', icon: '🍽️', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    { id: 'wellness', name: 'Wellness', icon: '💆', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
  ];

  // Get directory items
  const directoryItems = getDirectoryItems();
  
  // Filter items based on search query and selected category
  const filteredItems = directoryItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (categoryId: string) => {
    setSelectedCategory(prevCategory => 
      prevCategory === categoryId ? null : categoryId
    );
  };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItem(prevItem => 
      prevItem === itemId ? null : itemId
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="font-heading font-semibold text-lg mb-4">Directory</h2>
      
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search directory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-8 rounded border border-primary-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500"
        />
        <Search size={16} className="absolute left-2.5 top-2.5 text-textSecondary dark:text-primary-200" />
      </div>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`
              px-3 py-1 rounded-full text-sm transition-colors flex items-center
              ${selectedCategory === category.id 
                ? category.color
                : 'bg-primary-100 dark:bg-gray-700 text-textPrimary dark:text-primary-100'}
            `}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Directory Listings */}
      <div className="space-y-3 mt-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="border border-primary-100 dark:border-gray-700 rounded-md overflow-hidden transition-all duration-200"
            >
              <div 
                onClick={() => toggleItemExpansion(item.id)}
                className={`
                  p-3 cursor-pointer flex justify-between items-center
                  ${expandedItem === item.id ? 'bg-primary-50 dark:bg-gray-700' : ''}
                  hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors
                `}
              >
                <div className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm
                    ${
                      item.category === 'adventure' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      item.category === 'accommodation' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      item.category === 'dining' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                    }
                  `}>
                    {
                      item.category === 'adventure' ? '🏞️' :
                      item.category === 'accommodation' ? '🏠' :
                      item.category === 'dining' ? '🍽️' : '💆'
                    }
                  </div>
                  <div>
                    <h3 className="font-medium text-textPrimary dark:text-primary-100">{item.name}</h3>
                    <p className="text-xs text-textSecondary dark:text-primary-200 flex items-center">
                      <MapPin size={10} className="mr-1" />
                      {item.location}
                    </p>
                  </div>
                </div>
                {expandedItem === item.id ? (
                  <ChevronUp size={16} className="text-textSecondary dark:text-primary-200" />
                ) : (
                  <ChevronDown size={16} className="text-textSecondary dark:text-primary-200" />
                )}
              </div>
              
              {expandedItem === item.id && (
                <div className="p-3 border-t border-primary-100 dark:border-gray-700 animate-slide-down">
                  <p className="text-sm mb-3">{item.description}</p>
                  {item.website && (
                    <a 
                      href={item.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-accent-700 dark:text-accent-400 hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-textSecondary dark:text-primary-200 py-4">
            No items found. Try adjusting your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Directory;