// const { GraphQLServer } = require("graphql-yoga");
// const fetch = require('node-fetch');

// const typeDefs = `
//   type Query {
//     hello(name: String): String!
//     getPerson(id: Int!): Person
//     getPark(region: Float): Park
//   }

//   type Film {
//     title: String
//     episode_id: Int
//     opening_crawl: String
//     director: String
//     producer: String
//     release_date: String
//   }

//   type Person {
//     name: String
//     height: String
//     mass: String
//     hair_color: String
//     skin_color: String
//     brith_year: String
//     gender: String
//     films: [Film]
//   }

//   type Park {
//     name: String
//     rating: Int
//   }
// `;



// const resolvers = {
//   Person: {
//     films: (parent) => {
//       const promises = parent.films.map(async (url) => {
//         const response = await fetch(url);
//         return response.json();
//       });
//       return Promise.all(promises);
//     }
//   },

//   Query: {
//     hello: (_, { name }) => `Hello ${name || "World"}`,
//     getPerson: async (_, {id}) => {
//       const response = await fetch(`https://swapi.dev/api/people/${id}`);
//       return response.json();
//     },
//     getPark: async (_, {region}) => {
//       const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.77845788801858,${region}&radius=2000&type=park&key=AIzaSyCjzgWsFE6GGmGMv-Gs2erELAb-51RVuWA`);
//       const result = response.json();
//       console.log("result: ", result);
//       return response.json();
//     }
//   }
// };

// const server = new GraphQLServer({ typeDefs, resolvers });
// server.start(() => console.log("Server is running on localhost:4000"));



// ================================================================================================================


// const { GraphQLServer } = require("graphql-yoga");
// const fetch = require("node-fetch");

// const region = {
//   latitude: -33.87621592366979,
//   longitude: 151.1998382024467
// }

// const typeDefs = `
//   type Query {
//     test(name: String): String!
//     getParkDetails(latitude: Float!, longitude: Float!): ParksDetails
//   }

//   type Location {
//     latitude: Float
//     longitude: Float
//   }

//   type Park {
//     name: String
//     rating: Int
//   }

//   type ParksDetails {
//     results: [Park]
//   }
// `

// const resolvers = {
//   Query: {
//     test: (_, { name }) => `Hello ${name} || "World"`,
//     getParkDetails: async ({latitude, longitude}) => {
//       const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=park&key=AIzaSyCjzgWsFE6GGmGMv-Gs2erELAb-51RVuWA`);
//       return response.json();
//     }
//   }
// }

// const server = new GraphQLServer({ typeDefs, resolvers });
// server.start(() => console.log("server is runnong on localhost:4000"));


// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.87621592366979,151.1998382024467&radius=2000&type=park&key=AIzaSyCjzgWsFE6GGmGMv-Gs2erELAb-51RVuWA

// ================================================================================================================
// var express = require('express');
// var { graphqlHTTP } = require('express-graphql');
// var { buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     rollDice(numDice: Int!, numSides: Int): [Int]
//     getParkDetails(latitude: Float!, longitude: Float!):{}
//   }
// `);

// // The root provides a resolver function for each API endpoint
// var root = {
//   rollDice: ({numDice, numSides}) => {
//     var output = [];
//     for (var i = 0; i < numDice; i++) {
//       output.push(1 + Math.floor(Math.random() * (numSides || 6)));
//     }
//     return output;
//   }
// };

// var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: true,
// }));
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');

// ================================================================================================================
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { default: fetch } = require('node-fetch');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
    getSomething(latitude: Float, longitude: Float): ListParkDetails
  }

  type ListParkDetails {
    results: [ParkDetails]
    getSomethingTwo(latitude: Float, longitude: Float): Location
    getListOfNearbyParks(latitude: Float, longitude: Float): ParkDetails
  }

  type ParkDetails {
    name: String
    rating: Float
  }

  type Location {
    latitude: Float
    longitude: Float
  }

`);

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

class ListParkDetails {
  constructor(latitude, longitude){
    this.latitude = latitude;
    this.longitude = longitude;
  }

  getListOfNearbyParks = async ({latitude, longitude}) => {
    
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=2000&type=park&key=AIzaSyCjzgWsFE6GGmGMv-Gs2erELAb-51RVuWA`).then(response => {
      const result = response.json()
      console.log(result);
      return result;
    });
    console.log("awaited repsonse: ", response);
                          
    

    return {name:response.results[0].name, rating: response.results[0].rating};
  }

  getSomethingTwo({latitude, longitude}){
    return {latitude, longitude};
  }
}

// class Location {
//   constructor(latitude, longitude){
//     this.latitude = latitude;
//     this.longitude = longitude;
//   }
// }

// The root provides the top-level API endpoints
var root = {
  getDie: ({numSides}) => {
    return new RandomDie(numSides || 6);
  },
  getParkDetails: ({latitude, longitude}) => {
    return new ListParkDetails(latitude, longitude);
  },
  getSomething: ({latitude, longitude}) => {
    return new ListParkDetails(latitude, longitude);
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');

// ================================================================================================================
// const region = {
//   latitude: -33.87621592366979,
//   longitude: 151.1998382024467
// }
