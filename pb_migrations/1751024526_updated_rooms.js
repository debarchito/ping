/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // add field
    collection.fields.addAt(
      3,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1731158936",
        max: 128,
        min: 3,
        name: "displayName",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: false,
        system: false,
        type: "text",
      }),
    );

    // update field
    collection.fields.addAt(
      2,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 64,
        min: 3,
        name: "name",
        pattern: "^[a-z0-9_-]+$",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      }),
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // remove field
    collection.fields.removeById("text1731158936");

    // update field
    collection.fields.addAt(
      2,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 64,
        min: 3,
        name: "name",
        pattern: "",
        presentable: false,
        primaryKey: false,
        required: true,
        system: false,
        type: "text",
      }),
    );

    return app.save(collection);
  },
);
