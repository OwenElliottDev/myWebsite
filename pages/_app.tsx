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
import { Provider } from 'react-redux';

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps['Component'];
  pageProps: any;
}) {
  return (
    <>
      <AppBar hidden={false} />
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
