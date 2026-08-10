/**
 * --------------------------------------------------------------------------
 * API Response Utility
 * --------------------------------------------------------------------------
 * Standard Response Format
 *
 * Success:
 * {
 *   success: true,
 *   message: "...",
 *   data: {}
 * }
 *
 * Error:
 * {
 *   success: false,
 *   message: "...",
 *   errors: []
 * }
 * --------------------------------------------------------------------------
 */

class ApiResponse {

    /**
     * Success Response
     */
    static success(
        res,
        message = "Success",
        data = null,
        statusCode = 200
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    /**
     * Generic Error Response
     */
    static error(
        res,
        message = "Something went wrong.",
        errors = [],
        statusCode = 500
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    /**
     * Validation Error (422)
     */
    static validationError(res, errors = []) {
        return res.status(422).json({
            success: false,
            message: "Validation failed.",
            errors
        });
    }

    /**
     * Bad Request (400)
     */
    static badRequest(
        res,
        message = "Bad Request",
        errors = []
    ) {
        return res.status(400).json({
            success: false,
            message,
            errors
        });
    }

    /**
     * Unauthorized (401)
     */
    static unauthorized(
        res,
        message = "Unauthorized"
    ) {
        return res.status(401).json({
            success: false,
            message
        });
    }

    /**
     * Forbidden (403)
     */
    static forbidden(
        res,
        message = "Forbidden"
    ) {
        return res.status(403).json({
            success: false,
            message
        });
    }

    /**
     * Record Not Found (404)
     */
    static notFound(
        res,
        message = "Record not found."
    ) {
        return res.status(404).json({
            success: false,
            message
        });
    }

    /**
     * Conflict (409)
     * Example:
     * Duplicate Mobile
     * Duplicate PAN
     * Duplicate Email
     */
    static conflict(
        res,
        message = "Conflict occurred."
    ) {
        return res.status(409).json({
            success: false,
            message
        });
    }

    /**
     * Created (201)
     */
    static created(
        res,
        message = "Created successfully.",
        data = null
    ) {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

}

module.exports = ApiResponse;