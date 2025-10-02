import Head from 'next/head';
const Music = () => {
  return (
    <div className="page">
      <Head>
        <title>Music</title>
        <meta name="description" content="Owen's musical endeavours" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="music-page">
        <h1 className="music-title">Music</h1>
        <h2 className={'band-name-link'}>
          <a href="http://axiomatictheory.band/">Axiomatic Theory</a>
        </h2>
        <p>
          Axiomatic Theory is a three piece instrumental metal band from Canberra, Australia. The
          band is composed of two eight string guitars and drums. Axiomatic Theory released their
          debut album Existential Flux in June of 2020, the ten track album is the culmination of a
          number of years of writing.
        </p>
        <div className="band-yt-embed">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/JVy2BNiK_hg"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div className="band-photos">
          <figure>
            <img
              src="https://d3kjqeh110p10g.cloudfront.net/website-images/Owen.webp"
              loading="lazy"
            />
            <figcaption>Owen</figcaption>
          </figure>
          <figure>
            <img
              src="https://d3kjqeh110p10g.cloudfront.net/website-images/Nic.webp"
              loading="lazy"
            />
            <figcaption>Nic</figcaption>
          </figure>
          <figure>
            <img
              src="https://d3kjqeh110p10g.cloudfront.net/website-images/Sam.webp"
              loading="lazy"
            />
            <figcaption>Sam</figcaption>
          </figure>
        </div>
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/album/4ZQaFscgGjnhiZE9XrlMUW?utm_source=generator"
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Music;
