import Head from 'next/head';

type LogoAndLanguageDisplayProps = {
  languagesAndLogos: string[][];
};

const LogoAndLanguageDisplay = ({ languagesAndLogos }: LogoAndLanguageDisplayProps) => {
  return (
    <div className={'language-display'}>
      <h2>Languages I mostly work with</h2>
      <div className={'languages'}>
        {languagesAndLogos.map((lal: string[], i: number) => {
          return (
            <div key={i.toString()} className={'language-name-pair'}>
              <img src={lal[1]} alt={lal[0] + ' logo'} />
              <div>{lal[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const About = () => {
  const languagesAndLogos = [
    ['Python', '/Python.webp'],
    ['C++', '/CPP.webp'],
    ['JavaScript', '/JS.webp'],
    ['TypeScript', '/TS.webp'],
    ['SAS', '/SAS.webp'],
    ['SQL', '/sql.webp'],
  ];

  return (
    <div className="page">
      <Head>
        <title>About</title>
        <meta name="description" content="About Owen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="about-page">
        <h1 className="about-title">About</h1>
        <p className="about-paragraph">
          Hi I&apos;m Owen! I am passionate about all things systems architecture, software
          engineering and AI! I am a solutions architect with experience in system archtiecture,
          softwarem simulation, and AI across government, banking, mining, defence, and e-commerce.
          I graduated from ANU with a double degree in IT and Music where I focused on classical
          guitar and data science.
        </p>
        <LogoAndLanguageDisplay languagesAndLogos={languagesAndLogos} />
      </div>
    </div>
  );
};

export default About;
