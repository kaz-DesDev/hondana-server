const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    book(isbn: ID!): Book
  }

  type Book {
    isbn: ID!
    title: String
  }
`;

module.exports = typeDefs;
