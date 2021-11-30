const gql = require('graphql-tag')

module.exports = gql`
  directive @log(message: String = "My story") on FIELD_DEFINITION
  directive @formatDate(format: String="MMM dd yyyy") on FIELD_DEFINITION
  directive @auth on  FIELD_DEFINITION
  directive @authorized(role: Role! = ADMIN) on  FIELD_DEFINITION
  enum Theme {
    DARK
    LIGHT
  }

  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type User {
    id: ID! @log
    email: String!
    avatar: String!
    error: String!
    verified: Boolean!
    createdAt: String! @formatDate
    posts: [Post]!
    role: Role!
    settings: Settings!
  }

  type AuthUser {
    token: String!
    user: User!
  }

  type Post {
    id: ID!
    message: String!
    author: User!
    createdAt: String! @formatDate
    likes: Int
    views: Int!
  }

  type Settings {
    id: ID!
    user: User!
    theme: Theme!
    emailNotifications: Boolean!
    pushNotifications: Boolean!
  }

  type Invite {
    email: String!
    from: User!
    createdAt: String! @formatDate
    role: Role!
  }

  input NewPostInput {
    message: String!
  }

  input UpdateSettingsInput {
    theme: Theme
    emailNotifications: Boolean
    pushNotifications: Boolean
  }

  input UpdateUserInput {
    email: String
    avatar: String
    verified: Boolean
  }

  input InviteInput {
    email: String!
    role: Role!
  }

  input SignupInput {
    email: String!
    password: String!
    role: Role!
  }

  input SigninInput {
    email: String!
    password: String!
  }

  type Query {
    me: User! @auth
    posts: [Post]! @auth
    post(id: ID!): Post! @auth
    userSettings: Settings! @auth
    feed: [Post]!
  }

  type Mutation {
    updateSettings(input: UpdateSettingsInput!): Settings!
    createPost(input: NewPostInput!): Post!
    updateMe(input: UpdateUserInput!): User @auth
    invite(input: InviteInput!): Invite! @auth @authorized(role: ADMIN)
    signup(input: SignupInput!): AuthUser!
    signin(input: SigninInput!): AuthUser!
  }

  type Subscription {
    newPost: Post!
  }
`