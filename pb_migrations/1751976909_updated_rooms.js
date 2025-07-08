/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update collection data
    unmarshal(
      {
        indexes: [
          "CREATE INDEX `idx_xi8bLqwW4j` ON `rooms` (`userId`)",
          "CREATE UNIQUE INDEX `idx_lPFlqB1a8C` ON `rooms` (`name`)",
        ],
      },
      collection,
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    // update collection data
    unmarshal(
      {
        indexes: [
          "CREATE INDEX `idx_xi8bLqwW4j` ON `rooms` (`userId`)",
          "CREATE INDEX `idx_lPFlqB1a8C` ON `rooms` (`name`)",
        ],
      },
      collection,
    );

    return app.save(collection);
  },
);
