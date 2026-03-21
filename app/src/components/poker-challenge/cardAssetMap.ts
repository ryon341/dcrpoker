/**
 * Maps normalized card codes (e.g. "AS", "TD", "2C") to their deck SVG assets.
 * Ranks: A K Q J T 9 8 7 6 5 4 3 2
 * Suits: S H D C (Spades, Hearts, Diamonds, Clubs)
 */
export const CARD_ASSET_MAP: Record<string, number> = {
  // ── Aces ──
  AS: require('../../../assets/deck/ace_of_spades.svg'),
  AH: require('../../../assets/deck/ace_of_hearts.svg'),
  AD: require('../../../assets/deck/ace_of_diamonds.svg'),
  AC: require('../../../assets/deck/ace_of_clubs.svg'),

  // ── Kings ──
  KS: require('../../../assets/deck/king_of_spades.svg'),
  KH: require('../../../assets/deck/king_of_hearts.svg'),
  KD: require('../../../assets/deck/king_of_diamonds.svg'),
  KC: require('../../../assets/deck/king_of_clubs.svg'),

  // ── Queens ──
  QS: require('../../../assets/deck/queen_of_spades.svg'),
  QH: require('../../../assets/deck/queen_of_hearts.svg'),
  QD: require('../../../assets/deck/queen_of_diamonds.svg'),
  QC: require('../../../assets/deck/queen_of_clubs.svg'),

  // ── Jacks ──
  JS: require('../../../assets/deck/jack_of_spades.svg'),
  JH: require('../../../assets/deck/jack_of_hearts.svg'),
  JD: require('../../../assets/deck/jack_of_diamonds.svg'),
  JC: require('../../../assets/deck/jack_of_clubs.svg'),

  // ── Tens ──
  TS: require('../../../assets/deck/10_of_spades.svg'),
  TH: require('../../../assets/deck/10_of_hearts.svg'),
  TD: require('../../../assets/deck/10_of_diamonds.svg'),
  TC: require('../../../assets/deck/10_of_clubs.svg'),

  // ── Nines ──
  '9S': require('../../../assets/deck/9_of_spades.svg'),
  '9H': require('../../../assets/deck/9_of_hearts.svg'),
  '9D': require('../../../assets/deck/9_of_diamonds.svg'),
  '9C': require('../../../assets/deck/9_of_clubs.svg'),

  // ── Eights ──
  '8S': require('../../../assets/deck/8_of_spades.svg'),
  '8H': require('../../../assets/deck/8_of_hearts.svg'),
  '8D': require('../../../assets/deck/8_of_diamonds.svg'),
  '8C': require('../../../assets/deck/8_of_clubs.svg'),

  // ── Sevens ──
  '7S': require('../../../assets/deck/7_of_spades.svg'),
  '7H': require('../../../assets/deck/7_of_hearts.svg'),
  '7D': require('../../../assets/deck/7_of_diamonds.svg'),
  '7C': require('../../../assets/deck/7_of_clubs.svg'),

  // ── Sixes ──
  '6S': require('../../../assets/deck/6_of_spades.svg'),
  '6H': require('../../../assets/deck/6_of_hearts.svg'),
  '6D': require('../../../assets/deck/6_of_diamonds.svg'),
  '6C': require('../../../assets/deck/6_of_clubs.svg'),

  // ── Fives ──
  '5S': require('../../../assets/deck/5_of_spades.svg'),
  '5H': require('../../../assets/deck/5_of_hearts.svg'),
  '5D': require('../../../assets/deck/5_of_diamonds.svg'),
  '5C': require('../../../assets/deck/5_of_clubs.svg'),

  // ── Fours ──
  '4S': require('../../../assets/deck/4_of_spades.svg'),
  '4H': require('../../../assets/deck/4_of_hearts.svg'),
  '4D': require('../../../assets/deck/4_of_diamonds.svg'),
  '4C': require('../../../assets/deck/4_of_clubs.svg'),

  // ── Threes ──
  '3S': require('../../../assets/deck/3_of_spades.svg'),
  '3H': require('../../../assets/deck/3_of_hearts.svg'),
  '3D': require('../../../assets/deck/3_of_diamonds.svg'),
  '3C': require('../../../assets/deck/3_of_clubs.svg'),

  // ── Twos ──
  '2S': require('../../../assets/deck/2_of_spades.svg'),
  '2H': require('../../../assets/deck/2_of_hearts.svg'),
  '2D': require('../../../assets/deck/2_of_diamonds.svg'),
  '2C': require('../../../assets/deck/2_of_clubs.svg'),
};
