export interface ArticleMetadata {
  title: string;
  route: string;
  displayImageURL: string;
  summary: string;
  author: string;
  tags: string;
}

const articleData = new Map<string, ArticleMetadata>();

articleData.set('unbound-docker', {
  title: 'Dockerising Unbound DNS',
  route: 'articles/unbound-docker',
  displayImageURL: '/article_assets/unbound-docker/hero.png',
  summary: 'Creating a small docker container for an updated unbound.',
  author: 'Owen Elliott',
  tags: 'Networking, DNS, self-hosting, privacy',
});

articleData.set('ui-ux-for-vector-search', {
  title: 'Rethinking Vector Search Experiences',
  route: 'articles/ui-ux-for-vector-search',
  displayImageURL: '/article_assets/ui-ux-vectorsearch/hero.webp',
  summary: 'Demonstrating UI components to deliver interesting vector search experiences.',
  author: 'Owen Elliott',
  tags: 'UI, UX, vector search',
});

articleData.set('contemplation', {
  title: 'Introspection Utilities in Python',
  route: 'articles/contemplation',
  displayImageURL: '/article_assets/contemplation/hero.webp',
  summary: 'Designing a library of introspection utilities in Python.',
  author: 'Owen Elliott',
  tags: 'introspection, coding, python',
});

articleData.set('multiprocessing-context', {
  title: 'A Multiprocessing Context for Python',
  route: 'articles/multiprocessing-context',
  displayImageURL: '/article_assets/multiprocessing-context/hero.webp',
  summary: 'A context API for multiprocessing in Python.',
  author: 'Owen Elliott',
  tags: 'multiprocessing, python, introspection',
});
export default articleData;
