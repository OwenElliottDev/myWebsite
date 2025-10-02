import articleData, { ArticleMetadata } from '@/utils/articleData';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

type ArticleDisplayProps = {
  title: string;
  displayImageURL: string;
  summary: string;
};

const ArticleDisplay = ({ title, displayImageURL, summary }: ArticleDisplayProps) => {
  return (
    <div className={'article-list-element'}>
      <img src={displayImageURL} alt={title} />
      <div className="article-title-desc">
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
    </div>
  );
};

const Articles = () => {
  const articleMetadatas: ArticleMetadata[] = Array.from(articleData.values());

  return (
    <div className="page">
      <Head>
        <title>Articles</title>
        <meta name="og:title" content="Articles" />
        <meta name="og:description" content="Landing page for Owen's articles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="articles-title">Articles</h1>
      <div className="article-list">
        {articleMetadatas.map((metadata: ArticleMetadata, i: number) => (
          <Link
            key={i.toString()}
            style={{ textDecoration: 'none', color: 'white' }}
            href={metadata.route}
          >
            <ArticleDisplay
              title={metadata.title}
              displayImageURL={metadata.displayImageURL}
              summary={metadata.summary}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Articles;
