const resolvers = require('../resolvers');

const mockContext = {
  dataSources: {
    bookAPI: {
        getBooksByIsbns: jest.fn(),
        getBookByIsbn: jest.fn(),
        addBook: jest.fn(),
    },
  },
};

describe('[Mutation.addBook]', () => {
  const { addBook } = mockContext.dataSources.bookAPI;
  const { getBookByIsbn } = mockContext.dataSources.bookAPI;

  it('returns true if add succeeds', async () => {
    addBook.mockReturnValueOnce({ isbn: "9784344036239" });
    getBookByIsbn.mockReturnValueOnce({ isbn: "9784344036239" });

    // check the resolver response
    const res = await resolvers.Mutation.addBook(
      null,
      { isbn: "9784344036239" },
      mockContext,
    );
    expect(res).toEqual({
      book: { isbn: "9784344036239" },
      message: "add book successfully",
      success: true,
    });

    // check if the dataSource was called with correct args
    expect(addBook).toBeCalledWith({ isbn: "9784344036239" });
  });

  it('returns false if add fails', async () => {
    addBook.mockReturnValueOnce([]);

    // check the resolver response
    const res = await resolvers.Mutation.addBook(
      null,
      { isbn: "9784344036239" },
      mockContext,
    );

    expect(res.message).toBeDefined();
    expect(res.success).toBeFalsy();
  });
});
