import { HeroImage } from '@/components/articleElements';
import Head from 'next/head';
import React from 'react';

const ArticleBlock = React.lazy(() =>
  import('@/components/articleElements').then((module) => ({ default: module.ArticleBlock })),
);

const HERO_IMAGE = '/article_assets/ui-ux-vectorsearch/hero.webp';

const uiUxVectorSearch = () => {
  return (
    <div>
      <Head>
        <title>UI and UX in Vector Search</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:description"
          content="Desiging effective interfaces for multimodal vector search applications"
        />
        <meta property="og:title" content="UI and UX in Vector Search" />
        <meta property="og:image" content={HERO_IMAGE} />
        <meta name="author" content="Owen Elliott" />
        <meta name="tags" content="UI/UX, vector search, AI, design" />
        <meta property="og:type" content="article" />
      </Head>
      <HeroImage imageURL={HERO_IMAGE} />
      <div className="article">
        <ArticleBlock>
          {`
# UI Concepts for Vector Search

In this article we explore novel UI/UX concepts for implementing vector search in online image search applications. We also look at backend implementations to support these UI elements and explore techniques such as semantic filtering, weighted query combinations, custom instructions, and search as recommendation. The ability to compose queries as a combination of multiple elements via mathematical operations is a property of vector search that often goes under-utilised, these simple operations can turn vector search systems into semantic filters, recommenders, or even search ensembles. However, in the real world it is unreasonable to expect an end user to be aware of any of these mechanisms, the challenge becomes one of how these can be presented in at intuitive and usable manner by using an API. This article demonstrates some of the many ways this can be achieved by drawing influence from existing UX patterns and repurposing emerging UI patterns from LLM applications.

## Rethinking UI/UX for Vector Search

Different search backends lead to differing search experiences. This often requires unique methods of search interaction, especially for context-aware, semantic search functionality (like similarity search). While vector search, which leverages a vector database and vector embeddings, offers an alternative to the traditional keyword search, merely using it as a direct replacement doesn&#39;t tap into its full potential.

In this article, we&#39;ll embark on a journey to transform a basic search experience, introducing more advanced machine learning features tailored for vector search (in other words, we will build an AI application for search). The open source code used in this article is [part of our getting started tutorial](https://github.com/marqo-ai/getting_started_marqo_cloud/tree/main/e-commerce-demo) on github.

The elements discussed in this article can be used in concert to create unique search journeys through novel yet intuitive patterns (especially when working with unstructured data). In the example below we combine semantic filtering with search negations:

![Example of vector search](/article_assets/ui-ux-vectorsearch/example1.gif)

## The Search Bar
The design of the search bar has largely remained consistent over time. On most websites, the search apparatus consists of a straightforward text input and a button, often accompanied by options to filter and sort results.

While it's straight forward to integrate a vector search backend into this traditional search bar design and achieve high-quality results, the capabilities of vector search extend far beyond simply converting a single piece of text into a vector and computing results.

## Running Example
To illustrate the concepts introduced in this article, we'll progressively enhance our demo UI. This demo is derived from the Marqo cloud's getting started guide.

We'll begin with a basic search bar powered by a vector search backend.

![Example of vector search](/article_assets/ui-ux-vectorsearch/example2.gif)

While functional, this setup merely allows users to input queries and receive related results. However, this isn't particularly exciting.

## Semantic Filtering

Semantic filtering works by modifying the semantic representation of a query. Importantly, this can occur behind the scenes, abstracting complexity away from the user. These filters can be adjusted any time as they are purely semantic and do not rely on any additional metadata like traditional filtering does.

This technique draws inspiration from the way zero-shot classification tasks are executed using CLIP models. [An example of this can be seen on OpenAI's CLIP repo.](https://github.com/openai/CLIP/blob/main/notebooks/Prompt_Engineering_for_ImageNet.ipynb)

At its core, the approach is about enriching the user's query with additional descriptive language (part of the embedding model). This is reminiscent of prompt engineering techniques employed with generative image models. We achieve this by defining a dictionary that associates filters with specific prompt templates.

\`\`\`python
STYLE_MAPPING = {
    "stylized": "An image of a <QUERY> rendered in a unique, stylized manner",
    "cartoon": "An image in the style of Saturday morning cartoons featuring a <QUERY>",
    "abstract": "An image inspired by modern art, abstractly representing a <QUERY>",
    "pixelart": "An 8-bit or 16-bit pixel art representation of a <QUERY>",
    "grayscale": "A black and white, monochromatic image of a <QUERY>",
    "cyberpunk": "An image of a <QUERY> set in a neon-lit, futuristic cyberpunk world",
    "steampunk": "An image blending Victorian and industrial elements, depicting a <QUERY>",
    "realism": "A hyper-realistic, detailed image of a <QUERY>",
    "surreal": "A surreal, dream-like image of a <QUERY>",
    "popart": "An image in the style of pop art, featuring a <QUERY>",
    "watercolor": "A watercolor painting-like image of a <QUERY>",
    "oilpaint": "An oil painting-like image, rich in texture, of a <QUERY>",
    "glitch": "A glitch-art styled, distorted image of a <QUERY>",
    "neon": "An image of a <QUERY> with vibrant, neon colors",
    "fantasy": "A fantastical, otherworldly image of a <QUERY>",
    "comic": "An image resembling a comic book panel, featuring a <QUERY>",
    "outline": "An outline line art depiction of a <QUERY>",
}
\`\`\`

In this setup, __\`<QUERY>\`__ is seamlessly replaced with the user's input query. This method allows us to filter search results based on image characteristics without relying on metadata.

![Example of vector search](/article_assets/ui-ux-vectorsearch/example3.gif)

The example prompts above were crafted with the help of Open AI's ChatGPT (based on the gpt generative ai large language model), proving its efficacy for such tasks.

This concept can be extended in many directions such as style based filtering for fashion trends or interior design. It can also be used to control the type and quality of results that are surfaced from search queries. Prompting can be used to modify or expand the query without the users knowledge, for example if your dataset has many images of dubious quality then the query can be prefixed with a string like "high quality professional photo of" to improve the quality of the results.

## The Case for Multiple Search Bars
Why confine ourselves to just one search bar? Vectors encapsulate the semantic essence of the text they represent, and their true power emerges when they're combined using elementary vector operations. By taking a weighted average of vectors with positive weights, we can produce a new vector that seamlessly blends the semantics of its contributors. The introduction of negative weights further enriches this dynamic, enabling us to effectively subtract the semantics of one vector from another, offering a nuanced and multi-layered search experience. These variables allow us to unlock the power of vector data.

### More of This? Less of That? Search Refinement Mechanisms
We've showcased this approach on our demo for quite some time. Beyond the conventional search bar, we've incorporated two supplementary text input fields. These allow users to amplify or diminish specific aspects of their query. To implement this element the search terms from the three bars are combined in the backend via a weighted average. The negative term is given a large negative weight in order to steer the results away from that part of the vector space. The positive search term is modified by prepending the main search term to it, this helps keep the search aligned with the main query and avoids having results that might match the main query and positive term independently.

\`\`\`python
query = {
    "shoes": 1.0,
    "shoes, mens business": 0.6,
    "lacers": -1.1
}
\`\`\`

![Example of vector search](/article_assets/ui-ux-vectorsearch/example4.gif)

While the ability to add or negate terms might be absent in traditional search engines, for vector search, it's an intrinsic feature, amplifying its potency and adaptability.

## Personalisation through Vector Search
### Search as a Recommender
Vector search paves the way for content recommendations without the need for external systems like collaborative filtering or heuristic-based recommenders (or the pain of productizing "traditional" machine learning models). Additional query terms or vectors of existing documents in the index can be harnessed as query expansion terms, steering search results towards analogous items.

Recommendations can be broadly categorised into two types:

+ __Intra-category Recommendations:__ These suggest items from the same category. For instance, recommending another watch based on a user's preference for a specific watch model.
+ __Inter-category Recommendations:__ Here, suggestions span different categories. An example might be recommending a couch influenced by a user's affinity for a certain rug and coffee table.

The documents used for recommendations can be specified by the user as is done in our example or they can be included implicitly by looking at a current shopping cart, purchase history, or browsing history. In the examples below we add additional images into the query which are embedded by CLIP models alongside the query term and then combined with a weighted average. Another effective way to implement this is the use the vectors of the original documents which may contain additional information (in the case of this example data it would include brand, name, and image in one vector per product).

__Inter-category recommendation:__

![Example of vector search](/article_assets/ui-ux-vectorsearch/example5.gif)

__Intra-category recommendation:__

![Example of vector search](/article_assets/ui-ux-vectorsearch/example6.gif)

## Custom Instructions
A design pattern that emerged with GPT is the introduction of custom instructions. Here, the system prompts users to share specific details, facilitating more tailored results. These instructions can come explicitly from the user as is done here however they can also be derived from existing information at hand such as a user profile of interactions history.

In the realm of search, these can manifest as persistent query expansions linked to individual users. The custom instructions are combined with the query with a weighted average.

![Example of vector search](/article_assets/ui-ux-vectorsearch/example7.gif)

Now, users can guide the search engine based on their unique preferences. This guidance can be explicit, such as "I'm partial to the color orange," or inferred from personal tidbits like "I love skateboarding" or "Hiking is my favourite hobby!".

## Tying Vector Search into Your Applications

While not all techniques discussed may be applicable to every use case or dataset, they hold the potential to significantly enhance the real-time search experience for users.

Mathematical operations on vectors can be adeptly abstracted, paving the way for intuitive interactions through natural language. Such methods can be harnessed to create novel search avenues or to underpin recommendation systems without revealing their intricate workings to the end-users.

As organisations make the shift from traditional keyword search systems to more advanced vector search systems, giving due consideration to the user experience becomes paramount. In essence, a holistic approach, where UX and search go hand in hand, can prove to be a game-changer.
`}
        </ArticleBlock>
      </div>
    </div>
  );
};

export default uiUxVectorSearch;
