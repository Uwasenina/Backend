const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description: "API documentation for the E-Commerce platform built with Express, TypeScript, and MongoDB."
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local development server"
    }
  ],
  tags: [
    { name: "Products", description: "Product management endpoints" },
    { name: "Cart", description: "Shopping cart operations" },
    { name: "Orders", description: "Order management operations" },
    { name: "Contact", description: "Contact and support endpoints" },
    { name: "Users & Auth", description: "Authentication and password reset" },
    { name: "Dashboard", description: "Admin dashboard and analytics" }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullName: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          accessToken: { type: "string" },
          userRole: { type: "string", enum: ["admin", "user"] }
        }
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          price: { type: "number" },
          description: { type: "string" },
          imageUrl: { type: "string" },
          category: { type: "string" }
        }
      },
      CartItem: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "integer" },
          subtotal: { type: "number" }
        }
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "string" },
                quantity: { type: "integer" }
              }
            }
          },
          totalPrice: { type: "number" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Contact: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          message: { type: "string" }
        }
      },
      PasswordReset: {
        type: "object",
        properties: {
          userId: { type: "string" },
          otp: { type: "string" },
          expiresAt: { type: "string", format: "date-time" }
        }
      }
    }
  },
  paths: {
    //  Products
    "/products/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        responses: {
          200: {
            description: "List of products",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Product" } }
              }
            }
          }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Create a new product",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                  imageUrl: { type: "string", format: "binary" },
                  category: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Product created" } }
      }
    },
    "/products/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product details" } }
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Product" } }
          }
        },
        responses: { 200: { description: "Product updated" } }
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Product deleted" } }
      }
    },

    //  Cart
    "/cart": {
      post: {
        tags: ["Cart"],
        summary: "Add to cart",
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CartItem" }
            }
          }
        },
        responses: { 201: { description: "Item added to cart" } }
      },
      get: {
        tags: ["Cart"],
        summary: "Get user cart",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Cart items",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/CartItem" } }
              }
            }
          }
        }
      }
    },
    "/cart/{productId}": {
      put: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", properties: { quantity: { type: "integer" } } }
            }
          }
        },
        responses: { 200: { description: "Cart updated" } }
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Item removed" } }
      }
    },

    //  Orders
    "/orders": {
      post: {
        tags: ["Orders"],
        summary: "Place an order",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Order placed" } }
      },
      get: {
        tags: ["Orders"],
        summary: "Get all user orders",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "List of orders",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Order" } }
              }
            }
          }
        }
      }
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Order details" } }
      },
      delete: {
        tags: ["Orders"],
        summary: "Cancel order",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Order cancelled" } }
      }
    },

    //  Contact
    "/contact/send-email": {
      post: {
        tags: ["Contact"],
        summary: "Send contact email",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Contact" } }
          }
        },
        responses: { 200: { description: "Email sent" } }
      }
    },

    // Users & Auth
    "/request-reset": {
      post: {
        tags: ["Users & Auth"],
        summary: "Request password reset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { email: { type: "string" } } }
            }
          }
        },
        responses: { 200: { description: "OTP sent" } }
      }
    },
    "/reset-password": {
      post: {
        tags: ["Users & Auth"],
        summary: "Reset password with OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  otp: { type: "string" },
                  newPassword: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Password reset successful" } }
      }
    },

    //  Dashboard
    "/dashboard": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard statistics",
        responses: { 200: { description: "Dashboard data returned" } }
      }
    }
  }
};

export default swaggerDocument;
