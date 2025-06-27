/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

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
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update field
    collection.fields.addAt(
      2,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 64,
        min: 0,
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
