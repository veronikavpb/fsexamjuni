/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      AuthenticationResponse:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              description: Authentication response.
 *            token:
 *              type: string
 *              description: JWT access token.
 *            email:
 *              type: string
 *              description: User email.
 *            firstName:
 *              type: string
 *              description: User first name.
 *            lastName:
 *              type: string
 *              description: User last name.
 *      AuthenticationRequest:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              description: User email.
 *            password:
 *              type: string
 *              description: User password.
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            email:
 *              type: string
 *              description: User email.
 *            firstName:
 *              type: string
 *              description: User first name.
 *            lastName:
 *              type: string
 *              description: User last name.
 *            isOrganiser:
 *              type: boolean
 *              description: Whether the user is an organiser.
 *            createdAt:
 *              type: string
 *              format: date-time
 *              description: User creation date.
 *            updatedAt:
 *              type: string
 *              format: date-time
 *              description: User last update date.
 *      UserInput:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              description: User email.
 *            password:
 *              type: string
 *              description: User password.
 *            firstName:
 *              type: string
 *              description: User first name.
 *            lastName:
 *              type: string
 *              description: User last name.
 *            isOrganiser:
 *              type: boolean
 *              description: Whether the user is an organiser.
 *              default: false
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types/index';

const userRouter = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *      summary: Login using email/password. Returns an object with JWT token and user details when successful.
 *      tags:
 *        - Authentication
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthenticationRequest'
 *      responses:
 *         200:
 *            description: Authentication successful
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AuthenticationResponse'
 *         400:
 *            description: Invalid credentials or request data
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    status:
 *                      type: string
 *                      example: "application error"
 *                    message:
 *                      type: string
 *                      example: "Incorrect password."
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;

        if (!userInput.email || !userInput.password) {
            return res.status(400).json({ errorMessage: 'Email and password are required.' });
        }

        const response = await userService.authenticate(userInput);
        res.status(200).json({
            id: response.id,
            token: response.token,
            firstName: response.firstName,
            lastName: response.lastName,
            role: response.role,
        });
    } catch (error: any) {
        if (error.message === 'Incorrect password.') {
            return res.status(401).json({ errorMessage: 'Incorrect password.' });
        }

        if (
            error.message.includes('Cannot read properties') ||
            error.message.includes('getPassword')
        ) {
            return res.status(401).json({ errorMessage: 'No account found with this email.' });
        }

        next(error);
    }
});

export { userRouter };
