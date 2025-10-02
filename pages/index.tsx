import React, { useEffect } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsCLI, setIsCLI } from '@/store/homepageSlice';
import UISwitch from '@/components/UISwitch';
import { CommandLine } from '@/components/commandline';
import HomePage from '@/components/HomePage';

export default function Home() {
  const isCLI = useSelector(selectIsCLI);
  const dispatch = useDispatch();

  useEffect(() => {
    const url = new URL(window.location.href);
    let specifiedUI = url.searchParams.get('UI');
    if (!specifiedUI) return;
    if (specifiedUI === 'GUI') dispatch(setIsCLI(false));
  }, []);

  return (
    <>
      <Head>
        <title>Owen Elliott</title>
        <meta name="description" content="Personal website for Owen Elliott" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={'render-controls'}>
          <UISwitch />
        </div>
        {isCLI ? (
          <CommandLine />
        ) : (
          <div className="page">
            <HomePage />
          </div>
        )}
      </main>
    </>
  );
}
