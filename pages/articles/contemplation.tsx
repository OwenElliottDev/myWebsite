import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';
import articleContent from './articleContent/contemplation.md';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/contemplation/hero.webp';

const Contemplation = () => {
  return (
    <div>
      <Head>
        <title>Contemplation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:description" content="Introspection utilities in Python" />
        <meta property="og:title" content="Contemplation" />
        <meta property="og:image" content="" />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="contemplation, coding, introspection, python" />
        <meta property="og:type" content="article" />
      </Head>
      <HeroImage imageURL={HERO_IMAGE} />
      <div className="article">
        <ArticleBlock>{articleContent}</ArticleBlock>
      </div>
    </div>
  );
};

export default Contemplation;
