import React, { useState } from 'react';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  expandedClassName?: string;
  isDark?: boolean;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 100,
  className = '',
  expandedClassName = '',
  isDark = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = text.length > maxLength;

  if (!needsTruncation) {
    return <span className={className}>{text}</span>;
  }

  const truncatedText = text.slice(0, maxLength).trim() + '...';

  return (
    <span className={isExpanded ? expandedClassName || className : className}>
      {isExpanded ? text : truncatedText}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`ml-1 text-xs font-medium ${
          isDark
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-blue-600 hover:text-blue-700'
        }`}
      >
        {isExpanded ? 'show less' : 'show more'}
      </button>
    </span>
  );
};

export default TruncatedText;
