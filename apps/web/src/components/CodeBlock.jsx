
import React from 'react';

const CodeBlock = ({ content, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <pre className="bg-muted border border-primary/20 rounded-lg px-6 py-4 max-h-96 overflow-auto text-sm font-mono text-foreground leading-relaxed shadow-[0_0_15px_hsl(var(--primary)/0.1)]">
        <code>{content}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
