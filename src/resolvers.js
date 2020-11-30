module.exports = {
  Query: {
    books: (_, __, { dataSources }) =>
      dataSources.bookAPI.getAllBooks(),
    book: (_, { isbn }, { dataSources }) =>
      dataSources.bookAPI.getBookByIsbn({ isbn: isbn}),
  },
  Mutation: {
    addBook: async (_, { isbn }, { dataSources }) => {
      const book = await dataSources.bookAPI.getBookByIsbn({ isbn });
      if (!book) { 
        return {
          success: false,
          message: "指定したISBNで検索した結果，該当の書籍が見つかりませんでした。",
          book,
        };
      };
      const result = await dataSources.bookAPI.addBook({ isbn });

      return {
        success: true,
        message: "add book successfully",
        book,
      };
    },
  }
};
