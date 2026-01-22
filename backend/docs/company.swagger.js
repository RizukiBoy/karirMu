module.exports = {
  paths: {
    "/api/company/submit": {
      post: {
        tags: ["Company"],
        summary: "Create company profile with documents",
        description:
          "Membuat profil company beserta upload logo dan dokumen. Khusus role company_hrd.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/CreateCompanyRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Company profile & documents berhasil dikirim",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          400: { description: "Validasi gagal / input tidak valid" },
          401: { description: "User tidak valid" },
          500: { description: "Server error" },
        },
      },
    },

    "/api/company/profile": {
      get: {
        tags: ["Company"],
        summary: "Get company profile & documents",
        description:
          "Mengambil profil company beserta dokumen dan statistik status.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List company documents",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyProfileResponse",
                },
              },
            },
          },
          404: { description: "Perusahaan tidak ditemukan" },
          500: { description: "Server error" },
        },
      },
    },

    "/api/company/edit-profile": {
      put: {
        tags: ["Company"],
        summary: "Update company profile",
        description: "Memperbarui profil company. Logo opsional.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UpdateCompanyRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profil company berhasil diperbarui",
          },
          400: { description: "Validasi gagal" },
          404: { description: "Company tidak ditemukan" },
          500: { description: "Server error" },
        },
      },
    },
  },

  schemas: {
    CreateCompanyRequest: {
      type: "object",
      required: ["company_name", "company_email", "company_phone", "logo", "documents"],
      properties: {
        company_name: { type: "string", example: "PT KarirMu Indonesia" },
        description: { type: "string" },
        address: { type: "string" },
        province: { type: "string" },
        city: { type: "string" },
        industry: { type: "string", example: "Technology" },
        employee_range: {
          type: "number",
          example: 50,
        },
        company_email: {
          type: "string",
          example: "hr@karirmu.com",
        },
        company_phone: {
          type: "string",
          example: "08123456789",
        },
        company_url: {
          type: "string",
          example: "https://karirmu.com",
        },
        document_names: {
          type: "string",
          description:
            "JSON string array, contoh: ['npwp','siup']",
          example: '["npwp","siup"]',
        },
        logo: {
          type: "string",
          format: "binary",
        },
        documents: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },

    UpdateCompanyRequest: {
      type: "object",
      required: ["company_name", "company_email", "company_phone"],
      properties: {
        company_name: { type: "string" },
        description: { type: "string" },
        address: { type: "string" },
        province: { type: "string" },
        city: { type: "string" },
        industry: { type: "string" },
        employee_range: { type: "number" },
        company_email: { type: "string" },
        company_phone: { type: "string" },
        company_url: { type: "string" },
        logo: {
          type: "string",
          format: "binary",
        },
      },
    },

    CompanyProfileResponse: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "List company documents",
        },
        company: {
          type: "object",
        },
        documents: {
          type: "array",
          items: {
            type: "object",
          },
        },
        document_stats: {
          type: "object",
          properties: {
            total: { type: "number" },
            approved: { type: "number" },
            rejected: { type: "number" },
            pending: { type: "number" },
          },
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
