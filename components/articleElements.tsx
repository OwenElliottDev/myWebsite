import React from 'react';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TextProps {
  children: string;
}

export const ArticleBlock = ({ children }: TextProps) => {
  return (
    <div className="article-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children: codeChildren, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match) {
              return (
                <div className="article-code-block">
                  <SyntaxHighlighter
                    language={match[1]}
                    style={vscDarkPlus}
                    codeTagProps={{
                      style: {
                        fontSize:
                          typeof window !== 'undefined' && window.innerWidth <= 768
                            ? '14px'
                            : '16px',
                      },
                    }}
                  >
                    {String(codeChildren).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }
            return (
              <code className={className} {...props}>
                {codeChildren}
              </code>
            );
          },
          pre({ children: preChildren }) {
            return <>{preChildren}</>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

interface HeroImageProps {
  imageURL: string;
}

export const HeroImage = ({ imageURL }: HeroImageProps) => {
  return <img className="article-image-header" src={imageURL} alt="Article Header Image" />;
};
