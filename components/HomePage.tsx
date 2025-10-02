import React from 'react';
import Link from 'next/link';

import articleData from '@/utils/articleData';
import paperData from '@/utils/paperData';
import projectData from '@/utils/projectData';

const HomePage = () => {
  const latestArticles = Array.from(articleData.entries()).slice(0, 3);
  const latestPapers = Array.from(paperData.entries()).slice(0, 3);
  const latestProjects = Array.from(projectData.entries()).slice(0, 3);

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Owen Elliott</h1>
        <p className="tagline">
          Solutions Architect & ML Engineer specializing in Information Retrieval
        </p>
      </section>

      <section className="intro-section">
        <p>
          I am a solutions architect with experience building AI-powered systems that solve complex
          real-world problems. I have a diverse background ranging from simulation engines for
          mining operations to creating real-time multimodal personalization systems that serve
          millions of users daily.
        </p>
        <p>
          Currently, my focus is in information retrieval and vector search technologies. At Marqo,
          I built scalable multimodal search systems that power major eCommerce platforms, combining
          cutting-edge research in dense retrieval and multimodal representation learning with
          production-grade engineering. I actively contribute to the field through research on
          approximate nearest neighbor algorithms and vector search implementation.
        </p>
        <p>On this site you will find some of my articles, projects, and papers!</p>
      </section>

      <section className="content-section">
        <h2>Latest Articles:</h2>
        <div className="articles-grid">
          {latestArticles.map(([key, article]) => (
            <Link href={`/${article.route}`} key={key} className="article-card">
              <img src={article.displayImageURL} alt={article.title} className="article-image" />
              <div className="article-content">
                <h3>{article.title}</h3>
                <p className="article-summary">{article.summary}</p>
                <div className="article-tags">
                  {article.tags.split(', ').map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/articles" className="view-all-link">
          View all articles →
        </Link>
      </section>

      <section className="content-section">
        <h2>Recent Papers:</h2>
        <div className="papers-grid">
          {latestPapers.map(([key, paper]) => (
            <article key={key} className="paper-card">
              <img src={paper.displayImageURL} alt={paper.title} className="paper-image" />
              <div className="paper-content">
                <h3>{paper.title}</h3>
                <div className="paper-meta">
                  <span className="conference">{paper.conference}</span>
                  <span className="date">
                    {new Date(paper.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                <p className="paper-abstract">{paper.abstract.substring(0, 200)}...</p>
                <div className="paper-links">
                  <a
                    href={paper.arxivURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="paper-link"
                  >
                    arXiv
                  </a>
                  {paper.officialURL && (
                    <a
                      href={paper.officialURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="paper-link"
                    >
                      Official
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <Link href="/papers" className="view-all-link">
          View all papers →
        </Link>
      </section>

      <section className="content-section">
        <h2>Featured Projects:</h2>
        <div className="projects-grid">
          {latestProjects.map(([key, project]) => (
            <a
              href={project.link}
              key={key}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card"
            >
              <div className="project-content">
                <h3>{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
                <div className="project-footer">
                  <span className="project-link-cta">View on GitHub →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <Link href="/projects" className="view-all-link">
          View all projects →
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
