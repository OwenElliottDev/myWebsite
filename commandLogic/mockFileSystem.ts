import articleData from '@/utils/articleData';

const articleKeys = Array.from(articleData.keys());

const directoryStructure = new Map();

directoryStructure.set('', ['About', 'Articles', 'Papers', 'Music', 'Links']);
directoryStructure.set('About', ['about.page', 'about.txt']);
directoryStructure.set('Articles', ['articles.page', ...articleKeys]);
for (const key of articleKeys) {
  directoryStructure.set(key, [`${key}.page`]);
}
directoryStructure.set('Papers', ['papers.page']);
directoryStructure.set('Music', ['music.page']);
directoryStructure.set('Links', ['github.lnk', 'linkedin.lnk']);

export default directoryStructure;

const lnkMap = new Map();
lnkMap.set('github.lnk', 'https://github.com/OwenPendrighElliott/');
lnkMap.set('linkedin.lnk', 'https://www.linkedin.com/in/owen-elliott-345254166/');

export { lnkMap };

const pageMap = new Map();
pageMap.set('about.page', '/about');
pageMap.set('articles.page', '/articles');
for (const [key, article] of articleData) {
  pageMap.set(`${key}.page`, `/${article.route}`);
}
pageMap.set('papers.page', '/papers');
pageMap.set('music.page', '/music');
pageMap.set('links.page', '/links');

const routeToDirectory: Record<string, string[]> = {
  '/': [''],
  '/about': ['', 'About'],
  '/articles': ['', 'Articles'],
  '/papers': ['', 'Papers'],
  '/music': ['', 'Music'],
  '/links': ['', 'Links'],
};
for (const [key, article] of articleData) {
  routeToDirectory[`/${article.route}`] = ['', 'Articles', key];
}

export { routeToDirectory };

const directoryToRoute: Record<string, string> = {
  '': '/',
  About: '/about',
  Articles: '/articles',
  Papers: '/papers',
  Music: '/music',
  Links: '/links',
};
for (const [key, article] of articleData) {
  directoryToRoute[key] = `/${article.route}`;
}

export { directoryToRoute };

export { pageMap };
