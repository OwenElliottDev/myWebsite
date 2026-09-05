import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';
import articleContent from './articleContent/unbound-docker.md';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/unbound-docker/hero.png';

const Contemplation = () => {
  return (
    <div>
      <Head>
        <title>Dockerising Unbound DNS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:description"
          content="Creating a small docker container for an updated unbound."
        />
        <meta property="og:title" content="Dockerising Unbound DNS" />
        <meta property="og:image" content="" />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="Networking, DNS, self-hosting, privacy" />
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
