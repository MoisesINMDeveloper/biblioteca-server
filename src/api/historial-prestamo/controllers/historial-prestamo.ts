"use strict";

const { createCoreController: createHistorialController } =
  require("@strapi/strapi").factories;

module.exports = createHistorialController(
  "api::historial-prestamo.historial-prestamo",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        // Obtener datos directamente con entityService
        const historiales = await strapi.entityService.findMany(
          "api::historial-prestamo.historial-prestamo",
          {
            populate: {
              libros: {
                fields: ["titulo", "autor"],
              },
            },
            fields: ["usuario", "cedula", "fecha_prestamo", "fecha_devolucion"],
          }
        );

        // Transformar datos
        const transformedData = historiales.map((item) => ({
          id: item.id,
          ...item,
          libros: item.libros
            ? item.libros.map((libro) => ({
                id: libro.id,
                titulo: libro.titulo,
                autor: libro.autor,
              }))
            : [],
        }));

        return {
          data: transformedData,
          meta: {
            pagination: {
              page: 1,
              pageSize: transformedData.length,
              pageCount: 1,
              total: transformedData.length,
            },
          },
        };
      } catch (error) {
        console.error("Error en entityService:", error);
        return ctx.internalServerError(`Database error: ${error.message}`);
      }
    },
  })
);
