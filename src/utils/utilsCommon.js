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

/**
 * @function shuffle
 * @description shuffles any array of tiles provided and returns randomized (using Fisher-Yates shuffle)
 * @param {Array} tiles
 * @returns {Array}
 */
export const shuffle = tiles => {
  const shuffledCards = [...tiles];
  const numberOfShuffles = 5;
  for (let s = 0; s < numberOfShuffles; s += 1) {
    for (let i = shuffledCards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i]
      ];
    }
  }
  return shuffledCards;
};

/**
 * @function randAndArrangeRecommendations
 * @description randomize than arrange (sort) recommendationsArray
 * @param {Array} recommendationsArray
 * @returns {Array}
 */
export const randAndArrangeRecommendations = recommendationsArray => {
  const array = [...recommendationsArray];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  const sortedEvaluations = array.sort((a, b) => (a.value < b.value ? 1 : -1));
  return sortedEvaluations;
};
