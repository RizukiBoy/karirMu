module.exports = {
  paths: {
    "/admin/job-fields": {
      post: {
        tags: ["Admin - Job Fields"],
        summary: "Create job field",
        description: "Membuat job field baru",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    example: "Teknologi Informasi",
                  },
                  description: {
                    type: "string",
                    example: "Bidang pekerjaan IT dan software",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Job field berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        slug: { type: "string" },
                        created_at: {
                          type: "string",
                          format: "date-time",
                        },
                        updated_at: {
                          type: "string",
                          format: "date-time",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Nama job field wajib diisi",
          },
          409: {
            description: "Job field sudah ada",
          },
          500: {
            description: "Gagal membuat job field",
          },
        },
      },
    },

    "/job-fields": {
      get: {
        tags: ["Job Fields"],
        summary: "Get job fields",
        description: "Mengambil list semua job field",
        responses: {
          200: {
            description: "List job fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          name: { type: "string" },
                          slug: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Gagal mengambil job fields",
          },
        },
      },
    },

    "/admin/job-fields/{id}": {
      delete: {
        tags: ["Admin - Job Fields"],
        summary: "Delete job field",
        description: "Menghapus job field jika tidak digunakan oleh job",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "65a9c6f8e9f1a23b12345678",
          },
        ],
        responses: {
          200: {
            description: "Job field berhasil dihapus",
          },
          400: {
            description: "ID job field tidak valid",
          },
          404: {
            description: "Job field tidak ditemukan",
          },
          409: {
            description:
              "Job field tidak dapat dihapus karena masih digunakan",
          },
          500: {
            description: "Gagal menghapus job field",
          },
        },
      },
    },
  },
};
