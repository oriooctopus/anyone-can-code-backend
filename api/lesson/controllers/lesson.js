"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // async find(ctx) {
  //   let entities;
  //   if (ctx.query._q) {
  //     entities = await strapi.services.lesson.search(ctx.query);
  //   } else {
  //     entities = await strapi.services.lesson.find(ctx.query);
  //   }
  //   // Add computed field `fullName` to entities.
  //   entities.map((entity) => {
  //     entity.fullName = `${entity.firstName} ${entity.lastName}`;
  //     return entity;
  //   });
  //   return entities.map((entity) =>
  //     sanitizeEntity(entity, { model: strapi.models.lesson })
  //   );
  // },
  // async findOne(ctx) {
  //   const { id } = ctx.params;
  //   let entity = await strapi.services.lesson.findOne({ id });
  //   if (!entity) {
  //     return ctx.notFound();
  //   }
  //   const allLessons = await strapi.services.
  //   // Add computed field `fullName` to entity.
  //   entity.nextLessonSlug = ;
  //   return sanitizeEntity(entity, { model: strapi.models.lesson });
  // },
};
