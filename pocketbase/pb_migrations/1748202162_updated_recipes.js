/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_842702175")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool477608857",
    "name": "isVisible",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_842702175")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool477608857",
    "name": "isVisible",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
