// Standardized error response formatter
const errorHandler = {
  // Client errors (4xx)
  badRequest: (message = "Bad request") => ({
    status: 400,
    body: { success: false, error: { code: "BAD_REQUEST", message } }
  }),

  unauthorized: (message = "Unauthorized") => ({
    status: 401,
    body: { success: false, error: { code: "UNAUTHORIZED", message } }
  }),

  forbidden: (message = "Access denied") => ({
    status: 403,
    body: { success: false, error: { code: "FORBIDDEN", message } }
  }),

  notFound: (message = "Resource not found") => ({
    status: 404,
    body: { success: false, error: { code: "NOT_FOUND", message } }
  }),

  conflict: (message = "Resource already exists") => ({
    status: 409,
    body: { success: false, error: { code: "CONFLICT", message } }
  }),

  validationError: (errors = []) => ({
    status: 400,
    body: { success: false, error: { code: "VALIDATION_ERROR", message: "Validation failed", details: errors } }
  }),

  // Server errors (5xx)
  serverError: (message = "Internal server error") => ({
    status: 500,
    body: { success: false, error: { code: "SERVER_ERROR", message } }
  }),

  // Success responses
  success: (data = null, message = "Success") => ({
    status: 200,
    body: { success: true, data, message }
  }),

  created: (data = null, message = "Created successfully") => ({
    status: 201,
    body: { success: true, data, message }
  })
};

// Middleware to handle errors consistently
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
