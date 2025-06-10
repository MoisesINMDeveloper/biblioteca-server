"use strict";

const { createCoreController: categoriaCoreController } =
  require("@strapi/strapi").factories;

module.exports = categoriaCoreController("api::categoria.categoria", () => ({
  async find(ctx) {
    try {
      return await super.find(ctx);
    } catch (error) {
      ctx.throw(500, "Error obteniendo categorias");
    }
  },
}));
