module.exports = {
  query: `
    nextLessonSlug(currentLessonId: Int!): String,
  `,
  resolver: {
    Query: {
      nextLessonSlug: {
        description:
          "Gets the slug for the next lesson in the module based on the provided one",
        resolverOf: "application::lesson.lesson.find",
        resolver: async (_obj, _options, { context }) => {
          const {
            params: { _currentLessonId: currentLessonId },
          } = context;

          const currentModule = await strapi.services.modules.findOne({
            id: 1,
          });

          const lessons = currentModule.ModuleLessons;

          const currentLessonIndex = lessons.findIndex(
            ({ lesson: { id } }) => id === currentLessonId
          );

          if (currentLessonIndex === -1) {
            throw new Error(`Lesson of id ${currentLessonId} not found`);
          }

          if (currentLessonIndex === lessons.length - 1) {
            return null;
          }

          return lessons[currentLessonIndex + 1].lesson.slug;
        },
      },
    },
  },
};
