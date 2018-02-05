const express = require('express')
// Requires status messages from http-status lib
const {
  OK,
  CREATED,
  NO_CONTENT
} = require('http-status')
// Requires winston lib for log
const { log } = require('../../main/logger')
// Requires CRUD apis
const Post = require('../db-api/posts')

const router = express.Router()

router.route('/')
  // POST route
  .post(async (req, res, next) => {
    try {
      await Post.create(req.body)
      res.status(CREATED).end()
    } catch (err) {
      next(err)
    }
  })
  // GET ALL posts
  .get(async (req, res, next) => {
    try {
      const results = await Post.list({ limit: req.query.limit, page: req.query.page })
      console.log(results)
      // Sends the given results with status 200
      res.status(OK).json({
        results: results.docs,
        pagination: {
          count: results.total,
          page: results.page,
          limit: results.limit
        }
      })
    } catch (err) {
      next(err)
    }
  })

router.route('/:id')
  // GET a post with a given ID
  .get(async (req, res, next) => {
    try {
      const post = await Post.get(req.params.id)
      res.status(OK).json(post)
    } catch (err) {
      next(err)
    }
  })
  // UPDATE a post with a given ID
  .put(async (req, res, next) => {
    try {
      await Post.update({ id: req.params.id, post: req.body })
      res.status(NO_CONTENT).end()
    } catch (err) {
      next(err)
    }
  })
  // DELETE  a post with a given ID
  .delete(async (req, res, next) => {
    try {
      await Post.remove(req.params.id)
      res.status(NO_CONTENT).end()
    } catch (err) {
      next(err)
    }
  })

// Exports all the functions
module.exports = router
