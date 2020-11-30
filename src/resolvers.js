module.exports = {
  Query: {
    books: (_, __, { dataSources }) =>
      dataSources.bookAPI.getAllBooks(),
    book: (_, { isbn }, { dataSources }) =>
      dataSources.bookAPI.getBookByIsbn({ isbn: isbn}),
  },
};
