"use strict";
const ExcelJS_Libro = require("exceljs");

module.exports = ({ strapi }) => ({
  async downloadLibrosExcel(ctx) {
    try {
      // Obtener todos los libros
      const libros = await strapi.entityService.findMany("api::libro.libro", {
        fields: [
          "id",
          "titulo",
          "autor",
          "fecha_ingreso",
          "disponible",
          "volumen",
          "cantidad",
          "prestados",
        ],
      });

      // Crear libro de Excel
      const workbook = new ExcelJS_Libro.Workbook();
      const worksheet = workbook.addWorksheet("Libros");

      // Configurar cabeceras
      worksheet.columns = [
        { header: "ID", key: "id", width: 8 },
        { header: "Título", key: "titulo", width: 35 },
        { header: "Autor", key: "autor", width: 25 },
        { header: "Fecha Ingreso", key: "fecha_ingreso", width: 15 },
        { header: "Disponible", key: "disponible", width: 12 },
        { header: "Volumen", key: "volumen", width: 10 },
        { header: "Cantidad", key: "cantidad", width: 10 },
        { header: "Prestados", key: "prestados", width: 10 },
      ];

      // Añadir datos
      libros.forEach((libro) => {
        worksheet.addRow({
          id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          fecha_ingreso: libro.fecha_ingreso,
          disponible: libro.disponible ? "Sí" : "No",
          volumen: libro.volumen,
          cantidad: libro.cantidad,
          prestados: libro.prestados,
        });
      });

      // Configurar respuesta
      ctx.set(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      ctx.set("Content-Disposition", "attachment; filename=libros.xlsx");

      // Generar y enviar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      ctx.send(buffer);
    } catch (error) {
      console.error("Error generando Excel:", error);
      return ctx.badRequest("Error generando Excel");
    }
  },
});
