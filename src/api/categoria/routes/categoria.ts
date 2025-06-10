"use strict";

const { createCoreRouter: createCategoriaRouter } =
  require("@strapi/strapi").factories;

module.exports = createCategoriaRouter("api::categoria.categoria", {
  config: {
    find: {
      auth: false,
    },
  },
});
