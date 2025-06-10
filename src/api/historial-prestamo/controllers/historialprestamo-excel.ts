"use strict";
const ExcelJS = require("exceljs");

module.exports = ({ strapi }) => ({
  async downloadHistorialPrestamosExcel(ctx) {
    try {
      console.log(
        "Iniciando generación de Excel para historial de préstamos..."
      );

      // 1. Obtener datos con la relación de libros
      const historialprestamos = await strapi.entityService.findMany(
        "api::historial-prestamo.historial-prestamo",
        {
          populate: {
            libros: {
              fields: ["id", "titulo", "autor"],
            },
          },
          fields: [
            "id",
            "usuario",
            "cedula",
            "fecha_prestamo",
            "fecha_devolucion",
          ],
          limit: 1000,
        }
      );

      console.log(
        `Encontrados ${historialprestamos.length} registros de préstamos`
      );

      if (!historialprestamos || historialprestamos.length === 0) {
        return ctx.send({ message: "No hay datos disponibles" }, 404);
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Historial Préstamos");

      // 2. Configurar columnas con campos de libros
      worksheet.columns = [
        { header: "ID", key: "id_prestamo", width: 12 },
        { header: "Usuario", key: "usuario", width: 25 },
        { header: "Cédula", key: "cedula", width: 15 },
        { header: "Fecha Préstamo", key: "fecha_prestamo", width: 20 },
        { header: "Fecha Devolución", key: "fecha_devolucion", width: 20 },
        { header: "ID Libro", key: "id_libro", width: 10 },
        { header: "Título Libro", key: "titulo_libro", width: 35 },
        { header: "Autor Libro", key: "autor_libro", width: 30 },
      ];

      // 3. Agregar datos expandiendo los libros
      historialprestamos.forEach((prestamo) => {
        // Si no hay libros, agregar una fila con datos básicos
        if (!prestamo.libros || prestamo.libros.length === 0) {
          worksheet.addRow({
            id_prestamo: prestamo.id,
            usuario: prestamo.usuario || "N/A",
            cedula: prestamo.cedula || "N/A",
            fecha_prestamo: prestamo.fecha_prestamo,
            fecha_devolucion: prestamo.fecha_devolucion,
            id_libro: "N/A",
            titulo_libro: "SIN LIBRO ASOCIADO",
            autor_libro: "N/A",
          });
        } else {
          // Agregar una fila por cada libro
          prestamo.libros.forEach((libro) => {
            worksheet.addRow({
              id_prestamo: prestamo.id,
              usuario: prestamo.usuario || "N/A",
              cedula: prestamo.cedula || "N/A",
              id_libro: libro.id,
              titulo_libro: libro.titulo || "N/A",
              autor_libro: libro.autor || "N/A",
              fecha_prestamo: prestamo.fecha_prestamo,
              fecha_devolucion: prestamo.fecha_devolucion,
            });
          });
        }
      });

      // 4. Formatear fechas
      worksheet.columns.forEach((column, index) => {
        if (index === 3 || index === 4) {
          // Columnas de fecha
          column.numFmt = "dd/mm/yyyy hh:mm";
        }
      });

      // 5. Estilizar encabezados
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" }, // Gris claro
      };

      // 6. Generar archivo
      const buffer = await workbook.xlsx.writeBuffer();

      ctx.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=historial_prestamos.xlsx",
      });

      ctx.body = buffer;
      console.log(
        "Excel de historial de préstamos generado y enviado con éxito"
      );
    } catch (error) {
      console.error("Error crítico en generación de Excel:", error);
      return ctx.internalServerError("Error generando el reporte");
    }
  },
});
