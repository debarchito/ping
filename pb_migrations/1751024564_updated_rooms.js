/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update field
    collection.fields.addAt(
      3,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1731158936",
        max: 64,
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

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update field
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

    return app.save(collection);
  },
);
