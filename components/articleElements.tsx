import React from 'react';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CodeProps {
  language: string;
  children: string;
}

export const CodeBlock = ({ language, children }: CodeProps) => {
  return (
    <div className="article-code-block">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        codeTagProps={{
          style: {
            fontSize: typeof window !== 'undefined' && window.innerWidth <= 768 ? '14px' : '16px',
          },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

interface TextProps {
  children: string;
}

export const ArticleBlock = ({ children }: TextProps) => {
  return (
    <div className="article-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
};

interface HeroImageProps {
  imageURL: string;
}

export const HeroImage = ({ imageURL }: HeroImageProps) => {
  return <img className="article-image-header" src={imageURL} alt="Article Header Image" />;
};
