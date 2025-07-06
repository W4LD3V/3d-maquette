import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type PlasticType {
    id: ID!
    name: String!
    colors: [PlasticColorAvailability!]!
  }

  type Color {
    id: ID!
    name: String!
    hex: String
  }

  type PlasticColorAvailability {
    id: ID!
    color: Color!
    inStock: Boolean!
  }

  type PrintRequest {
    id: ID!
    fileUrl: String!
    plasticType: PlasticType!
    color: Color!
    createdAt: String!
  }

  type Query {
    getPlasticTypes: [PlasticType!]!
    getColorsForPlastic(plasticTypeId: ID!): [PlasticColorAvailability!]!
    getPrintRequests: [PrintRequest!]!
  }

  type Mutation {
    submitPrintRequest(fileUrl: String!, plasticTypeId: String!, colorId: String!): PrintRequest!
  }
`;
