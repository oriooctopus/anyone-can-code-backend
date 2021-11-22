module.exports = {
  definition: `
    union Challenge = CodeChallenge | MultipleChoiceChallenge
  `,
  query: `
    getSublessonBySlugs(lessonSlug: String!, sublessonSlug: String!, id: ID!): Sublesson!,
  `,
  resolver: {
    // sublesson: {
    //   test: {
    //     resolver: () => 123,
    //     resolverOf: "application::sublesson.sublesson.find",
    //   },
    // },
    Query: {
      getSublessonBySlugs: {
        description:
          "Gets a sublesson by the unique combination of lesson slug and sublesson slug",
        resolverOf: "application::sublesson.sublesson.find",
        resolver: async (obj, options, { context }) => {
          const {
            params: { _sublessonSlug: sublessonSlug, _lessonSlug: lessonSlug },
          } = context;

          const lesson = await strapi.services.lesson.findOne({
            slug: lessonSlug,
          });

          return ((lesson && lesson.sublessons) || []).find(
            ({ slug }) => slug === sublessonSlug
          );
        },
      },
    },
    Mutation: {},
  },
  type: {},
};
