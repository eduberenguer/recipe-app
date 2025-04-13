/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_842702175")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number1756448141",
    "max": null,
    "min": 0,
    "name": "favouritesCounter",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_842702175")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number1756448141",
    "max": null,
    "min": null,
    "name": "favouritesCounter",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
