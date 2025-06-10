"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/categorias/excel",
      handler: "categoria-excel.downloadCategoriasExcel",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
