const resolvers = require('../resolvers');

describe('[Query.book]', () => {
  const mockContext = {
    dataSources: {
      bookAPI: { getBookByIsbn: jest.fn() },
    },
  };

  it('calls lookup from book api', async () => {
    const getBookByIsbn = mockContext.dataSources.bookAPI.getBookByIsbn;
    getBookByIsbn.mockReturnValueOnce({
      isbn: 9784344036239,
    });

    // check the resolver response
    const res = await resolvers.Query.book(null, { isbn: 9784344036239 }, mockContext);
    expect(res).toEqual({ isbn: 9784344036239 });

    // make sure the dataSources were called properly
    expect(getBookByIsbn).toBeCalledWith({ isbn: 9784344036239 });
  });
});

describe('[Query.books]', () => {
  const mockContext = {
    dataSources: {
      bookAPI: { getAllBooks: jest.fn() },
    },
  };
  // just for easy access
  const { getAllBooks } = mockContext.dataSources.bookAPI;

  it('calls lookup from store', async () => {
    // NOTE: these results get reversed in the resolver
    getAllBooks.mockReturnValueOnce([{ isbn: 9784344036239 }]);

    // check the resolver response
    const res = await resolvers.Query.books(null, {}, mockContext);
    expect(res).toEqual([{ isbn: 9784344036239 }]);
  });
});
