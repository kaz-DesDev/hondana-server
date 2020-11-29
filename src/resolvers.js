module.exports = {
  Query: {
    book: (_, { isbn }, { dataSources }) =>
      dataSources.bookAPI.getBookByIsbn({ isbn: isbn}),
  },
};
