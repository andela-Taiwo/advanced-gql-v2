const {ApolloServer} = require('apollo-server')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const {createToken, getUserFromToken} = require('./auth')
const db = require('./db')
const ServerError = require('./Error');
const {LogDirective, AuthenticationDirective, DateDirective, AuthorizationDirective} = require('./customDirectives')


const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    log: LogDirective,
    formatDate: DateDirective,
    auth: AuthenticationDirective,
    authorized: AuthorizationDirective
  },
  context({req, connection}) {
  
    if (connection) {  
      return {...db, ...connection.context}
    }
      const token = req.headers.authorization
      const user = getUserFromToken(token)
      return {...db, user, createToken}
    
  },
  subscriptions: {
    onConnect(params) {
      const token = params.Authorization
      const user = getUserFromToken(token)
      if(!user){
        throw new Error('Not authenticated!')
      }
      return {user}
    }
  },
  formatError: (err) => {
    if (err.message.startsWith('Database Error: ')) {
      return new ServerError('Internal server error');
    }
    throw err
  }
})

server.listen(4000).then(({url}) => {
  console.log(`🚀 Server ready at ${url}`)
})
