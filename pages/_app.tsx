import '@/styles/globals.css';
import '@/styles/page.css';
import '@/styles/articlePage.css';
import '@/styles/linksPage.css';
import '@/styles/aboutPage.css';
import '@/styles/musicPage.css';
import '@/styles/papersPage.css';
import '@/styles/chatPage.css';
import '@/styles/swatchPage.css';
import '../components/terminalBootup.css';
import '../components/commandline.css';
import '../components/HomePage.css';
import '../components/articleElements.css';
import '../components/appBar.css';
import '../components/UISwitch.css';
import type { AppProps } from 'next/app';
import { store } from '../store/store';
import AppBar from '@/components/appBar';
import { Provider, useSelector } from 'react-redux';
import { selectIsCLI } from '@/store/homepageSlice';
import { useRouter } from 'next/router';

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps['Component'];
  pageProps: any;
}) {
  const isCLI = useSelector(selectIsCLI);
  const router = useRouter();
  return (
    <>
      <AppBar hidden={isCLI && router.pathname == '/'} />
      <Component {...pageProps} />
    </>
  );
}

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

export default App;
