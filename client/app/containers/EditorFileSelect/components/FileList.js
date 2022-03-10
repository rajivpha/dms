import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';
import queryString from 'query-string';
import { createStructuredSelector } from 'reselect';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import Dialog from '../../../components/Dialog/index';
import PageContent from '../../../components/PageContent/PageContent';
import { FaCheck, FaFolderOpen } from 'react-icons/fa';
import { makeSelectToken } from '../../App/selectors';

import * as mapDispatchToProps from '../actions';
import {
  makeSelectAll,
  makeSelectOne,
  makeSelectfolderAddRequest,
  makeSelectLoading,
  makeSelectfolderRenameRequest,
  makeSelectChosen,
  makeSelectChosenFiles,
  makeSelectChosenFolders,
  makeSelectFileRenameLoading,
  makeSelectRenameFile,
  makeSelectShowRename,
  makeSelectQuery,
  makeSelectLoadPwdModal,
} from '../selectors';
import { API_BASE, IMAGE_BASE } from '../../App/constants';
import BreadCrumb from '../../../components/Breadcrumb/Loadable';
import DeleteDialog from '../../../components/DeleteDialog';
import {
  FaPlusCircle,
  FaImages,
  FaImage,
  FaPenSquare,
  FaTrash,
  FaFolder,
  FaSearch,
  FaEdit,
} from 'react-icons/fa';
import { all } from 'redux-saga/effects';
import { useHistory } from 'react-router-dom';

const LinkComponent = ({ children, staticContext, ...props }) => (
  <div {...props}>{children}</div>
);
LinkComponent.propTypes = {
  children: PropTypes.node,
  staticContext: PropTypes.object,
};
const initialFormValues = {
  'name': '',
  'is_root': false,
  'is_password_protected': false,
  'is_global_password': false,
  'set_password': '',
};

const validate = (values) => {

  const errors = {};

  if (!values.name) errors.name = 'Name is Required !';
  // if (values.is_password_protected && (!values.is_global_password )) {

  //   errors.is_global_password = 'Is Global Password is Required !';
  // }
  // else if(values.is_password_protected && !values.set_password){
  //       errors.set_password = 'Password is Required !';

  // }
  return errors;

};
const FileList = ({
  addMediaRequest,
  all: { files, folders, self },
  one,
  queryObj,
  loadFilesRequest,
  loadNewFolderRequest,
  renameFolderRequest,
  folderDeleteRequest,
  fileDeleteRequest,
  setFolderName,
  folderAdded,
  folderRename,
  clearValue,
  loading,
  addChosenFile,
  chosen,
  chosen_files,
  clearChosen,
  addChosenFolder,
  chosen_folders,
  deleteMultipleRequest,
  setRenameFileValue,
  setShowRename,
  rename_file,
  fileRenameLoading,
  showRename,
  renameFileRequest,
  setQueryValue,
  query,
  classes,
  token,
  loadNewFolderSuccess,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [over, setOver] = useState('');
  const [overFile, setOverFile] = useState('');
  const [show, setShow] = useState(false);
  const [rename_id, setRenameId] = useState('');
  const [rename, setRename] = useState('');
  const [deleteId, setdeleteId] = useState('');
  const [deleteFile, setdeleteFile] = useState('');
  const [deleteOpen, setdeleteOpen] = useState(false);
  const [fileOpen, setfileOpen] = useState(false);



  const [folderCheckbox, setfolderCheckbox] = useState(false);
  const [fileCheckbox, setfileCheckbox] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);

const [formData, setFormData] = useState(initialFormValues);
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [password, setPassword] = useState('');
const [selectedFolder, setSelectedFolder]= useState();

const history = useHistory();

console.log(self)
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFolderSave = async () => {

    const errors = Object.values(validate(formData));
    if (errors.length) {
      errors.forEach(error => {
        toast.error(error);
      });
    } else {
      const response = await fetch(`${API_BASE}/files/folder/${self._id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      
      const json = await response.json();
      console.log(json)
      if(json.success) {
        toast.success(json.msg);
        handleClose();
        loadNewFolderSuccess({data:json.data});
      }
      else{
      toast.error(Object.values(json.errors)[0]);
      }
    }
  };
// const atob = (base64) => {
//   return Buffer.from(base64, 'base64').toString('binary');
// };

  const handleFolderLink = each => {
    setSelected('');
    setSelectedFolder(each);
    const searchq = queryString.stringify({ ...queryObj, path: each._id });
    props.push({
      search: searchq,
    });
  // }
  };

const handleOpenPassword = async ()=>{

  let folderPath=selectedFolder?._id;
  if(!folderPath) 
    folderPath=new URLSearchParams(history.location.search).get("path");
  loadFilesRequest({pquery:window.btoa(password), path: folderPath });

  //  const response = await fetch(`${API_BASE}/files/folder/${selectedFolder._id}?pquery=${pwd}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token,
  //       },
  //     });
      
  //     const json = await response.json();
  //     console.log(json)
  //     if(json.success) {
  //       toast.success(json.msg);
  //       setShowPasswordModal(false);
  //       setPassword('')  
        
  //        const searchq = queryString.stringify({ ...queryObj, path: selectedFolder._id });
  //         props.push({
  //           search: searchq,
  //       });
  //   }
  //     else{
  //     toast.error(Object.values(json.errors)[0]);
  //     }
    }
    
  useEffect(() => {

    if (!folderAdded) {
      setOpen(false);
      clearValue();
    }
    clearChosen();
  }, [folderAdded]);

  useEffect(() => {
    if (!folderRename) {
      setShow(false);
    }
    clearChosen();
  }, [folderRename]);

  useEffect(() => {
    setSelectedButton('');
  }, [files]);

  const onSelect = image => {
    if (props.selectFile) {
      props.selectFile(image);
    } else {
      window.opener.CKEDITOR.tools.callFunction(
        queryObj.CKEditorFuncNum,
        `${IMAGE_BASE}${image.path}`,
      );
    }
    window.close();
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const handleDelClose = () => {
    setdeleteOpen(false);
  };

  const handleFileClose = () => {
    setfileOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormValues)
  };

  const handleSave = () => {
    // dsodsd
    loadNewFolderRequest({ key: self._id });
  };

  const handleInput = e => {
    setFolderName({ key: 'name', value: e.target.value });
  };

  const handleFileUpload = (files, id) => {
    addMediaRequest({ file: files, folder_id: id });
  };

  const handleSingleClick = id => {
    if (selected === id) {
      setSelected('');
    } else {
      setSelected(id);
    }
  };

  const handleOutClick = () => {
    if (selected != '') {
      setSelected('');
    }
  };

  const handleMouseOver = id => {
    setOver(id);
  };

  const handleMouseOverFile = id => {
    setOverFile(id);
  };

  const handleRename = (id, name) => {
    setRenameId(id);
    setRename(name);
    setShow(true);
    renameFolderRequest();
  };

  const handleRenameFile = (id, name) => {
    setRenameFileValue({ key: '_id', value: id });
    setRenameFileValue({ key: 'renamed_name', value: name });
    setShowRename(true);
  };

  const closeFileRename = () => {
    setShowRename(false);
  };

  const handleRenameClose = () => {
    setShow(false);
  };

  const handleEdit = e => {
    setRename(e.target.value);
  };

  const handleEditFile = e => {
    setRenameFileValue({ key: 'renamed_name', value: e.target.value });
  };

  const handleSaveRename = () => {
    loadNewFolderRequest({ key: self._id, value: rename_id, name: rename });
  };

  const handleSaveFileRename = () => {
    renameFileRequest();
  };

  const handleEnter = e => {
    if (e.key === 'Enter') {
      loadNewFolderRequest({ key: self._id, value: rename_id, name: rename });
    }
  };

  const handleFileEnter = e => {
    if (e.key === 'Enter') {
      renameFileRequest();
    }
  };

  const handleDeleteFolder = id => {
    setdeleteId(id);
    setdeleteOpen(true);
  };

  const handleDeleteFile = id => {
    setdeleteFile(id);
    setfileOpen(true);
  };

  const handleFolderDel = () => {
    folderDeleteRequest(deleteId);
    setdeleteOpen(false);
  };

  const handleFileDel = () => {
    fileDeleteRequest(deleteFile);
    setfileOpen(false);
  };
  let routeList = [];
  self.path.map(each => {
    routeList = [
      ...routeList,
      {
        path:
          '/editor-file-select?CKEditor=editor1&CKEditorFuncNum=1&langCode=en',
        label: each.name,
        id: each._id,
      },
    ];
    return null;
  });
  routeList = [
    ...routeList,
    {
      path:
        '/editor-file-select?CKEditor=editor1&CKEditorFuncNum=1&langCode=en',
      label: self.name,
      id: self._id,
    },
  ];

  const onClick = linkObj => {

    handleFolderLink(linkObj.id);
  };

  const handleQueryChange = name => event => {
    event.persist();
    const { value } = event.target;
    setQueryValue({ key: name, value });
  };

  const handleQueryEnter = event => {
    if (event.key === 'Enter') {
      loadFilesRequest(queryObj);
    }
  };

  const handleSearch = () => {
    loadFilesRequest(queryObj);
  };

  const handleSelectMultipleButton = () => {
    if (selectedButton === 'Multiple') {
      setfileCheckbox(!fileCheckbox);
    } else {
      setfileCheckbox(true);
    }
    setfolderCheckbox(false);
    setSelectedButton('Multiple');
    clearChosen();
  };

  const handleRenameButton = () => {
    if (selectedButton === 'Rename') {
      setfileCheckbox(!fileCheckbox);

      setfolderCheckbox(!folderCheckbox);
    } else {
      setfolderCheckbox(true);
      setfileCheckbox(true);
    }
    // setfileCheckbox(false);
    setSelectedButton('Rename');
    clearChosen();
  };

  const handleDeleteButton = () => {
    if (selectedButton === 'Delete') {
      setfileCheckbox(!fileCheckbox);
      setfolderCheckbox(!folderCheckbox);
    } else {
      setfileCheckbox(true);
      setfolderCheckbox(true);
    }

    setSelectedButton('Delete');
    clearChosen();
  };

  const onChooseFile = image => {
    addChosenFile(image);
  };

  const onChooseFolder = folder => {
    addChosenFolder(folder);
  };

  const handleUploadMultiple = () => {
    if (props.uploadMultiple) {
      props.uploadMultiple(chosen_files);
    } else {
      window.alert(
        'Define function for multiple upload where this component is called. Pass it as uploadMultiple in props',
      );
    }
  };

  const confirmDelete = () => {
    deleteMultipleRequest();
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    setPassword("");
  },[props.showPasswordModal])

  const handlePasswordDialogClose=()=>{
    props.push({
      search: undefined,
    });
    props.loadPwdModal(false);
  };

  return (
    <PageContent loading={loading}>
      <Dialog
        open={open}
        onClose={handleClose}
        title={`New Folder`}
        body={
       <>
            <div className='w-5/6 sm:w-80'>
              <input
                autoFocus
                name='name'
                type='text'
                className='inputbox'
                onChange={handleFormChange}
                value={formData.name}
              />
            </div>
            <div className='flex items-center'>
              <input
                name='is_password_protected'
                type='checkbox'
                onChange={() => setFormData({ ...formData, is_password_protected: !formData.is_password_protected })}
                value={formData.is_password_protected}
              />
              <label>Enable Password</label>
            </div>
            {formData.is_password_protected && !formData.set_password && <div className='flex items-center'>
              <input
                id='name'
                type='checkbox'
                onChange={() => setFormData({ ...formData, is_global_password: !formData.is_global_password })}
                value={formData.is_global_password}
              />
              <label>Use Global Password</label>
            </div>}
            {formData.is_password_protected && !formData.is_global_password && <div className='w-5/6 sm:w-80'>
              <input
                name='set_password'
                type='password'
                className='inputbox'
                onChange={handleFormChange}
                value={formData.set_password}
              />
            </div>}
          </> 
        }
        actions={
          <>
            <button
              onClick={handleClose}
              className="block btn margin-none text-white bg-red-500 border border-red-600 hover:bg-red-600 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={handleFolderSave}
              className="block btn margin-none text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
              disabled={folderAdded}
            >
              Save
            </button>
          </>
        }
      />
  <Dialog
        open={props.showPasswordModal}
        onClose={handlePasswordDialogClose}
        title={`Password`}
        body={
       <>
            <div className='w-5/6 sm:w-80'>
              <input
                autoFocus
                name='name'
                type='password'
                className='inputbox'
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
              />
            </div>
          </> 
        }
        actions={
          <>
            <button
              onClick={handlePasswordDialogClose}
              className="block btn margin-none text-white bg-red-500 border border-red-600 hover:bg-red-600 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={handleOpenPassword}
              className="block btn margin-none text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
              disabled={!password}
            >
              OK
            </button>
          </>
        }
      />
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title={`Cant Upload here`}
        body={`Create sub folder first and then ony you can upload image`}
        actions={
          <>
            <button
              onClick={handleDialogClose}
              className="block btn margin-none text-white bg-red-500 border border-red-600 hover:bg-red-600 mr-1"
            >
              Close
            </button>
          </>
        }
      />
      <div className="flex items-center justify-between my-3">
        <div className="flex">
          <div className="flex relative">
            <input
              type="text"
              id="contents-name"
              placeholder="Search files by name"
              className="m-auto inputbox pr-6"
              value={query.search}
              onChange={handleQueryChange('search')}
              style={{ minWidth: '300px' }}
              onKeyPress={handleQueryEnter}
            />
            <span
              className="inline-flex border-l absolute right-0 top-0 h-8 px-2 mt-1 items-center cursor-pointer text-blue-500"
              onClick={handleSearch}
            >
              <FaSearch />
            </span>
          </div>
        </div>

        <div className="flex items-center media_btn -mt-4">
          {/* {selectedButton === 'Multiple' && chosen_files.length > 0 ? (
            <button
              onClick={handleUploadMultiple}
              className="blink items-center text-black flex btn bg-pink-100 border border-pink-200 hover:bg-pink-500 hover:text-white mr-2 hover:border-pink-500"
            >
              <FaImages className="text-base mr-2" />
              <span>Upload Multiple</span>
            </button>
          ) : (
            <button
              onClick={handleSelectMultipleButton}
              className="items-center text-black flex btn bg-pink-100 border border-pink-200 hover:bg-pink-500 hover:text-white mr-2 hover:border-pink-500"
            >
              <FaImages className="text-base mr-2" />
              <span>Select Multiple</span>
            </button>
          )} */}

          {self.name === 'root' ? (
            <div
              onClick={() => handleDialogOpen()}
              className="items-center flex btn text-green-500 bg-green-100 border border-green-200 hover:bg-green-500 hover:border-green-500 mr-2 hover:text-white cursor-pointer"
            >
              <FaImage className="text-base mr-2" />
              <span>Choose File</span>
            </div>
          ) : (
            <Dropzone onDrop={file => handleFileUpload(file, self._id)}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className="items-center flex btn text-green-500 bg-green-100 border border-green-200 hover:bg-green-500 hover:border-green-500 mr-2 hover:text-white cursor-pointer"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <FaImage className="text-base mr-2" />
                  <span>Choose File</span>
                </div>
              )}
            </Dropzone>
          )}
          <button
            onClick={handleAdd}
            className="items-center flex btn text-blue-500 bg-blue-100 border border-blue-200 hover:bg-blue-500 hover:border-blue-500 mr-2 hover:text-white"
          >
            <FaPlusCircle className="text-base mr-2" />
            <span>New Folder</span>
          </button>
          <button
            onClick={handleRenameButton}
            className="items-center flex text-orange-500 bg-orange-100 border border-orange-200 hover:border-orange-500 hover:bg-orange-500 btn mr-2 hover:text-white"
          >
            <FaPenSquare className="text-base mr-2" />
            <span>Rename</span>
          </button>
          {selectedButton === 'Delete' &&
            (chosen_files.length > 0 || chosen_folders.length > 0) ? (
            <button
              onClick={confirmDelete}
              className="blink items-center flex btn bg-red-100 border border-red-200 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white"
            >
              <FaTrash className="text-base mr-2" />
              <span>Confirm Delete</span>
            </button>
          ) : (
            <button
              onClick={handleDeleteButton}
              className="items-center flex btn bg-red-100 border border-red-200 text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white"
            >
              <FaTrash className="text-base mr-2" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
      <div className="my-auto">
        <BreadCrumb
          linkcomponent={LinkComponent}
          routeList={routeList}
          onClick={onClick}
        />
      </div>
      <Dialog
        open={show}
        onClose={handleRenameClose}
        title={`Rename Folder`}
        body={
          <div className="w-5/6 sm:w-80">
            <input
              autoFocus
              id="rename"
              type="text"
              className="inputbox"
              onChange={handleEdit}
              value={rename}
              onKeyDown={handleEnter}
            />
          </div>
        }
        actions={
          <>
            <button
              onClick={handleRenameClose}
              className="block btn margin-none text-white bg-red-500 border border-red-600 hover:bg-red-600 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRename}
              className="block btn margin-none text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
            >
              Save
            </button>
          </>
        }
      />

      <Dialog
        open={showRename}
        onClose={closeFileRename}
        title={`Rename File`}
        body={
          <div className="w-5/6 sm:w-80">
            <input
              autoFocus
              id="rename"
              type="text"
              className="inputbox"
              onChange={handleEditFile}
              value={rename_file.renamed_name}
              onKeyDown={handleFileEnter}
            />
          </div>
        }
        actions={
          <>
            <button
              onClick={closeFileRename}
              className="block btn margin-none text-white bg-red-500 border border-red-600 hover:bg-red-600 mr-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveFileRename}
              className="block btn margin-none text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
            >
              Save
            </button>
          </>
        }
      />

      {/* end file rename */}
      <DeleteDialog
        open={deleteOpen}
        doClose={handleDelClose}
        doDelete={handleFolderDel}
      />
      <DeleteDialog
        open={fileOpen}
        doClose={handleFileClose}
        doDelete={handleFileDel}
      />
      <div className="flex flex-wrap bg-white mt-1">
        {folders.data.map(each => (
          <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5" key={each._id}>
            <div
              className="h-48 mediaCont p-4 text-center border -ml-px -mb-px relative"
              onMouseOver={() => handleMouseOver(each._id)}
              onMouseLeave={() => handleMouseOver('')}
            >
              <div className={`${folderCheckbox ? '' : 'mediaCheck'} absolute`}>
                {selectedButton === 'Rename' && (
                  <button
                    className="flex w-8 h-8 bg-white shadow rounded-full"
                    onClick={() => handleRename(each._id, each.name)}
                  >
                    <FaEdit
                      className="text-sm inline-block text-black m-auto hover:text-primary"
                      title="Edit"
                    />
                  </button>
                )}
                {selectedButton === 'Delete' && (
                  <>
                    <div className="checkbox">
                      <input
                        id={`${each._id}-secondary`}
                        type="checkbox"
                        onClick={() => addChosenFolder(each)}
                      />
                      <label htmlFor={`${each._id}-secondary`}>
                        <span className="box">
                          <FaCheck className="check-icon" />
                        </span>
                      </label>
                    </div>
                  </>
                )}
              </div>
              <div
                // data-tooltip={each.name}
                className={`${selected === each._id ? 'folder_media' : ''
                  } flex flex-col w-full h-36 text-center cursor-pointer overflow-hidden mt-10`}
                onClick={() => handleSingleClick(each._id)}
                onDoubleClick={() => handleFolderLink(each)}
                onKeyDown={() => handleFolderLink(each._id)}
                role="presentation"
              >
                <div className="flex justify-center">
                  <FaFolder
                    className="text-yellow-500"
                    style={{ fontSize: '6rem' }}
                  />
                </div>
                <div className="block text-sm truncate py-1">{each.name}</div>
              </div>
            </div>
          </div>
        ))}
        {files.data.map((each, index) => (
          <div className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
            <div
              className="h-48 mediaCont p-4 text-center border -ml-px -mb-px relative"
              key={each._id}
              onMouseOver={() => handleMouseOverFile(each._id)}
              onMouseLeave={() => handleMouseOverFile('')}
            >
              {selectedButton === 'Rename' && (
                <div className={`${fileCheckbox ? '' : 'mediaCheck'} absolute`}>
                  <button
                    className="flex w-8 h-8 bg-white shadow rounded-full"
                    onClick={() =>
                      handleRenameFile(each._id, each.renamed_name)
                    }
                  >
                    <FaEdit
                      className="text-sm inline-block text-black m-auto hover:text-primary"
                      title="Edit"
                    />
                  </button>
                </div>
              )}
              <div className={`${fileCheckbox ? '' : 'mediaCheck'} absolute`}>
                {selectedButton === 'Multiple' && (
                  <div className="checkbox">
                    <input
                      id={`${index}-multipleselect`}
                      type="checkbox"
                      onClick={() => onChooseFile(each)}
                    />
                    <label htmlFor={`${index}-multipleselect`}>
                      <span className="box">
                        <FaCheck className="check-icon" />
                      </span>
                    </label>
                  </div>
                )}
                {selectedButton === 'Delete' && (
                  <div className="checkbox">
                    <input
                      id={`${index}-dltmultiple`}
                      type="checkbox"
                      onClick={() => addChosenFile(each)}
                    />
                    <label htmlFor={`${index}-dltmultiple`}>
                      <span className="box">
                        <FaCheck className="check-icon" />
                      </span>
                    </label>
                  </div>
                )}
              </div>
              <div
                // data-tooltip={each.filename}
                className={`${selected === each._id ? 'folder_media' : ''
                  } flex flex-col w-full h-36 text-center cursor-pointer overflow-hidden mt-10`}
              >
                <div className="flex">
                  <img
                    className="w-full h-24 object-contain"
                    src={`${IMAGE_BASE}${each.path}`}
                    alt={each.filename}
                    onClick={() => handleSingleClick(each._id)}
                    onDoubleClick={() => onSelect(each)}
                    onKeyDown={() => handleFolderLink(each._id)}
                    role="presentation"
                  />
                </div>
                <div className="truncate text-sm py-1">{each.renamed_name}</div>
              </div>
            </div>
          </div>
        ))}
        {folders.data.length < 1 && files.data.length < 1 && (
          <div className="h-64 flex items-center justify-center flex-col w-full">
            <FaFolderOpen style={{ fontSize: '6rem' }} className="mb-5 opacity-10 mx-auto" />
            <p className="text-gray-400">This folder is empty.</p>
          </div>
        )}
      </div>
    </PageContent>
  );
};

FileList.propTypes = {
  addMediaRequest: PropTypes.func.isRequired,
  all: PropTypes.object.isRequired,
  one: PropTypes.object.isRequired,
  loadFilesRequest: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  queryObj: PropTypes.object,
  loadNewFolderRequest: PropTypes.func.isRequired,
  folderRename: PropTypes.bool.isRequired,
  setFolderName: PropTypes.func.isRequired,
  folderAdded: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  all: makeSelectAll(),
  one: makeSelectOne(),
  folderAdded: makeSelectfolderAddRequest(),
  folderRename: makeSelectfolderRenameRequest(),
  loading: makeSelectLoading(),
  chosen: makeSelectChosen(),
  chosen_files: makeSelectChosenFiles(),
  chosen_folders: makeSelectChosenFolders(),
  fileRenameLoading: makeSelectFileRenameLoading(),
  rename_file: makeSelectRenameFile(),
  showRename: makeSelectShowRename(),
  query: makeSelectQuery(),
  token: makeSelectToken(),
  showPasswordModal:makeSelectLoadPwdModal()
});

const withConnect = connect(mapStateToProps, { ...mapDispatchToProps, push });

export default compose(withConnect)(FileList);
