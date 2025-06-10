"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter(
  "api::historial-prestamo.historial-prestamo",
  {
    config: {
      find: {
        auth: false,
        // Agrega esto para permitir la población personalizada
        policies: [],
        middlewares: [],
      },
    },
  }
);
