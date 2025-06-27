/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update field
    collection.fields.addAt(
      4,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1843675174",
        max: 200,
        min: 1,
        name: "description",
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
      4,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1843675174",
        max: 200,
        min: 0,
        name: "description",
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
