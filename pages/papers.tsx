import paperData, { PaperMetadata } from '@/utils/paperData';
import Head from 'next/head';
import React, { useState } from 'react';

const PaperDisplay = ({
  title,
  abstract,
  conference,
  date,
  displayImageURL,
  arxivURL,
  officialURL,
}: PaperMetadata) => {
  const [expandAbstract, setExpandAbstract] = useState(false);
  const truncatedAbstractLength = 300;
  const displayAbstract =
    !expandAbstract && abstract.length > truncatedAbstractLength
      ? abstract.substring(0, truncatedAbstractLength) + '...'
      : abstract;

  return (
    <div className={'paper-list-element'}>
      <img src={displayImageURL} alt={title} />
      <div className="paper-title-abstract">
        <h3>{title}</h3>
        <p>{displayAbstract}</p>
        {abstract.length > truncatedAbstractLength && (
          <button onClick={() => setExpandAbstract(!expandAbstract)}>
            {expandAbstract ? 'Show Less' : 'Show More'}
          </button>
        )}
        <div className="paper-meta">
          {conference && <span>{conference}</span>}
          {date && <span>{date}</span>}
          <a href={arxivURL} target="_blank" rel="noopener noreferrer">
            arXiv
          </a>
          {officialURL && (
            <a href={officialURL} target="_blank" rel="noopener noreferrer">
              Conference
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Papers = () => {
  const paperMetadatas: PaperMetadata[] = Array.from(paperData.values());

  return (
    <div className="page">
      <Head>
        <title>Papers</title>
        <meta name="og:title" content="Papers" />
        <meta name="og:description" content="Papers authored by Owen Elliott" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="papers-title">Papers</h1>
      <div className="papers-list">
        {paperMetadatas.map((metadata: PaperMetadata, i: number) => (
          <PaperDisplay
            key={i.toString()}
            title={metadata.title}
            abstract={metadata.abstract}
            conference={metadata.conference}
            date={metadata.date}
            displayImageURL={metadata.displayImageURL}
            arxivURL={metadata.arxivURL}
            officialURL={metadata.officialURL}
          />
        ))}
      </div>
    </div>
  );
};

export default Papers;
