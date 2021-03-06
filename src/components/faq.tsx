import React, { useState, FC } from "react";

interface FAQProps {
  faqs: {
    title: string;
    description: () => JSX.Element;
  }[];
}

const FAQ: FC<FAQProps> = ({ faqs }): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    faqs && (
      <ul className="ml-0 pl-0">
        {faqs.map((faq, index) => (
          <li key={index} className="block" id={`faq_${index}`}>
            <button
              aria-controls={`faq-${index}`}
              className="block text-lg font-bold w-full text-left border-b-2 border-dark-300 py-4 mb-4"
              onClick={() => {
                if (index === activeIndex) {
                  setActiveIndex(null);
                } else {
                  setActiveIndex(index);
                }
              }}
            >
              {faq.title}
            </button>
            <div
              id={`faq-${index}`}
              className={`${
                index === activeIndex ? "block" : "hidden"
              } bg-dark-100 p-4 lg:p-8 rounded-lg shadow-lg`}
              aria-hidden={index === activeIndex ? "false" : "true"}
            >
              {faq.description()}
            </div>
          </li>
        ))}
      </ul>
    )
  );
};

export default FAQ;
