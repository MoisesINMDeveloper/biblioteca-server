"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/libros/excel",
      handler: "excel.downloadLibrosExcel",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
