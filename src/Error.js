const {ApolloError} = require('apollo-server')

// implement custom Error
class ServerError extends ApolloError {
  constructor(message) {
    super(message, 'BAD_USER_INPUT');

    Object.defineProperty(this, 'Error', { value: 'Server Error' });
  }
}

module.exports = ServerError;