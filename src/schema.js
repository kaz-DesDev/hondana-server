const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    book(isbn: ID!): Book
  }

  type Book {
    isbn: ID!
    title: String
    cover: String
  }
`;

module.exports = typeDefs;
