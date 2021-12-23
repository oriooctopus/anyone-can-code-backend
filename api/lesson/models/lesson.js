"use strict";

// const { enforceSublessonChallengeSortOrder } = require("./sublesson.utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeUpdate(params, data) {
      console.log("params", params, "data", data);
      // await enforceSublessonChallengeSortOrder(
      //   params.id,
      //   data.sublesson_challenges_test,
      //   (newIds) => (data.sublesson_challenges_test = newIds)
      // );
    },
  },
};
