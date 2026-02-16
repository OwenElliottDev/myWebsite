export interface ProjectMetadata {
  title: string;
  link: string;
  summary: string;
}

const projectData = new Map<string, ProjectMetadata>();

projectData.set('ingrain-server', {
  title: 'Ingrain Inference Server',
  link: 'https://github.com/OwenElliottDev/ingrain_server',
  summary:
    'A high performance scalable wrapper around NVIDIA Triton to serve Timm, OpenCLIP and Sentence Transformers models',
});

projectData.set('hnswlib_server', {
  title: 'HNSWLib Server',
  link: 'https://github.com/OwenElliottDev/hnswlib_server',
  summary:
    'A zero dependency statically linked Vector Search Engine built with HNSWLib, it supports filtering on schemaless metadata via its own DSL.',
});

projectData.set('arcache', {
  title: 'Arcache: Threadsafe Caches in Rust with a shared Trait',
  link: 'https://github.com/OwenElliottDev/arcache',
  summary:
    'A number of caching algorithm implementations written in rust using inner mutability for thread safety. Most interestingly they use the same trait as a base making them modular.',
});

projectData.set('tiny-guestbook', {
  title: 'Tiny Guestbook',
  link: 'https://github.com/OwenElliottDev/tiny-guestbook',
  summary:
    'A lightweight, self-hosted guestbook app that lets guests leave star ratings and reviews. Built with Rust and SQLite, the Docker image compresses down to just a few MB.',
});

projectData.set('requestor', {
  title: 'Requestor',
  link: 'https://github.com/OwenElliottDev/requestor',
  summary:
    'A lightweight cross platform app for sending HTTP requests and checking responses. Fully local with an included SQLite DB, syntax highlighting, and support for saving and tagging requests.',
});

projectData.set('unbound-docker', {
  title: 'Unbound Docker',
  link: 'https://github.com/OwenElliottDev/unbound-docker',
  summary:
    'A dockerised version of Unbound providing recursive DNS resolution. Built from source with the latest security patches, compressing down to just 7MB.',
});

export default projectData;
