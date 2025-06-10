"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::libro.libro", () => ({
  async find(ctx) {
    try {
      return await super.find(ctx);
    } catch (error) {
      ctx.throw(500, "Error obteniendo libros");
    }
  },
}));
