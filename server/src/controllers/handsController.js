'use strict';

const { ok, badRequest, notFound, serverError } = require('../utils/respond');
const {
  createHand,
  listHands,
  getHandById,
  updateHand,
  deleteHand,
} = require('../services/handsService');

// POST /api/my/hands
async function postHand(req, res) {
  const userId = req.user.id;
  const {
    game_type,
    stakes,
    table_format,
    position,
    hero_hand,
    stack_depth_bb,
    preflop_action,
    postflop_action,
    result_amount,
    result_type,
    tags,
    notes,
    review_status,
  } = req.body;

  if (!game_type)  return badRequest(res, 'game_type is required');
  if (!position)   return badRequest(res, 'position is required');
  if (!hero_hand)  return badRequest(res, 'hero_hand is required');

  try {
    const hand = await createHand(userId, {
      game_type, stakes, table_format, position, hero_hand,
      stack_depth_bb, preflop_action, postflop_action,
      result_amount, result_type, tags, notes, review_status,
    });
    return ok(res, hand, 201);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/hands
async function getHands(req, res) {
  const userId = req.user.id;
  const { game_type, stakes, tag, review_status, limit, offset } = req.query;
  try {
    const hands = await listHands(userId, { game_type, stakes, tag, review_status, limit, offset });
    return ok(res, hands);
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/my/hands/:id
async function getHand(req, res) {
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);
  if (!id) return badRequest(res, 'Invalid id');
  try {
    const hand = await getHandById(userId, id);
    if (!hand) return notFound(res, 'Hand not found');
    return ok(res, hand);
  } catch (err) {
    return serverError(res, err);
  }
}

// PUT /api/my/hands/:id
async function putHand(req, res) {
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);
  if (!id) return badRequest(res, 'Invalid id');
  try {
    const existing = await getHandById(userId, id);
    if (!existing) return notFound(res, 'Hand not found');
    const hand = await updateHand(userId, id, req.body);
    return ok(res, hand);
  } catch (err) {
    return serverError(res, err);
  }
}

// DELETE /api/my/hands/:id
async function destroyHand(req, res) {
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);
  if (!id) return badRequest(res, 'Invalid id');
  try {
    const deleted = await deleteHand(userId, id);
    if (!deleted) return notFound(res, 'Hand not found');
    return ok(res, { deleted: true });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { postHand, getHands, getHand, putHand, destroyHand };
