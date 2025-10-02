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

export default projectData;
