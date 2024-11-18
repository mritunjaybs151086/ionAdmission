import React, { useState } from "react";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  onSelectTab: (e: number) => void;
  activeTab: number;
}

const Tabs: React.FC<TabsProps> = ({ items, onSelectTab, activeTab = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(activeTab);

  return (
    <div className='mb-4 border-b border-gray-200 dark:border-gray-700'>
      <ul className='flex flex-wrap -mb-px text-sm font-medium text-center' role='tablist'>
        {items.map((item, index) => (
          <li key={index} className='me-2' role='presentation'>
            <button
              className={`inline-block px-2 py-1 border-b-2 rounded-t-lg ${
                activeIndex === index
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
              type='button'
              role='tab'
              aria-selected={activeIndex === index}
              onClick={() => {
                setActiveIndex(index);
                onSelectTab(index);
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className='px-0 py-3 rounded-lg '>{items[activeIndex].content}</div>
    </div>
  );
};

export default Tabs;
