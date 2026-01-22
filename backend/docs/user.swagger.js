module.exports = {
  tags: [
    {
      name: "User Profile",
      description: "User profile, document, and education management",
    },
  ],

  paths: {
    // user profile
    "/api/user/profile": {
      post: {
        tags: ["User Profile"],
        summary: "Create / Update user profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/CreateUserProfileRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "User profile berhasil disimpan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateUserProfileResponse",
                },
              },
            },
          },
        },
      },

      get: {
        tags: ["User Profile"],
        summary: "Get user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Data profil user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserProfileResponse",
                },
              },
            },
          },
          404: {
            description: "Profile belum dibuat",
          },
        },
      },
    },
    // user document
    "/api/user/document": {
      post: {
        tags: ["User Profile"],
        summary: "Upload / Update user document",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UpsertUserDocumentRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Dokumen user berhasil disimpan",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpsertUserDocumentResponse",
                },
              },
            },
          },
        },
      },

      get: {
        tags: ["User Profile"],
        summary: "Get user document",
        description: "Mengambil dokumen user (CV & portofolio)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dokumen user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetUserDocumentResponse",
                },
              },
            },
          },
          500: {
            description: "Gagal mengambil dokumen user",
          },
        },
      },
    },
    // user education
    "/api/user/education": {
      post: {
        tags: ["User Profile"],
        summary: "Create / Update user education",
        description: "Upsert data pendidikan user berdasarkan jenjang",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUserEducationRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Data pendidikan berhasil disimpan",
          },
          400: {
            description: "Validasi gagal",
          },
        },
      },
    //   get user education
      get: {
        tags: ["User Profile"],
        summary: "Get user education list",
        description: "Mengambil daftar pendidikan user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Data pendidikan berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetUserEducationResponse",
                },
              },
            },
          },
        },
      },
    },
    // user skill
    "/api/user/skill": {
      post: {
        tags: ["User Profile"],
        summary: "Create / Update user skill",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserSkillRequest",
              },
            },
          },
        },
        responses: {
          200: { description: "Skill berhasil disimpan" },
          400: { description: "Validasi gagal" },
          500: { description: "Server error" },
        },
      },

      get: {
        tags: ["User Profile"],
        summary: "Get user skills",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List skill user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UserSkillResponse",
                },
              },
            },
          },
          500: { description: "Server error" },
        },
      },
    },
    // user work experience
    "/api/user/work-experience": {
      post: {
        tags: ["User Profile"],
        summary: "Create work experience",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkExperienceRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Work experience berhasil ditambahkan",
          },
          400: {
            description: "company_name, job_title, dan start_date wajib diisi",
          },
          500: {
            description: "Server error",
          },
        },
      },

      get: {
        tags: ["User Profile"],
        summary: "Get work experience by user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List work experience user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/WorkExperienceListResponse",
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
    // user work experience
    "/api/user/work-experience/{id}": {
        put: {
            tags: ["User Profile"],
            summary: "Update work experience",
            security: [{ bearerAuth: [] }],
            parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: {
                type: "string",
                },
            },
            ],
            requestBody: {
            required: true,
            content: {
                "application/json": {
                schema: {
                    $ref: "#/components/schemas/UpdateWorkExperienceRequest",
                },
                },
            },
            },
            responses: {
            200: {
                description: "Work experience berhasil diperbarui",
            },
            404: {
                description: "Data tidak ditemukan",
            },
            500: {
                description: "Server error",
            },
            },
        },

        delete: {
            tags: ["User Profile"],
            summary: "Delete work experience",
            security: [{ bearerAuth: [] }],
            parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: {
                type: "string",
                },
            },
            ],
            responses: {
            200: {
                description: "Work experience berhasil dihapus",
            },
            404: {
                description: "Data tidak ditemukan",
            },
            500: {
                description: "Server error",
            },
            },
        },
    },
  },

  schemas: {
    // user profile
    CreateUserProfileRequest: {
      type: "object",
      properties: {
        photo: { type: "string", format: "binary" },
        headline: { type: "string" },
        address: { type: "string" },
        location: { type: "string" },
        age: { type: "number" },
        gender: { type: "string" },
        whatsapp: { type: "string" },
        about_me: { type: "string" },
      },
    },

    CreateUserProfileResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
        photo_url: { type: "string", nullable: true },
      },
    },

    UserProfileResponse: {
      type: "object",
      properties: {
        headline: { type: "string" },
        address: { type: "string" },
        location: { type: "string" },
        age: { type: "number", nullable: true },
        gender: { type: "string" },
        whatsapp: { type: "string" },
        about_me: { type: "string" },
        photo: { type: "string", nullable: true },
      },
    },
    // user document
    UpsertUserDocumentRequest: {
      type: "object",
      properties: {
        resume_cv: { type: "string", format: "binary" },
        portofolio_link: { type: "string" },
      },
    },

    UpsertUserDocumentResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
        resume_cv: { type: "string", nullable: true },
        portofolio_link: { type: "string", nullable: true },
      },
    },

    GetUserDocumentResponse: {
      type: "object",
      properties: {
        data: {
          type: "object",
          nullable: true,
          properties: {
            resume_cv: { type: "string", nullable: true },
            portofolio_link: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    // user education
    CreateUserEducationRequest: {
      type: "object",
      required: ["study_level", "institution"],
      properties: {
        study_level: {
          type: "string",
          enum: ["SMA/SMK Sederajat", "SLB", "Kuliah"],
        },
        institution: { type: "string" },
        major: { type: "string", nullable: true },
        graduate: {
          type: "number",
          nullable: true,
          description: "Tahun lulus, null jika belum lulus",
        },
      },
    },

    GetUserEducationResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              study_level: { type: "string" },
              institution: { type: "string" },
              major: { type: "string", nullable: true },
              graduate: { type: "number", nullable: true },
              graduate_status: {
                type: "string",
                enum: ["lulus", "belum_lulus"],
              },
            },
          },
        },
      },
    },
    // user skill
    UserSkillRequest: {
        type: "object",
        required: ["name_skill"],
        properties: {
          name_skill: {
            type: "string",
            example: "JavaScript",
          },
        },
    },

    UserSkillResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name_skill: { type: "string" },
              },
            },
          },
        },
    },
    // work experience
    CreateWorkExperienceRequest: {
        type: "object",
        required: ["company_name", "job_title", "start_date"],
        properties: {
          company_name: {
            type: "string",
            example: "PT Teknologi Indonesia",
          },
          job_title: {
            type: "string",
            example: "Backend Developer",
          },
          start_date: {
            type: "number",
            example: 2022,
            description: "Tahun mulai bekerja",
          },
          end_date: {
            type: "number",
            nullable: true,
            example: 2024,
            description: "Tahun selesai bekerja (null jika masih bekerja)",
          },
          description: {
            type: "string",
            example: "Mengembangkan API dan database",
          },
        },
    },
    UpdateWorkExperienceRequest: {
        type: "object",
        properties: {
          company_name: {
            type: "string",
          },
          job_title: {
            type: "string",
          },
          start_date: {
            type: "number",
            example: 2022,
          },
          end_date: {
            type: "number",
            nullable: true,
            example: 2024,
          },
          description: {
            type: "string",
            nullable: true,
          },
        },
    },
    WorkExperienceListResponse: {
        type: "array",
        items: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            company_name: {
              type: "string",
            },
            job_title: {
              type: "string",
            },
            start_date: {
              type: "number",
            },
            end_date: {
              type: "number",
              nullable: true,
            },
            description: {
              type: "string",
            },
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
};
