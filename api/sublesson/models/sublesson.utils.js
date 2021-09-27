const fieldsToIgnore = ["id"];

const SUBLESSON_CHALLENGE_COLLECTION_NAME = "sublesson_challenge";
const SUBLESSON_CHALLENGE_COLLECTION_NAME_PLURAL = "sublesson_challenges";
const GET_LAST_ROW_QUERY = "last_insert_rowid()";

const getLastInsertedRowId = async () => {
  const [idQuery] = await strapi.connections.default.raw(`
    SELECT ${GET_LAST_ROW_QUERY}
  `);
  return idQuery[GET_LAST_ROW_QUERY];
};

/*
 * This is a very hacky hack
 * See https://forum.strapi.io/t/save-relation-items-order-issue-2166/332/42
 *
 * sublessonChallengeIds: the ids, in order, of the sublessonChallenge relations
 * setSublessonChallengeIds: callback that takes the new ids and attaches them to the sublesson
 */
const enforceSublessonChallengeSortOrder = async (
  sublessonId,
  sublessonChallengeIds,
  setSublessonChallengeIds
) => {
  if (!sublessonId || !sublessonChallengeIds) {
    return;
  }

  const sublessonChallenges = await strapi.connections.default.raw(`
    SELECT * FROM ${SUBLESSON_CHALLENGE_COLLECTION_NAME_PLURAL} WHERE sublesson = ${sublessonId}
  `);

  if (!sublessonChallenges.length) {
    return;
  }

  const sublessonChallengeFields = Object.keys(sublessonChallenges[0]);
  const fieldsToRetain = sublessonChallengeFields.filter(
    (field) => !fieldsToIgnore.includes(field)
  );

  const newSublessonChallengeIds = [];

  for (const sublessonChallengeId of sublessonChallengeIds) {
    const currentSublessonChallenge = sublessonChallenges.find(
      ({ id }) => id == sublessonChallengeId
    );
    const valuesString = fieldsToRetain
      .map((field) => {
        const value = currentSublessonChallenge[field];
        if (typeof value === "string") {
          return `"${value}"`;
        } else if (value === undefined || value === null) {
          return "null";
        }

        return value;
      })
      .join(", ");

    await strapi.connections.default.raw(`
      INSERT INTO ${SUBLESSON_CHALLENGE_COLLECTION_NAME_PLURAL}
        (${fieldsToRetain.join(", ")})
      VALUES (${valuesString});
    `);
    const newRowId = await getLastInsertedRowId();

    newSublessonChallengeIds.push(newRowId);
    // Points the associated component to the newly created id instead of the old one
    await strapi.connections.default.raw(`
      UPDATE ${SUBLESSON_CHALLENGE_COLLECTION_NAME_PLURAL}_components
      SET ${SUBLESSON_CHALLENGE_COLLECTION_NAME}_id = ${newRowId}
      WHERE ${SUBLESSON_CHALLENGE_COLLECTION_NAME}_id = ${sublessonChallengeId}
    `);
  }

  const idsToDelete = sublessonChallenges.map(({ id }) => id);
  await strapi.connections.default.raw(`
    DELETE FROM ${SUBLESSON_CHALLENGE_COLLECTION_NAME_PLURAL}
    WHERE id IN (${idsToDelete.join(", ")});
  `);

  setSublessonChallengeIds(newSublessonChallengeIds);
};

module.exports = {
  enforceSublessonChallengeSortOrder,
};
