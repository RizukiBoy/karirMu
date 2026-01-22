module.exports = {
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        description:
          "Registrasi user sebagai pelamar atau company_hrd. Akun harus diaktivasi melalui email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Registrasi berhasil",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                example: {
                  message:
                    "Registrasi berhasil, silakan cek email untuk aktivasi",
                },
              },
            },
          },
          400: { description: "Input atau role tidak valid" },
          409: { description: "Email sudah terdaftar" },
          500: { description: "Server error" },
        },
      },
    },

    "/api/auth/activate": {
      post: {
        tags: ["Auth"],
        summary: "Activate account",
        description: "Aktivasi akun menggunakan token dari email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ActivateRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Akun berhasil diaktivasi",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
                example: {
                  message: "Akun aktif. Silakan login",
                },
              },
            },
          },
          400: { description: "Token tidak valid atau tidak dikirim" },
          500: { description: "Server error" },
        },
      },
    },

    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        description: "Login menggunakan email dan password yang sudah aktif.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login berhasil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    accessToken: { type: "string" },
                    role: {
                      type: "string",
                      example: "pelamar",
                    },
                    user: {
                      type: "object",
                      properties: {
                        full_name: { type: "string" },
                        email: { type: "string" },
                        company_id: {
                          type: "string",
                          nullable: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Email atau password tidak diisi" },
          401: { description: "Email atau password salah" },
          403: { description: "Akun belum diaktivasi" },
          500: { description: "Server error" },
        },
      },
    },
  },

  schemas: {
    RegisterRequest: {
      type: "object",
      required: ["email", "fullName", "password", "register_as"],
      properties: {
        email: {
          type: "string",
          example: "user@test.com",
        },
        fullName: {
          type: "string",
          example: "John Doe",
        },
        password: {
          type: "string",
          example: "password123",
        },
        register_as: {
          type: "string",
          enum: ["pelamar", "company_hrd"],
          example: "pelamar",
        },
      },
    },

    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          example: "user@test.com",
        },
        password: {
          type: "string",
          example: "password123",
        },
      },
    },

    ActivateRequest: {
      type: "object",
      required: ["token"],
      properties: {
        token: {
          type: "string",
          example: "e3b0c44298fc1c149afbf4c8996fb924",
        },
      },
    },

    MessageResponse: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Success message",
        },
      },
    },
  },
};
