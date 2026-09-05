import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';
import articleContent from './articleContent/ui-ux-for-vector-search.md';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/ui-ux-vectorsearch/hero.webp';

const uiUxVectorSearch = () => {
  return (
    <div>
      <Head>
        <title>UI and UX in Vector Search</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:description"
          content="Desiging effective interfaces for multimodal vector search applications"
        />
        <meta property="og:title" content="UI and UX in Vector Search" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="UI/UX, vector search, AI, design" />
        <meta property="og:type" content="article" />
      </Head>
      <HeroImage imageURL={HERO_IMAGE} />
      <div className="article">
        <ArticleBlock>{articleContent}</ArticleBlock>
      </div>
    </div>
  );
};

export default uiUxVectorSearch;
