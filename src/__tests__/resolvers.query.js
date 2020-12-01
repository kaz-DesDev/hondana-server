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
      bookAPI: {
        getBooksByIsbns: jest.fn(),
        getAllBooks: jest.fn()
      },
    },
  };
  const getBooksByIsbns = mockContext.dataSources.bookAPI.getBooksByIsbns;
  getBooksByIsbns.mockReturnValueOnce([
    {
      "title": "誰のためのデザイン　増補・改訂版",
      "author": "Ｄ・Ａ・ノーマン／著 岡本明／訳 安村通晃／訳 伊賀聡一郎／訳 野島久雄／訳"
    }
]);
  // just for easy access
  const { getAllBooks } = mockContext.dataSources.bookAPI;

  it('calls lookup from store', async () => {
    // NOTE: these results get reversed in the resolver
    getAllBooks.mockReturnValueOnce([
        {
          "title": "誰のためのデザイン　増補・改訂版",
          "author": "Ｄ・Ａ・ノーマン／著 岡本明／訳 安村通晃／訳 伊賀聡一郎／訳 野島久雄／訳"
        }
    ]);

    // check the resolver response
    const res = await resolvers.Query.books(null, {}, mockContext);
    expect(res).toEqual(
      [{"author": "Ｄ・Ａ・ノーマン／著 岡本明／訳 安村通晃／訳 伊賀聡一郎／訳 野島久雄／訳", "title": "誰のためのデザイン　増補・改訂版"}]
    )
  });
});
