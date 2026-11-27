migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('roster_data')
    collection.fields.add(
      new AutodateField({ name: 'created', onCreate: true, onUpdate: false }),
      new AutodateField({ name: 'updated', onCreate: true, onUpdate: true }),
    )
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('roster_data')
    collection.fields.removeByName('created')
    collection.fields.removeByName('updated')
    app.save(collection)
  },
)
