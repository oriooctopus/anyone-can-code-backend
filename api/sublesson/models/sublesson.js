"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeUpdate(params, data) {
      console.log("yoyoy this happens", params, "data", data);
      // data.sublesson_challenges_test = [1];
      if (params.id && data.sublesson_challenges_test) {
        const test = await strapi.connections.default.raw(`
          SELECT name FROM sqlite_master
          WHERE type IN ('table','view')
          AND name NOT LIKE 'sqlite_%'
          ORDER BY 1;
        `);
        // console.log("tables", test);
        const sublessonChallengeComponents = await strapi.connections.default
          .raw(`
          SELECT * FROM sublesson_challenges_test_2_components
        `);
        console.log(
          "sublessonChallengeComponents",
          sublessonChallengeComponents
        );
        // return;
        const sublessonChallenges = await strapi.connections.default.raw(`
          SELECT * FROM sublesson_challenges_test_2 WHERE sublesson = ${params.id}
        `);
        const allSublessonChallenges = await strapi.connections.default.raw(`
          SELECT * FROM sublesson_challenges_test_2
        `);
        console.log("sublessonChallenges", sublessonChallenges);
        console.log("all sublessonChallenges", allSublessonChallenges);

        // await strapi.connections.default.raw(
        //   `DELETE FROM sublesson_challenges_test_2 WHERE id = 20`
        // );
        // return;
        await strapi.connections.default.raw(
          `DELETE FROM sublesson_challenges_test_2 WHERE sublesson = ${params.id};`
        );
        // return;
        const newSublessonChallengeIds = [];

        for (const sublessonChallengeId of data.sublesson_challenges_test) {
          console.log("current sublessonChallengeId", sublessonChallengeId);
          const {
            minimumFrequencyPreference,
            difficulty,
            sublesson: sublessonId,
            internalLabel,
          } = sublessonChallenges.find(({ id }) => {
            console.log("iterating in sublessonChallenges find", id);
            return id == sublessonChallengeId;
          });
          console.log(
            "new values",
            sublessonChallenges.find(({ id }) => id === sublessonChallengeId)
          );
          // console.log(
          //   "sql string",
          //   `INSERT INTO sublesson_challenges_test_2
          //     (minimumFrequencyPreference, difficulty, sublesson)
          //     VALUES ("${minimumFrequencyPreference}", "${difficulty}", ${sublessonId});`
          // );
          await strapi.connections.default.raw(
            `INSERT INTO sublesson_challenges_test_2
              (minimumFrequencyPreference, difficulty, sublesson, internalLabel)
              VALUES ("${minimumFrequencyPreference}", "${difficulty}", ${sublessonId}, "${internalLabel}");`
          );
          console.log("right before");
          const [idQuery] = await strapi.connections.default.raw(`
            select last_insert_rowid()
          `);
          const newRowId = idQuery["last_insert_rowid()"];
          console.log("final result!!!", newRowId);
          newSublessonChallengeIds.push(newRowId);
          await strapi.connections.default.raw(
            `UPDATE sublesson_challenges_test_2_components
              set sublesson_challenges_test_2_id = ${newRowId}
              WHERE sublesson_challenges_test_2_id = ${sublessonChallengeId}`
          );
        }
        data.sublesson_challenges_test = newSublessonChallengeIds;
        return;
        // for (let i = 0; i < data.sublesson_challenges_test.length; i++) {
        for (let i = data.sublesson_challenges_test.length - 1; i >= 0; i--) {
          const id = data.sublesson_challenges_test[i];
          console.log("i is", i, id, id === "2", id === 2);
          // await strapi.connections.default.raw(
          //   `UPDATE sublesson_challenges_test_2
          //    SET created_at = ${id === 1 ? 601 : 600}, published_at = ${
          //     id === 1 ? 601 : 600
          //   }

          //    WHERE id=${id}`
          // );
        }
        // for (const tag of data.tags) {
        //   await strapi.connections.default.raw(
        //     `INSERT INTO projects_tags__tags_projects (project_id, tag_id) VALUES (${params.id}, ${tag});`
        //   );
        // }
      }
    },
  },
};
