export default {
  layout: "archive_result.vto",
  pagination: {
    data: "collections.authorPageEntries",
    size: 1,
    alias: "entry"
  },
  eleventyComputed: {
    title: (data) => data.entry.title,
    results: (data) => data.entry.results,
    pager: (data) => data.entry.pager,
    permalink: (data) => data.entry.permalink
  }
};
