import { ApiError } from "./ApiError.js";

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // If it's an ApiError, use its properties directly
        if (error instanceof ApiError) {
            const statusCode = error.statusCode;
            const message = error.message || "Internal server error";
            const errors = Array.isArray(error.errors) ? error.errors : [];
            
            return res.status(statusCode).json({
                success: false,
                message,
                errors
            });
        }
        
        // For other errors, return generic error
        const statusCode = error?.statusCode || 500;
        const message = error?.message || "Internal server error";
        
        res.status(statusCode).json({
            success: false,
            message,
            errors: []
        });
    }
}
export { asyncHandler }
// 