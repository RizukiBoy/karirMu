const { ObjectId } = require("mongodb");
const { client } = require("../config/database");

const companyDocuments = client
  .db("karirMu")
  .collection("company_documents");

const REQUIRED_DOCUMENTS = ["SK", "AD_ART", "QAIDAH_PPM", "NPMWP"];

async function isCompanyVerified(companyId) {
   if (!ObjectId.isValid(companyId)) return null;

  const docs = await companyDocuments
    .find({ company_id: new ObjectId(companyId) })
    .toArray();

  const total = docs.length;
  const approved_count = docs.filter(d => d.status === "approved").length;
  const rejected_count = docs.filter(d => d.status === "rejected").length;

  let status = "pending";
  if (total > 0 && approved_count === total) status = "approved";
  else if (rejected_count > 0) status = "rejected";

  return {
    total_documents: total,
    approved_count,
    rejected_count,
    status,
    is_verified: status === "approved",
  };
}

module.exports = {
  isCompanyVerified,
};
