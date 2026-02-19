export default class {
  data() {
    return {
      permalink: "/feed.json"
    };
  }

  render(data) {
    const siteUrl = (data.site?.url || "http://localhost:8080").replace(/\/$/, "");
    const posts = data.collections?.posts || [];

    const feed = {
      version: "https://jsonfeed.org/version/1.1",
      title: data.site?.metas?.site || "Blog",
      home_page_url: `${siteUrl}/`,
      feed_url: `${siteUrl}/feed.json`,
      description: data.site?.metas?.description || "",
      language: data.site?.lang || "en",
      items: posts.map((post) => ({
        id: `${siteUrl}${post.url}`,
        url: `${siteUrl}${post.url}`,
        title: post.data?.title || post.url,
        summary: post.data?.excerpt || "",
        date_published: new Date(post.date).toISOString(),
        date_modified: new Date(post.date).toISOString(),
        authors: post.data?.author ? [{ name: post.data.author }] : undefined,
        tags: post.data?.tags || []
      }))
    };

    return JSON.stringify(feed, null, 2);
  }
}
