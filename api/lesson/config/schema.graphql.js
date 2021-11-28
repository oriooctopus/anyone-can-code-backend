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

          const currentLesson = await strapi.services.lesson.findOne({
            id: currentLessonId,
          });

          if (!currentLesson) {
            throw new Error(`Lesson of id ${currentLessonId} not found`);
          } else if (!currentLesson.module) {
            throw new Error(
              `Lesson of id ${currentLessonId} does not belong to a module`
            );
          }

          const lessons = await strapi.services.lesson.find({
            "module.id": 1,
          });

          const currentLessonIndex = lessons.findIndex((lesson) => {
            console.log("current lesson", lesson.id);
            return lesson.id === currentLessonId;
          });

          if (currentLessonIndex === lessons.length - 1) {
            return null;
          }

          return lessons[currentLessonIndex + 1].slug;
        },
      },
    },
  },
};
