const JOB_TYPE_ENUM = {
  FULL_TIME: "full_time",      // Penuh waktu
  PART_TIME: "part_time",      // Paruh waktu
  CONTRACT: "contract",        // Kontrak
  INTERNSHIP: "internship",    // Magang
  FREELANCE: "freelance",      // Freelance
};

const JOB_TYPE_VALUES = Object.values(JOB_TYPE_ENUM);

module.exports = {
  JOB_TYPE_ENUM,
  JOB_TYPE_VALUES,
};
