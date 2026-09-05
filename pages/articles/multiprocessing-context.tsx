import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';
import articleContent from './articleContent/multiprocessing-context.md';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/multiprocessing-context/hero.webp';

const Contemplation = () => {
  return (
    <div>
      <Head>
        <title>A Multiprocessing Context for Python</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:description" content="A context API for multiprocessing" />
        <meta property="og:title" content="A Multiprocessing Context for Python" />
        <meta property="og:image" content="" />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="multiprocessing, python, introspections" />
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
