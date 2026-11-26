migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    users.createRule = null
    app.save(users)

    const collection = new Collection({
      type: 'base',
      name: 'roster_data',
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: '@request.auth.id != "" && user = @request.auth.id',
      updateRule: '@request.auth.id != "" && user = @request.auth.id',
      deleteRule: null,
      fields: [
        {
          type: 'relation',
          name: 'user',
          required: true,
          maxSelect: 1,
          minSelect: 1,
          collectionId: users.id,
          cascadeDelete: false,
        },
        { type: 'json', name: 'data', required: true },
        { type: 'number', name: 'schemaVersion' },
        { type: 'date', name: 'clientUpdatedAt' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_roster_data_user ON roster_data (user)'],
    })

    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('roster_data')
      app.delete(collection)
    } catch {
      // already removed
    }

    try {
      const users = app.findCollectionByNameOrId('users')
      users.createRule = ''
      app.save(users)
    } catch {
      // users collection missing
    }
  },
)
