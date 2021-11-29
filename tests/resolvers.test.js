
const resolvers = require('../src/resolvers')

describe('resolvers', () => {
  test('updateSettings', async () => {
    const spy = jest.spyOn(resolvers.Mutation, 'updateSettings');
    resolvers.Mutation.updateSettings(null,{id: 1},{
      user: {id: 1},
      models: {
        Settings: {
          updateOne: jest.fn(() => [{ message: 'New Post'}])
        }
      }
    })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
