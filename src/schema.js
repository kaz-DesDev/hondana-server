const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    books: [String]!
    book(isbn: ID!): Book
  }

  type Book {
    isbn: ID!
    title: String
    volume: String
    series: String
    publisher: String
    pubdate: String
    cover: String
    author: String
  }
`;

module.exports = typeDefs;
