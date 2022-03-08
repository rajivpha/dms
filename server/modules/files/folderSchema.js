const mongoose = require('mongoose');
const schema = mongoose.Schema;

const folderSchema = new schema({
  name: { type: String, required: true, default: 'New folder' },
  is_root: { type: Boolean, required: true, default: false },
  path: [{ type: schema.Types.ObjectId, ref: 'folder' }],
  parent_folder: { type: schema.Types.ObjectId, ref: 'folder' },
  is_password_protected: { type: Boolean, required: true, default: false },
  is_global_password: { type: Boolean, required: true, default: false },
  password: { type: String, required: false },
  is_deleted: { type: Boolean, required: true, default: false },
  deleted_at: { type: Date, required: false },
  deleted_by: { type: schema.Types.ObjectId, ref: 'user' },
  added_at: { type: Date, default: Date.now },
  added_by: { type: schema.Types.ObjectId, ref: 'user' },
});

module.exports = Folder = mongoose.model('folder', folderSchema);
