/** @type {import("../pb_data/types") */
migrate(
  (app) => {
    const collection = new Collection({
      createRule: '@request.auth.id != ""',
      deleteRule: "@request.auth.id = userId",
      fields: [
        {
          autogeneratePattern: "[a-z0-9]{15}",
          hidden: false,
          id: "text3208210256",
          max: 15,
          min: 15,
          name: "id",
          pattern: "^[a-z0-9]+$",
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: "text",
        },
        {
          cascadeDelete: false,
          collectionId: "_pb_users_auth_",
          hidden: false,
          id: "relation1689669068",
          maxSelect: 1,
          minSelect: 0,
          name: "userId",
          presentable: false,
          required: true,
          system: false,
          type: "relation",
        },
        {
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
        },
        {
          hidden: false,
          id: "autodate2990389176",
          name: "created",
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: "autodate",
        },
        {
          hidden: false,
          id: "autodate3332085495",
          name: "updated",
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: "autodate",
        },
      ],
      id: "pbc_3085411453",
      indexes: [],
      listRule: "",
      name: "rooms",
      system: false,
      type: "base",
      updateRule: "@request.auth.id = userId",
      viewRule: "",
    });

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_3085411453");

    return app.delete(collection);
  },
);
