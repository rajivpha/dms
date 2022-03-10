const httpStatus = require('http-status');
const isEmpty = require('../../validation/isEmpty');
const otherHelper = require('../../helper/others.helper');
const sanitizeHelper = require('../../helper/sanitize.helper');
const validateHelper = require('../../helper/validate.helper');
const folderSch = require('./folderSchema');
const bcrypt = require('bcryptjs');

const validations = {};

validations.sanitize = (req, res, next) => {
      sanitizeHelper.sanitize(req, [
            {
                  field: 'name',
                  sanitize: {
                        trim: true,
                  },
            }
      ]);
      next();
};
validations.verifyPassword = async (req, res, next) => {
      try {
            const id = req?.body?._id || req?.params?.id;
            const password =  req?.query?.pquery? Buffer.from(req.query.pquery, 'base64').toString('binary'): null;


            let errors ={}
              if (id == 'undefined' || id === 'root') {
            return next()  
            }

            const folderdetail = await folderSch.findOne({ _id: id });
            if (!folderdetail) {
                  return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, null, 'Folder Not Found', null);
            }
            if (folderdetail?.is_password_protected) {
                  // if(folderdetail.last_password_approved < Date.now()) {
                  if (!password) {
                        errors.password = 'Password required';
                        errors.password_required= true;
                        return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
                  }
                  const isMatch = await bcrypt.compare(password, folderdetail.password);
                  if (!isMatch) {
                        errors.password = 'Password incorrect';
                        return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
                  }
                  // await folderSch.findByIdAndUpdate({_id:id}, {$set:{ last_password_approved: Date.now()+ 900000  }})
            // }

            }
            next();
      }
      catch (err) {
            next(err)
      }

};
validations.validate = async (req, res, next) => {
      const data = req.body;
      const validateArray = [
            {
                  field: 'name',
                  validate: [
                        {
                              condition: 'IsEmpty',
                              msg: 'this field is required',
                        },
                        {
                              condition: 'IsProperKey',
                              msg: 'not Valid Input',
                        },
                  ],
            }
      ]

      let errors = validateHelper.validation(data, validateArray);

      let name_filter = { is_deleted: false, name: data.name }
      if (data._id) {
            const folderdetail = await folderSch.findOne({ _id: data._id });
            if (!folderdetail) {
                  return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, null, 'Folder Not Found', null);
            }
            if (folderdetail.is_password_protected) {

               if (!req.body.password) {
                        errors.password = 'Password required';
                        return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
                  }
                  const isMatch = await bcrypt.compare(req.body.password, folderdetail.password);
                  if (!isMatch) {
                        errors.password = 'Password incorrect';
                        return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
                  }
            }

            if (already_name && already_name._id) {
                  errors = { ...errors, name: 'folder_name already exist' }
            }
            name_filter = { ...name_filter, _id: { $ne: data._id } }

      }
      const already_name = await folderSch.findOne(name_filter);
      if (already_name && already_name._id) {
            errors = { ...errors, name: 'folder_name already exist' }
      }
      if (!isEmpty(errors)) {
            return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, 'Input Errors', null);
      } else {
            next();
      }
};

validations.validateRootFolder = async (req, res, next) => {
      const folderId = req.params.folder_id;
      const temp = await folderSch.findById({ _id: folderId })
      let errors ={}
      if (temp && temp.is_root) {
            errors = { invalid_upload: 'You cannot upload files in root folder. Please create sub folder and upload images.' }
      }
      if (!isEmpty(errors)) {
            return otherHelper.sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, 'Invalid Actions', null);
      } else {
            next();
      }
};
module.exports = validations;
