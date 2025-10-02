import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface AppBarElementData {
  text: string;
  link: string;
}

const appBarElements: AppBarElementData[] = [
  { text: 'Home', link: '/' },
  // { text: 'About', link: '/about' },
  { text: 'Articles', link: '/articles' },
  { text: 'Papers', link: '/papers' },
  // { text: 'Music', link: '/music' },
  // { text: 'Links', link: '/links' },
];

const AppBarElement = ({
  text,
  link,
  isArticle,
}: {
  text: string;
  link: string;
  isArticle: boolean;
}) => {
  return (
    <Link style={{ textDecoration: 'none', color: 'white' }} href={link}>
      <div className={`app-bar-element ${isArticle ? 'app-bar-element-article' : ''}`}>
        <p>{text}</p>
      </div>
    </Link>
  );
};

type AppBarProps = {
  hidden: boolean;
};

const AppBar = ({ hidden }: AppBarProps) => {
  const router = useRouter();
  const [appBarClass, setAppBarClass] = useState(hidden ? 'app-bar-hide' : 'app-bar-show');
  const [isArticle, setIsArticle] = useState(false);

  useEffect(() => {
    if (!hidden) {
      setAppBarClass('app-bar-show');
    } else {
      setAppBarClass('app-bar-hide');
    }
  }, [hidden]);

  useEffect(() => {
    if (router.pathname == '/articles/[article]') {
      setIsArticle(true);
    } else {
      setIsArticle(false);
    }
  }, [router.pathname]);

  return (
    <div className="app-bar">
      <div className={`${appBarClass} ${isArticle ? 'app-bar-article' : ''}`}>
        {appBarElements.map((el, i) => {
          return (
            <AppBarElement text={el.text} link={el.link} isArticle={isArticle} key={i.toString()} />
          );
        })}
      </div>
    </div>
  );
};

export default AppBar;
