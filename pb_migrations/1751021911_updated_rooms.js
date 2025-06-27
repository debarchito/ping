/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update collection data
    unmarshal(
      {
        indexes: [
          "CREATE UNIQUE INDEX `idx_xi8bLqwW4j` ON `rooms` (`userId`)",
          "CREATE INDEX `idx_lPFlqB1a8C` ON `rooms` (`name`)",
        ],
      },
      collection,
    );

    // add field
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
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update collection data
    unmarshal(
      {
        indexes: ["CREATE UNIQUE INDEX `idx_xi8bLqwW4j` ON `rooms` (`userId`)"],
      },
      collection,
    );

    // remove field
    collection.fields.removeById("text1579384326");

    return app.save(collection);
  },
);
