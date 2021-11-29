const gql = require('graphql-tag')
const createTestServer = require('./helper')
const FEED = gql`
  {
    feed {
      id
      message
      createdAt
      likes
      views
    }
  }
`
const USER = gql`
  query {
    user {
      email
      id
    }
  }
`
const POST = gql`
  query {
    post(id: 1) {
      id
      message
      createdAt
      likes
      views
    }
  }
`

const USER_SETTINGS = gql`
  {
    userSettings {
      id
      user{
        email
      }
    }

  }
`

const POSTS = gql`
  query {
    posts {
      id
      message
      createdAt
      likes
      views
    }
  }
`


describe('queries', () => {
  test('feed', async () => {
    const {query} = createTestServer({
      user: {id: 1},
      models: {
        Post: {
          findMany: jest.fn(() => [{id: 2, message: 'new Post', createdAt: 12345839, likes: 28, views: 30}])
        }
      }
    })

    const res = await query({query: FEED})
    expect(res).toMatchSnapshot()
  })
  test('posts', async () => {
    const {query} = createTestServer({
      user: {id: 2},
      models: {
        Post: {
          findMany: jest.fn(() => [{id: 2, message: 'new Post', createdAt: 12345839, likes: 28, views: 30}])
        }
      }
    })

    const res = await query({query: POSTS})
    expect(res).toMatchSnapshot()
  })

  test('post', async () => {
    const {query} = createTestServer({
      user: {id: 2},
      models: {
        Post: {
          findOne: jest.fn(() => [ {id: 1, message: 'new Post', createdAt: 12345839, likes: 28, views: 30}])
        }
      }
    })

    const res = await query({query: POST})
    expect(res).toMatchSnapshot()
  })

  test('userSettings', async () => {
    const {query} = createTestServer({
      user: {id: 1},
      models: {
        Settings: {
          findOne: jest.fn(() => [ {id: 1, user: USER}])
        }
      }
    })

    const res = await query({query: USER_SETTINGS})
    expect(res).toMatchSnapshot()
  })
})
