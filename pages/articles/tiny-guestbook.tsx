import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';
import articleContent from './articleContent/tiny-guestbook.md';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/tiny-guestbook/hero.png';

const Contemplation = () => {
  return (
    <div>
      <Head>
        <title>Tiny Guestbook</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:description"
          content="Building a small statically linked rust webserver for a guestbook app into a tiny multi-arch docker container."
        />
        <meta
          property="og:title"
          content="Building a Tiny Guestbook App with Rust and Scratch Containers"
        />
        <meta property="og:image" content="" />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="Docker, self-hosting, rust" />
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
