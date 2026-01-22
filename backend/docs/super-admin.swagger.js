module.exports = {
  tags: [
    {
      name: "Super Admin",
      description: "Super Admin & Admin AUM Management",
    },
  ],

  paths: {
    /**
     * =========================
     * SUPER ADMIN AUTH
     * =========================
     */

    "/api/admin/add": {
      post: {
        tags: ["Super Admin"],
        summary: "Tambah admin baru",
        description: "Endpoint untuk Super Admin menambahkan admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddAdminRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Admin berhasil ditambahkan",
          },
          400: {
            description: "Semua field wajib diisi",
          },
          500: {
            description: "Server error",
          },
        },
      },
    },

    "/api/admin/login": {
      post: {
        tags: ["Super Admin"],
        summary: "Login Super Admin / Admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdminLoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login berhasil",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AdminLoginResponse" },
              },
            },
          },
          401: {
            description: "Email atau password salah",
          },
        },
      },
    },

    /**
     * =========================
     * SUPER ADMIN DASHBOARD
     * =========================
     */

    "/api/admin/dashboard": {
      get: {
        tags: ["Super Admin"],
        summary: "Dashboard Super Admin",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Akses dashboard berhasil",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },

    /**
     * =========================
     * ADMIN AUM MANAGEMENT
     * =========================
     */

    "/api/admin/admin-aum": {
      get: {
        tags: ["Super Admin"],
        summary: "List Admin AUM & status verifikasi company",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Berhasil mengambil list admin AUM",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/AdminAumItem",
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
          },
        },
      },
    },

    "/api/admin/admin-aum/{companyId}": {
      get: {
        tags: ["Super Admin"],
        summary: "Detail company & dokumen Admin AUM",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "companyId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Detail company & dokumen",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AdminAumDetailResponse",
                },
              },
            },
          },
          404: {
            description: "Company tidak ditemukan",
          },
        },
      },
    },

    "/api/admin/admin-aum/document/{documentId}": {
      patch: {
        tags: ["Super Admin"],
        summary: "Verifikasi dokumen company (approve / reject)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "documentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VerifyDocumentRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Dokumen berhasil diverifikasi / ditolak",
          },
          400: {
            description: "Status atau documentId tidak valid",
          },
          404: {
            description: "Dokumen tidak ditemukan",
          },
        },
      },
    },
  },

  /**
   * =========================
   * SCHEMAS (KHUSUS SUPER ADMIN)
   * =========================
   */
  schemas: {
    AddAdminRequest: {
      type: "object",
      required: ["admin_id", "name", "email", "password"],
      properties: {
        admin_id: { type: "string", example: "ADM001" },
        name: { type: "string", example: "Super Admin" },
        email: { type: "string", format: "email" },
        password: { type: "string", example: "password123" },
      },
    },

    AdminLoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" },
      },
    },

    AdminLoginResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
        accessToken: { type: "string" },
        admin: {
          type: "object",
          properties: {
            admin_id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },

    AdminAumItem: {
      type: "object",
      properties: {
        email: { type: "string" },
        company_id: { type: "string" },
        company_name: { type: "string" },
        verification: {
          type: "object",
          properties: {
            total_documents: { type: "number" },
            approved_count: { type: "number" },
            rejected_count: { type: "number" },
            status: {
              type: "string",
              enum: ["approved", "rejected", "pending"],
            },
            is_verified: { type: "boolean" },
          },
        },
      },
    },

    AdminAumDetailResponse: {
      type: "object",
      properties: {
        company: { type: "object" },
        documents: {
          type: "array",
          items: { type: "object" },
        },
      },
    },

    VerifyDocumentRequest: {
      type: "object",
      required: ["status"],
      properties: {
        status: {
          type: "string",
          enum: ["approved", "rejected"],
        },
      },
    },
  },
};
