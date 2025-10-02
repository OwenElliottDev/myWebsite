import Head from 'next/head';
import Image from 'next/image';
import React from 'react';

interface LinkData {
  src: string;
  alt: string;
  title: string;
  description: string;
  href: string;
}

const LinkData: LinkData[] = [
  {
    src: '/GitHubProfilePic.webp',
    alt: 'GitHub profile picture for Owen Pendrigh Elliott',
    title: 'GitHub',
    description:
      'Visit my GitHub to see some of the code for my personal projects, open source contributions and the code for this website!',
    href: 'https://github.com/OwenPendrighElliott/',
  },
  {
    src: '/LinkedInProfilePic.webp',
    alt: 'LinkedIn profile picture for Owen Pendrigh Elliott',
    title: 'LinkedIn',
    description:
      'Connect with me on LinkedIn to see updates or to chat about anything software, systems and AI.',
    href: 'https://www.linkedin.com/in/owen-elliott-345254166/',
  },
  {
    src: '/AxiomaticTheoryBand.webp',
    alt: 'A photo of the band Axiomatic Theory',
    title: 'Axiomatic Theory',
    description: 'Check out my band Axiomatic Theory',
    href: 'https://www.youtube.com/@axiomatictheory2100',
  },
];

const LinkCard = (props: LinkData) => {
  return (
    <a target="_blank" rel="noreferrer" href={props.href}>
      <div className="link">
        <Image width={100} height={100} src={props.src} alt={props.alt} />
        <div className="link-title-para">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
      </div>
    </a>
  );
};

const LinksToOtherSites = () => {
  return (
    <div className="page">
      <Head>
        <title>Links</title>
        <meta name="description" content="Links for Owen's related accounts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="links-title">Links</h1>
      <div className="links">{LinkData.map((link) => LinkCard(link))}</div>
    </div>
  );
};

export default LinksToOtherSites;
