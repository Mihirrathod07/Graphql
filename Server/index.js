const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Axios, default: axios } = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
    }

    type Todo {
        id: ID!
        title: String!
        completed: Boolean
        
        user : User
    }

    type Query {
        getTodos: [Todo]
        getAllUsers: [User] # Declare getAllUsers query in the schema
        getUsers(id: ID!): User
    }
`,

    resolvers: {
        Todo: {
            user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
          },
          
      Query: {
        getTodos: async() =>(await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
        getAllUsers: async() =>(await axios.get('https://jsonplaceholder.typicode.com/users')).data,
        getUsers: async(parent,{id}) =>(await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  // Corrected path for GraphQL endpoint
  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("Server Started at Port 8000"));
}

startServer();
