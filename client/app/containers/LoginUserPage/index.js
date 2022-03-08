/**
 *
 * LoginUserPage
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { createStructuredSelector } from 'reselect';

import { Link } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import UsernameInput from './components/UsernameInput';
import PasswordInput from './components/PasswordInput';
import { FB_APP_ID, FB_APP_FIELDS, GOOGLE_CLIENT_ID } from '../App/constants';
import reducer from './reducer';
import saga from './saga';
import * as mapDispatchToProps from './actions';
import {
  makeSelectLoading,
  makeSelectErrors,
  makeSelectEmailError,
  makeSelectPasswordError,
  makeSelectHelperObj,
  makeSelectLoadingObj,
  makeSelectTwoFactor,
} from './selectors';
import Modal from '../../components/Modal';
import '../../assets/styles/loading.css';

const LoginUserPage = props => {
  const {
    classes,
    loginRequest,
    loading,
    errors,
    emailErr,
    passwordErr,
    loadingObj: { loggingUser, sendingCode },
    helperObj: { showEmailTwoFactor, showGoogleTwoFactor },
    setOpen,
  } = props;

  const handleClose = () => {
    props.setValue({
      name: 'helperObj',
      key: 'showEmailTwoFactor',
      value: false,
    });
    props.setValue({
      name: 'helperObj',
      key: 'showGoogleTwoFactor',
      value: false,
    });
  };

  useEffect(() => {
    handleClose();
    props.clearStore({ name: 'errors' });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    loginRequest();
  };

  const handleSubmitCode = e => {
    e.preventDefault();
    props.addTwoFactorRequest();
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>
          Login
          </title>
      </Helmet>
      <Modal
        open={showEmailTwoFactor || showGoogleTwoFactor}
        handleClose={handleClose}
        handleUpdate={handleSubmitCode}
        buttonLabel2={
          sendingCode ? (
            <>
              <div className="flex text-center justify-center">
                <div className="loading_wrapper">
                  <span className="font-bold mr-2 my-auto text-white">
                    Sending
                  </span>
                  <div className="dot-elastic" />{' '}
                </div>
              </div>
            </>
          ) : (
              'Continue'
            )
        }
        width="sm"
      >
      

    
      </Modal>
      <div className="container mx-auto mb-10">
        <div className="mx-auto max-w-md p-5 md:p-16">
          <h1 className="font-bold text-2xl">LOGIN</h1>{' '}
          <form className="mt-4" onSubmit={handleSubmit}>
            <UsernameInput />
            <PasswordInput />
            <button
              className="btn text-white mt-4 w-full bg-blue-500 border border-blue-600 hover:bg-blue-600"
              type="submit"
            >
              {loading ? (
                <div className="btn_loading">
                  <span className="ml-2">Login</span>
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              ) : (
                  'Login'
                )}
            </button>
          </form>
          <Link
            className="inline-block align-baseline text-xs text-blue-700 hover:text-blue-700-darker"
            to="/signup-user"
          >
            Don't Have Account? Register
          </Link>
      
        </div>
      </div>
    </>
  );
};

LoginUserPage.propTypes = {
  loginRequest: PropTypes.func.isRequired,
  loginWithFbRequest: PropTypes.func.isRequired,
  loginWithGoogleRequest: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
  emailErr: makeSelectEmailError(),
  passwordErr: makeSelectPasswordError(),
  twoFactor: makeSelectTwoFactor(),
  helperObj: makeSelectHelperObj(),
  loadingObj: makeSelectLoadingObj(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'loginUserPage', reducer });
const withSaga = injectSaga({ key: 'loginUserPage', saga });

export default compose(withReducer, withSaga, withConnect)(LoginUserPage);
