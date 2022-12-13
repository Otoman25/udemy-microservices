import express, { NextFunction } from 'express';
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/RequestValidationError";

export const signupValidator = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
];

export const signinValidator = [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must enter a password')
];