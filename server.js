import { ApolloServer, gql } from 'apollo-server';


// Giả lập CSDL.
let tweets = [
    {
        id: 1,
        accountName: 'John',
        userId: 1
    },
    {
        id: 2,
        accountName: 'Michael',
        userId: 2
    }
];

let users = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'KKoken',
    },
    {
        id: 2,
        firstName: 'Michael',
        lastName: 'HiiMen',
    }
];

// Định nghĩa shchema GrapQL
const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet {
        id: ID!
        accountName: String!
        user: User!
    }
    type Query {
        tweets: [Tweet!]!
        tweet(id: ID!): Tweet
        users: [User!]!
        user(id: ID!): User
    }
    type Mutation {
        postTweet(accountName: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

// Định nghĩa function resolvers xử lý request của client
const resolvers = {
    Query: {
        tweets: () => tweets,
        tweet: (__, { id }) => {
            let parseIntId = +id;
            return tweets.find(t => t.id === parseIntId);
        },
        users: () => users,
        user: (root, { id }) => {
            let parseIntId = +id;
            return users.find(user => user.id === parseIntId);
        }
    },
    Mutation: {
        postTweet: (__, args) => {
            const tweet = {
                id: tweets.length + 1,
                accountName: args.accountName,
                userId: args.userId
            }
            tweets.push(tweet);
            return tweet;
        },
        deleteTweet: (__, { id }) => {
            let parseIntId = +id;
            const tweet = tweets.find(t => t.id === parseIntId);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== parseIntId)
            return true;
        }
    },
    User: {
        fullName: ({ firstName, lastName }) => {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        user: ({ userId }) => {
            return users.find((user) => user.id === userId)
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.listen()
    .then(({ url }) => {
        console.log('GraphQL server listening on url: ' + url);
    })
    .catch((err) => {
        console.log('GraphQL server error: ' + err);
    });