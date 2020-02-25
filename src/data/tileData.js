/** @module tileData */

export const tileDictionary = {
  Mask: {
    count: 7
  },
  Scroll: {
    count: 8
  },
  Helmet: {
    count: 7
  },
  Coin: {
    count: 8
  },
  Pillar: {
    count: 8
  },
  Urn: {
    count: 8
  },
  WildHM: {
    count: 1,
    wilds: ["Helmet", "Mask"]
  },
  WildUS: {
    count: 1,
    wilds: ["Urn", "Scroll"]
  },
  WildPC: {
    count: 1,
    wilds: ["Pillar", "Coin"]
  }
};
