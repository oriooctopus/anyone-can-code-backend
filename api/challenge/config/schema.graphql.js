module.exports = {
  definition: `
    union Challenge = CodeChallenge | MultipleChoiceChallenge
  `,
  query: `
    getChallenges(includeCompleted: Boolean, lessonId: Int!): [Challenge!]
  `,
  resolver: {
    // sublesson: {
    //   test: {
    //     resolver: () => 123,
    //     resolverOf: "application::sublesson.sublesson.finwd",
    //   },
    // },
    Query: {
      getChallenges: {
        description:
          "Gets a sublesson by the unique combination of lesson slug and sublesson slug",
        // TODO: this should be a compound resolverOfI guess
        resolverOf: "application::codeChallenge.codeChallenge.find",
        resolver: async (obj, options, { context }) => {
          // TODO: define some api for challenges that combines the search for both types of challenges

          /**
           * TODO: this is terrible but i wanted to write it in the simplest
           * possible way as we're about to migrate to strapi4 which has a different
           * query engine
           */
          const allMultipleChoiceChallenges =
            await strapi.services.multipleChoiceChallenge.findAll();
          const allCodeChallenges =
            await strapi.services.codeChallenge.findAll();
        },
      },
    },
    Mutation: {},
  },
  type: {},
};
