module.exports = {
  tags: [
    {
      name: "Jobs",
      description: "Job vacancy APIs",
    },
  ],

  paths: {
    // =========================
    // CREATE JOB (COMPANY)
    // =========================
    "/api/jobs": {
      post: {
        tags: ["Jobs"],
        summary: "Create job vacancy (company)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateJobRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Lowongan berhasil dibuat",
          },
          400: {
            description: "Validasi gagal",
          },
          401: {
            description: "User tidak valid",
          },
          403: {
            description: "User belum terhubung dengan company",
          },
          500: {
            description: "Gagal membuat lowongan",
          },
        },
      },
    },

    // =========================
    // PUBLIC JOBS
    // =========================
    "/api/public/jobs": {
      get: {
        tags: ["Jobs"],
        summary: "Get public job vacancies",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "job_field", in: "query", schema: { type: "string" } },
          { name: "location", in: "query", schema: { type: "string" } },
          { name: "type", in: "query", schema: { type: "string" } },
          { name: "work_type", in: "query", schema: { type: "string" } },
          {
            name: "page",
            in: "query",
            schema: { type: "number", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "number", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "List public jobs",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PublicJobListResponse",
                },
              },
            },
          },
          500: {
            description: "Gagal mengambil data lowongan",
          },
        },
      },
    },

    // =========================
    // JOBS BY COMPANY
    // =========================
    "/api/jobs/company": {
      get: {
        tags: ["Jobs"],
        summary: "Get jobs by company (owner)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", example: "true | false" },
          },
          { name: "search", in: "query", schema: { type: "string" } },
          {
            name: "page",
            in: "query",
            schema: { type: "number", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "number", default: 10 },
          },
        ],
        responses: {
          200: {
            description: "List jobs by company",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompanyJobListResponse",
                },
              },
            },
          },
          401: {
            description: "User tidak valid",
          },
          403: {
            description: "User belum terhubung dengan company",
          },
          500: {
            description: "Gagal mengambil lowongan company",
          },
        },
      },
    },
    "/api/jobs/{jobId}/apply": {
    post: {
        tags: ["Jobs"],
        summary: "Apply job (user)",
        security: [{ bearerAuth: [] }],
        parameters: [
        {
            name: "jobId",
            in: "path",
            required: true,
            schema: { type: "string" },
        },
        ],
        responses: {
        201: { description: "Lamaran berhasil dikirim" },
        400: {
            description: "CV belum diupload / Job ID tidak valid",
        },
        409: {
            description: "Sudah pernah melamar",
        },
        500: {
            description: "Gagal melamar pekerjaan",
        },
        },
    },
    },

    "/api/jobs/applications/{applyId}": {
    get: {
        tags: ["Jobs"],
        summary: "Get job applications for company (HRD)",
        security: [{ bearerAuth: [] }],
        responses: {
        200: {
            description: "List lamaran pekerjaan",
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/ApplyJobCompanyResponse",
                },
            },
            },
        },
        401: { description: "Unauthorized" },
        403: { description: "Akses ditolak" },
        500: { description: "Gagal mengambil data lamaran" },
        },
    },
    },
        "api/jobs/{jobId}": {
      get: {
        tags: ["Jobs"],
        summary: "Get job detail",
        description: "Mengambil detail lowongan berdasarkan jobId",
        parameters: [
          {
            name: "jobId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "65a9c6f8e9f1a23b12345678",
          },
        ],
        responses: {
          200: {
            description: "Detail lowongan",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    data: {
                      type: "object",
                      properties: {
                        job_name: { type: "string" },
                        location: { type: "string" },
                        type: { type: "string" },
                        work_type: { type: "string" },
                        salary_min: { type: "number" },
                        salary_max: { type: "number" },
                        requirement: { type: "string" },
                        date_job: { type: "string", format: "date-time" },
                        status: { type: "string" },
                        created_at: { type: "string", format: "date-time" },
                        job_field: {
                          type: "object",
                          properties: {
                            _id: { type: "string" },
                            name: { type: "string" },
                          },
                        },
                        company: {
                          type: "object",
                          properties: {
                            _id: { type: "string" },
                            company_name: { type: "string" },
                            logo_url: { type: "string" },
                            city: { type: "string" },
                            province: { type: "string" },
                            industry: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Job ID tidak valid",
          },
          404: {
            description: "Lowongan tidak ditemukan",
          },
          500: {
            description: "Gagal mengambil detail lowongan",
          },
        },
      },
    },

    "api/admin/jobs/{jobId}": {
      put: {
        tags: ["Jobs"],
        summary: "Update job (Admin AUM)",
        description: "Memperbarui lowongan pekerjaan oleh company HRD",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "jobId",
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
                type: "object",
                properties: {
                  job_name: { type: "string" },
                  job_field_id: { type: "string" },
                  location: { type: "string" },
                  type: { type: "string" },
                  work_type: { type: "string" },
                  description: { type: "string" },
                  requirement: { type: "string" },
                  status: {
                    type: "string",
                    example: "open",
                  },
                  salary_min: { type: "number" },
                  salary_max: { type: "number" },
                  date_job: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Lowongan berhasil diperbarui",
          },
          400: {
            description: "Validasi gagal / data tidak valid",
          },
          403: {
            description: "Akses ditolak",
          },
          404: {
            description: "Lowongan tidak ditemukan",
          },
          500: {
            description: "Gagal memperbarui lowongan",
          },
        },
      },
    },
},

  components: {
    schemas: {
      // =========================
      // CREATE JOB
      // =========================
      CreateJobRequest: {
        type: "object",
        required: [
          "job_field_id",
          "job_name",
          "location",
          "type",
          "work_type",
          "description",
          "requirement",
        ],
        properties: {
          job_field_id: {
            type: "string",
            example: "65ff123abc456",
          },
          job_name: {
            type: "string",
            example: "Backend Developer",
          },
          location: {
            type: "string",
            example: "Jakarta",
          },
          type: {
            type: "string",
            example: "Fulltime",
          },
          work_type: {
            type: "string",
            example: "Hybrid",
          },
          salary_min: {
            type: "number",
            nullable: true,
            example: 5000000,
          },
          salary_max: {
            type: "number",
            nullable: true,
            example: 8000000,
          },
          description: {
            type: "string",
          },
          requirement: {
            type: "string",
          },
          date_job: {
            type: "string",
            format: "date-time",
          },
          status: {
            type: "boolean",
            example: true,
          },
        },
      },

      // =========================
      // PUBLIC JOB RESPONSE
      // =========================
      PublicJobListResponse: {
        type: "object",
        properties: {
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          total_pages: { type: "number" },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                job_name: { type: "string" },
                location: { type: "string" },
                type: { type: "string" },
                work_type: { type: "string" },
                salary_min: { type: "number", nullable: true },
                salary_max: { type: "number", nullable: true },
                description: { type: "string" },
                requirement: { type: "string" },
                created_at: {
                  type: "string",
                  format: "date-time",
                },
                company: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    company_name: { type: "string" },
                    logo_url: { type: "string" },
                  },
                },
                job_field: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    name: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },

      // =========================
      // COMPANY JOB RESPONSE
      // =========================
    CompanyJobListResponse: {
        type: "object",
        properties: {
          page: { type: "number" },
          limit: { type: "number" },
          total: { type: "number" },
          total_pages: { type: "number" },
          data: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
    },
    JobDetailResponse: {
            type: "object",
            properties: {
                message: { type: "string" },
        data: {
        type: "object",
        properties: {
            job_name: { type: "string" },
            location: { type: "string" },
            type: { type: "string" },
            work_type: { type: "string" },
            salary_min: { type: "number", nullable: true },
            salary_max: { type: "number", nullable: true },
            requirement: { type: "string" },
            date_job: { type: "string", format: "date-time" },
            status: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            job_field: {
            type: "object",
            properties: {
                _id: { type: "string" },
                name: { type: "string" },
            },
            },
            company: {
            type: "object",
            properties: {
                _id: { type: "string" },
                company_name: { type: "string" },
                logo_url: { type: "string" },
                city: { type: "string" },
                province: { type: "string" },
                industry: { type: "string" },
            },
            },
        },
        },
    },
    },

    UpdateJobRequest: {
    type: "object",
    properties: {
        job_name: { type: "string" },
        job_field_id: { type: "string" },
        location: { type: "string" },
        type: { type: "string" },
        work_type: { type: "string" },
        description: { type: "string" },
        requirement: { type: "string" },
        salary_min: { type: "number" },
        salary_max: { type: "number" },
        date_job: {
        type: "string",
        format: "date-time",
        },
        status: { type: "boolean" },
    },
    },

    ApplyJobCompanyResponse: {
    type: "object",
    properties: {
        total: { type: "number" },
        data: {
        type: "array",
        items: {
            type: "object",
            properties: {
            apply_status: { type: "string" },
            apply_date: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            cv_url: { type: "string" },
            hrd_notes: { type: "string", nullable: true },
            job: {
                type: "object",
                properties: {
                _id: { type: "string" },
                job_name: { type: "string" },
                location: { type: "string" },
                type: { type: "string" },
                work_type: { type: "string" },
                },
            },
            applicant: {
                type: "object",
                properties: {
                _id: { type: "string" },
                email: { type: "string" },
                full_name: { type: "string" },
                },
            },
            },
        },
        },
    },
    },
    },
  },
};
