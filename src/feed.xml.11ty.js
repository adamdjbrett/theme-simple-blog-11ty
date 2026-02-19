function escapeXml(input = "") {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export default class {
  data() {
    return {
      permalink: "/feed.xml"
    };
  }

  render(data) {
    const siteUrl = (data.site?.url || "http://localhost:8080").replace(/\/$/, "");
    const posts = data.collections?.posts || [];
    const updated = posts.length ? new Date(posts[0].date).toISOString() : new Date().toISOString();

    const entries = posts
      .map((post) => {
        const postUrl = `${siteUrl}${post.url}`;
        const updatedAt = new Date(post.date).toISOString();
        const summary = post.data?.excerpt || "";
        const title = post.data?.title || post.url;

        return `
  <entry>
    <title>${escapeXml(title)}</title>
    <link href="${escapeXml(postUrl)}" />
    <id>${escapeXml(postUrl)}</id>
    <updated>${updatedAt}</updated>
    <summary type="html">${escapeXml(summary)}</summary>
  </entry>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${escapeXml(data.site?.lang || "en")}">
  <title>${escapeXml(data.site?.metas?.site || "Blog")}</title>
  <subtitle>${escapeXml(data.site?.metas?.description || "")}</subtitle>
  <link href="${escapeXml(siteUrl)}/feed.xml" rel="self" />
  <link href="${escapeXml(siteUrl)}/" />
  <updated>${updated}</updated>
  <id>${escapeXml(siteUrl)}/</id>${entries}
</feed>`;
  }
}
