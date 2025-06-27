/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // update field
    collection.fields.addAt(
      6,
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
    const collection = app.findCollectionByNameOrId("_pb_users_auth_");

    // update field
    collection.fields.addAt(
      6,
      new Field({
        autogeneratePattern: "",
        hidden: false,
        id: "text1579384326",
        max: 64,
        min: 0,
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
);
