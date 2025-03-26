
import { Response } from 'express';

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    statusCode?: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const sendSuccess = <T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode?: number
): Response => {
    const response: ApiResponse<T> = {
        status: 'success',
        data,
        message,
        statusCode
    };

    return res.status(statusCode as number).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    statusCode: number,
    error?: any
): Response => {
    const response: ApiResponse<null> = {
        status: 'error',
        message,
        statusCode
    };

    return res.status(statusCode).json(response);
};

export const sendPaginatedSuccess = <T>(
    res: Response,
    data: T,
    total: number,
    page: number,
    limit: number,
    message?: string
): Response => {
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedApiResponse<T> = {
        status: 'success',
        data,
        message,
        pagination: {
            total,
            page,
            limit,
            totalPages
        }
    };

    return res.status(200).json(response);
};