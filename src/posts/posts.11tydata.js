function stripFrontMatter(input) {
  return input.replace(/^---[\s\S]*?---\s*/, "");
}

function stripMarkdown(input) {
  return input
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\[[^\]]+\]\([^\)]*\)/g, "$1")
    .replace(/[>#*_\-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default {
  layout: "post.vto",
  type: "post",
  eleventyComputed: {
    excerpt: (data) => {
      const body = stripFrontMatter(data.page.rawInput || "");
      return body.split("<!--more-->")[0].trim();
    },
    readingInfo: (data) => {
      const body = stripMarkdown(stripFrontMatter(data.page.rawInput || ""));
      const words = body ? body.split(/\s+/).length : 0;
      return { minutes: Math.max(1, Math.ceil(words / 200)) };
    },
    previousPost: (data) => {
      const posts = data.collections.posts || [];
      const idx = posts.findIndex((p) => p.url === data.page.url);
      return idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;
    },
    nextPost: (data) => {
      const posts = data.collections.posts || [];
      const idx = posts.findIndex((p) => p.url === data.page.url);
      return idx > 0 ? posts[idx - 1] : null;
    },
    metas: (data) => ({
      ...(data.site?.metas || {}),
      title: data.title || "",
      image: data.image || ""
    })
  }
};
