/**
 * @swagger
 * components:
 *   schemas:
 *     Holiday:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Holiday trip ID.
 *         destination:
 *           type: string
 *           description: Holiday destination.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Holiday start date.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Holiday end date.
 *         description:
 *           type: string
 *           description: Holiday description.
 *         organiser:
 *           $ref: '#/components/schemas/User'
 *         attendees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date.
 */
import express, { NextFunction, Request, Response } from 'express';
import tripService from '../service/trip.service';

const tripRouter = express.Router();

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Get all holiday trips
 *     description: Retrieves all available holiday trips. Public endpoint - no authentication required.
 *     tags:
 *       - Holidays
 *     responses:
 *       200:
 *         description: List of holiday trips retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Holiday'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "application error"
 *                 message:
 *                   type: string
 *                   example: "Database error. See server log for details."
 */
tripRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
});

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a specific holiday trip by ID
 *     description: Retrieves a specific holiday trip by its ID. Public endpoint - no authentication required.
 *     tags:
 *       - Holidays
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the holiday trip
 *         schema:
 *           type: integer
 *           format: int64
 *           example: 1
 *     responses:
 *       200:
 *         description: Holiday trip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Holiday'
 *       404:
 *         description: Holiday trip not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "application error"
 *                 message:
 *                   type: string
 *                   example: "Trip with id: 999 does not exist."
 *       500:
 *         description: Internal server error
 */
tripRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
});

export { tripRouter };
