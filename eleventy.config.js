import { VentoPlugin } from "eleventy-plugin-vento";

const PAGE_SIZE = 10;

function pagedPermalink(base, pageNumber) {
  return pageNumber === 1 ? `${base}/` : `${base}/${pageNumber}/`;
}

export const config = {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
    layouts: "_includes/layouts",
    data: "_data"
  }
};

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin, {
    autotrim: true
  });

  eleventyConfig.addPassthroughCopy({ "src/styles.css": "styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.png": "favicon.png" });
  eleventyConfig.addPassthroughCopy({ "src/_includes/css": "css" });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("menu", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter((item) => item.data.menu && item.data.menu.visible)
      .sort((a, b) => (a.data.menu.order || 999) - (b.data.menu.order || 999));
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    for (const post of collectionApi.getFilteredByGlob("src/posts/*.md")) {
      for (const tag of post.data.tags || []) {
        tags.add(tag);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b));
  });

  eleventyConfig.addCollection("authorList", (collectionApi) => {
    const authors = new Set();
    for (const post of collectionApi.getFilteredByGlob("src/posts/*.md")) {
      if (post.data.author) {
        authors.add(post.data.author);
      }
    }
    return [...authors].sort((a, b) => a.localeCompare(b));
  });

  eleventyConfig.addCollection("postsByTagMap", (collectionApi) => {
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
    const map = {};
    for (const post of posts) {
      for (const tag of post.data.tags || []) {
        map[tag] = map[tag] || [];
        map[tag].push(post);
      }
    }
    return map;
  });

  eleventyConfig.addCollection("postsByAuthorMap", (collectionApi) => {
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
    const map = {};
    for (const post of posts) {
      const author = post.data.author;
      if (!author) continue;
      map[author] = map[author] || [];
      map[author].push(post);
    }
    return map;
  });

  eleventyConfig.addCollection("tagPageEntries", (collectionApi) => {
    const entries = [];
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
    const tagMap = {};
    for (const post of posts) {
      for (const tag of post.data.tags || []) {
        tagMap[tag] = tagMap[tag] || [];
        tagMap[tag].push(post);
      }
    }
    const tags = Object.keys(tagMap).sort((a, b) => a.localeCompare(b));

    for (const tag of tags) {
      const encoded = encodeURIComponent(tag);
      const base = `/archive/tag/${encoded}`;
      const posts = tagMap[tag] || [];
      const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

      for (let index = 0; index < totalPages; index += 1) {
        const pageNumber = index + 1;
        entries.push({
          title: `Tagged \"${tag}\"`,
          results: posts.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE),
          permalink: pagedPermalink(base, pageNumber),
          pager: {
            pageNumber,
            totalPages,
            previous: pageNumber > 1 ? pagedPermalink(base, pageNumber - 1) : null,
            next: pageNumber < totalPages ? pagedPermalink(base, pageNumber + 1) : null
          }
        });
      }
    }

    return entries;
  });

  eleventyConfig.addCollection("authorPageEntries", (collectionApi) => {
    const entries = [];
    const posts = collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
    const authorMap = {};
    for (const post of posts) {
      if (!post.data.author) continue;
      authorMap[post.data.author] = authorMap[post.data.author] || [];
      authorMap[post.data.author].push(post);
    }
    const authors = Object.keys(authorMap).sort((a, b) => a.localeCompare(b));

    for (const author of authors) {
      const encoded = encodeURIComponent(author);
      const base = `/author/${encoded}`;
      const posts = authorMap[author] || [];
      const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

      for (let index = 0; index < totalPages; index += 1) {
        const pageNumber = index + 1;
        entries.push({
          title: `Posts by ${author}`,
          results: posts.slice(index * PAGE_SIZE, (index + 1) * PAGE_SIZE),
          permalink: pagedPermalink(base, pageNumber),
          pager: {
            pageNumber,
            totalPages,
            previous: pageNumber > 1 ? pagedPermalink(base, pageNumber - 1) : null,
            next: pageNumber < totalPages ? pagedPermalink(base, pageNumber + 1) : null
          }
        });
      }
    }

    return entries;
  });

  eleventyConfig.addFilter("dateFmt", (date, format = "HUMAN_DATE") => {
    const d = new Date(date);
    if (format === "DATETIME") {
      return d.toISOString();
    }
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  });

  eleventyConfig.addFilter("tagUrl", (tag) => `/archive/tag/${encodeURIComponent(tag)}/`);
  eleventyConfig.addFilter("authorUrl", (author) => `/author/${encodeURIComponent(author)}/`);
}
