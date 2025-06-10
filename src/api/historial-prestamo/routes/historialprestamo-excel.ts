"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/historialprestamos/excel",
      handler: "historialprestamo-excel.downloadHistorialPrestamosExcel",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
