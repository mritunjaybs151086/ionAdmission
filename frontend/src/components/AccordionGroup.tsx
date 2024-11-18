import React, { useState } from "react";

interface AccordionGroupProps {
  title: string;
  children: React.ReactNode;
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="border-b w-full">
      <div
        className="flex items-center justify-between p-4 cursor-pointer bg-gray-100 hover:bg-gray-200"
        onClick={toggleAccordion}
      >
        <h3 className="font-semibold">{title}</h3>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div className="p-4 bg-white">
          <table className="min-w-full">
            <tbody>{children}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccordionGroup;
