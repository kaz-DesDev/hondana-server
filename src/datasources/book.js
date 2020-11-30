const { RESTDataSource } = require('apollo-datasource-rest');

class BookAPI extends RESTDataSource {
    constructor({ store }) {
        super();
        this.baseURL = 'https:/api.openbd.jp/v1/';
        this.store = store;
    }

    bookReducer(book) {
        return {
            isbn: book.summary.isbn || 0,
            title: book.summary.title || '',
            volume: book.summary.volume || '',
            series: book.summary.series || '',
            publisher: book.summary.publisher || '',
            pubdate: book.summary.pubdate || '',
            cover: book.summary.cover || '',
            author: book.summary.author || ''
        };
    }

    async getBookByIsbn({ isbn }) {
        const res = await this.get('get', { isbn: isbn });
        return this.bookReducer(res[0]);
    }

    async getBooksByIsbns({ isbns }) {
        return Promise.all(
            isbns.map(isbn => this.getBookByIsbn({ isbn })),
        );
    }

    async addBook({ isbn }) {
        const res = await this.store.books.findOrCreate({
          where: { isbn },
        });
        return res && res.length ? res[0].get() : false;
    }

    async getAllBooks() {
        const found = await this.store.books.findAll();
        return found && found.length
          ? found.map(l => l.dataValues.isbn).filter(l => !!l)
          : [];
      }
}

module.exports = BookAPI;
