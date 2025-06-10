"use strict";

const { createCoreRouter: createLibroRouter } =
  require("@strapi/strapi").factories;

module.exports = createLibroRouter("api::libro.libro", {
  config: {
    find: {
      auth: false,
    },
  },
});
