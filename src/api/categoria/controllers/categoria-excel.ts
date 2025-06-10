// src/api/categoria/controllers/excel.ts
"use strict";
const ExcelJS_Categoria = require("exceljs");

module.exports = ({ strapi }) => ({
  async downloadCategoriasExcel(ctx) {
    try {
      const categorias = await strapi.entityService.findMany(
        "api::categoria.categoria",
        { fields: ["id", "nombre_categoria"] }
      );

      const workbook = new ExcelJS_Categoria.Workbook();
      const worksheet = workbook.addWorksheet("Categorias");

      worksheet.columns = [
        { header: "ID", key: "id", width: 8 },
        { header: "Categoría", key: "nombre_categoria", width: 35 },
      ];

      categorias.forEach((categoria) => {
        worksheet.addRow({
          id: categoria.id,
          nombre_categoria: categoria.nombre_categoria,
        });
      });

      ctx.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      ctx.set("Content-Disposition", "attachment; filename=categorias.xlsx");

      const buffer = await workbook.xlsx.writeBuffer();
      ctx.send(buffer);
    } catch (error) {
      console.error("Error generando Excel:", error);
      return ctx.badRequest("Error generando Excel");
    }
  },
});
