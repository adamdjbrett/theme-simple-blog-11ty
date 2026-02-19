export default {
  pagination: {
    data: "collections.posts",
    size: 10,
    alias: "results"
  },
  eleventyComputed: {
    title: (data) => data.site.i18n.nav.archive_title,
    menu: (data) => (data.pagination.pageNumber === 0 ? { visible: true, order: 1 } : undefined),
    permalink: (data) =>
      data.pagination.pageNumber === 0
        ? "/archive/"
        : `/archive/${data.pagination.pageNumber + 1}/`
  }
};
