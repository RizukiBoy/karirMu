const DOCUMENT_STATUS_ENUM = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

const DOCUMENT_STATUS_VALUES = Object.values(DOCUMENT_STATUS_ENUM);

module.exports = {
  DOCUMENT_STATUS_ENUM,
  DOCUMENT_STATUS_VALUES,
};
