const db = require("../config/db");

/**
 * Generate Document Code
 * Example:
 * TD0001
 * TD0002
 */
const generateDocumentCode = async (id) => {
  return `TD${String(id).padStart(4, "0")}`;
};

/**
 * Create Document
 */
const createDocument = async (documentData) => {
  const {
    category_id,
    document_name,
    document_number,
    issuing_authority,
    issue_date,
    expiry_date,
    is_permanent,
    description,
    original_file_name,
    stored_file_name,
    file_path,
    mime_type,
    file_extension,
    file_size,
    created_by,
  } = documentData;

  const sql = `
    INSERT INTO trust_documents
    (
      category_id,
      document_name,
      document_number,
      issuing_authority,
      issue_date,
      expiry_date,
      is_permanent,
      description,
      original_file_name,
      stored_file_name,
      file_path,
      mime_type,
      file_extension,
      file_size,
      created_by
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

 const values = [
  category_id,

  document_name,

  document_number || null,

  issuing_authority || null,

  issue_date || null,

  expiry_date || null,

  Number(is_permanent) ? 1 : 0,

  description || null,

  original_file_name,
  stored_file_name,
  file_path,
  mime_type,
  file_extension,
  file_size,
  created_by,
];

  const [result] = await db.query(sql, values);

  const documentCode = await generateDocumentCode(result.insertId);

  await db.query(
    `
      UPDATE trust_documents
      SET document_code = ?
      WHERE id = ?
    `,
    [documentCode, result.insertId]
  );

  return result.insertId;
};

/**
 * Get All Documents
 */
const getAllDocuments = async () => {
  const sql = `
    SELECT
      td.*,
      dc.category_name
    FROM trust_documents td
    INNER JOIN document_categories dc
      ON td.category_id = dc.id
    ORDER BY td.created_at DESC
  `;

  const [rows] = await db.query(sql);

  return rows;
};

/**
 * Get Document By ID
 */
const getDocumentById = async (id) => {
  const sql = `
    SELECT
      td.*,
      dc.category_name
    FROM trust_documents td
    INNER JOIN document_categories dc
      ON td.category_id = dc.id
    WHERE td.id = ?
  `;

  const [rows] = await db.query(sql, [id]);

  return rows[0];
};

/**
 * Update Document Metadata
 */
const updateDocument = async (id, data) => {
  const sql = `
    UPDATE trust_documents
    SET
      category_id = ?,
      document_name = ?,
      document_number = ?,
      issuing_authority = ?,
      issue_date = ?,
      expiry_date = ?,
      is_permanent = ?,
      description = ?,
      updated_by = ?
    WHERE id = ?
  `;

  const values = [
    data.category_id,

    data.document_name,

    data.document_number || null,

    data.issuing_authority || null,

    data.issue_date || null,

    data.expiry_date || null,

    Number(data.is_permanent) ? 1 : 0,

    data.description || null,

    data.updated_by,

    id,
  ];

  const [result] = await db.query(sql, values);

  return result;
};

/**
 * Replace Uploaded File
 */
const replaceDocumentFile = async (id, fileData, updated_by) => {
  const sql = `
    UPDATE trust_documents
    SET
      original_file_name = ?,
      stored_file_name = ?,
      file_path = ?,
      mime_type = ?,
      file_extension = ?,
      file_size = ?,
      version = version + 1,
      updated_by = ?
    WHERE id = ?
  `;

  const values = [
    fileData.original_file_name,
    fileData.stored_file_name,
    fileData.file_path,
    fileData.mime_type,
    fileData.file_extension,
    fileData.file_size,
    updated_by,
    id,
  ];

  const [result] = await db.query(sql, values);

  return result;
};

/**
 * Archive Document
 */
const archiveDocument = async (id, updated_by) => {
  const sql = `
    UPDATE trust_documents
    SET
      status = 'ARCHIVED',
      updated_by = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [updated_by, id]);

  return result;
};


const updateStatus = async (id, status, updatedBy) => {
  const sql = `
    UPDATE trust_documents
    SET
      status = ?,
      updated_by = ?,
      updated_at = NOW()
    WHERE id = ?
  `;

  await db.query(sql, [status, updatedBy, id]);
};
/**
 * Active Categories
 */
const getCategories = async () => {
  const [rows] = await db.query(`
    SELECT *
    FROM document_categories
    WHERE is_active = 1
    ORDER BY display_order ASC
  `);

  return rows;
};




/**
 * Dashboard Statistics
 */
const getStatistics = async () => {
  const [[stats]] = await db.query(`
    SELECT

      COUNT(*) total_documents,

      SUM(status='ACTIVE') active_documents,

      SUM(status='ARCHIVED') archived_documents,

      SUM(
        expiry_date IS NOT NULL
        AND expiry_date <= DATE_ADD(CURDATE(),INTERVAL 30 DAY)
      ) expiring_documents,

      ROUND(
        SUM(file_size)/(1024*1024),
        2
      ) storage_mb

    FROM trust_documents
  `);

  return stats;
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  replaceDocumentFile,
  archiveDocument,
  getCategories,
  getStatistics,
  updateStatus,
};