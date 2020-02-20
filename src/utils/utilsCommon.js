/** @module utilsCommon */

/**
 * @function compareCards
 * @description custom comparison function for card ids (card_x)
 * @param {string} a
 * @param {string} b
 * @returns {Number}
 */
export const compareCards = (a, b) => {
  const cardA = parseFloat(a.split("_")[1]);
  const cardB = parseFloat(b.split("_")[1]);
  if (cardA === cardB) {
    return 0;
  }
  return cardA < cardB ? -1 : 1;
};
