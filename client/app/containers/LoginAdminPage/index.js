/**
 *
 * LoginAdminPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectLoading,
  makeSelectTwoFactor,
  makeSelectErrors,
  makeSelectHelperObj,
  makeSelectEmailError,
  makeSelectPasswordError,
} from './selectors';
import * as mapDispatchToProps from './actions';

import UsernameInput from './components/UsernameInput';
import PasswordInput from './components/PasswordInput';
import logo from '../../assets/img/logo.svg';
import Modal from '../../components/Modal';
import '../../assets/styles/loading.css';

const LoginAdminPage = props => {
  const {
    classes,
    loginRequest,
    loading,
    errors,
    emailError,
    passwordError,
    twoFactor,
    helperObj: { showEmailTwoFactor, showGoogleTwoFactor },
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

  React.useEffect(() => {
    handleClose();
    props.clearStore({ name: 'errors' });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    loginRequest();
  };

  const handleChange = (e, name) => {
    props.setValue({
      name: 'twoFactor',
      key: 'multi_fa',
      value: {
        ...twoFactor.multi_fa,
        [name]: {
          ...twoFactor.multi_fa[name],
          [e.target.name]: e.target.value,
        },
      },
    });
  };

  const handleSubmitCode = e => {
    e.preventDefault();
    props.addTwoFactorRequest();
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Modal
        open={showEmailTwoFactor || showGoogleTwoFactor}
        handleClose={handleClose}
        handleUpdate={handleSubmitCode}
        buttonLabel2="Send"
        width="sm"
      >
        {showEmailTwoFactor && (
          <div className="border p-2 m-2">
            <label>Enter the code</label>
            <label className="text-xs">Check inbox for the code</label>
            <input
              id="code"
              name="code"
              value={twoFactor && twoFactor.email && twoFactor.email.code}
              onChange={e => handleChange(e, 'email')}
              onKeyPress={e => e.key === 'Enter' && handleSubmitCode(e)}
            />
            <div className="error">{errors.code}</div>
          </div>
        )}

        {showGoogleTwoFactor && (
          <div className="border p-2 m-2">
            <label>Enter the code</label>
            <label className="text-xs">
              Copy code from Google Authentication App
            </label>
            <input
              id="code"
              name="code"
              value={
                twoFactor &&
                twoFactor.google_authenticate &&
                twoFactor.google_authenticate.code
              }
              onChange={e => handleChange(e, 'google_authenticate')}
              onKeyPress={e => e.key === 'Enter' && handleSubmitCode(e)}
            />
            <div className="error">{errors.code}</div>
          </div>
        )}
      </Modal>
      <div className="flex h-screen">
        <div className="hidden md:flex md:w-3/5 bg-primary items-center">
          <div className="px-5 text-white lg:px-32">
            <h1 className="font-bold text-4xl">Engine</h1>
            <p>A Powerful Mern Engine</p>
            <ul className="mt-10">
              <li>Quick Scaffolding</li>
              <li>Instant feedback</li>
              <li>Predictable state management</li>
              <li>Next generation javascript</li>
              <li>Next generation CSS</li>
              <li>Industry-stand routing</li>
              <li>Industry-standard internationalization support</li>
              <li>Offline first</li>
              <li>Static code analysis</li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-2/5 relative block">
          <div
            className="absolute top-1/2 px-10 md:px-12 lg:px-16 xl:px-24 w-full"
            style={{ transform: 'translateY(-50%)' }}
          >
            <img src={logo} alt="Engine" className="w-2/3" />
            <form className="mt-4" onSubmit={handleSubmit}>
              <UsernameInput />
              <PasswordInput />
              <button
                className="btn mt-4 w-full text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
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
          </div>
        </div>
      </div>
    </>
  );
};

LoginAdminPage.propTypes = {
  loginRequest: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  errors: makeSelectErrors(),
  loading: makeSelectLoading(),
  emailError: makeSelectEmailError(),
  passwordError: makeSelectPasswordError(),
  twoFactor: makeSelectTwoFactor(),
  helperObj: makeSelectHelperObj(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'loginAdminPage', reducer });
const withSaga = injectSaga({ key: 'loginAdminPage', saga });

export default compose(withReducer, withSaga, withConnect)(LoginAdminPage);
