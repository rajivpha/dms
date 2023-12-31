import PropTypes from 'prop-types';
import React from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import '../../assets/styles/loading.css';
import { FB_APP_FIELDS, FB_APP_ID, GOOGLE_CLIENT_ID } from '../App/constants';
import * as mapDispatchToProps from './actions';
import EmailInput from './components/EmailInput';
import NameInput from './components/NameInput';
import PasswordInput from './components/PasswordInput';
import reducer from './reducer';
import saga from './saga';
import { makeSelectLoading } from './selectors';



const SignupUserPage = ({
  signupRequest,
  signupWithFbRequest,
  signupWithGoogleRequest,
  loading,
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    signupRequest();
  };

  return (
    <>
      <Helmet>
        <title>
          Sign Up
          </title>
      </Helmet>
      <div className="container mx-auto mb-10">
        <div className="mx-auto max-w-md p-5 md:p-16">
          <h1 className="font-bold text-2xl">SIGN UP</h1>
          <form className="mt-4" onSubmit={handleSubmit}>
            <NameInput />
            <EmailInput />
            <PasswordInput />
            <button
              className="btn mt-4 w-full bg-blue-500 border border-blue-600 hover:bg-blue-600"
              type="submit"
            >
              {loading ? (
                <div className="btn_loading">
                  <div />
                  <div />
                  <div />
                  <div />
                  <span className="ml-2">Sing Up</span>
                </div>
              ) : (
                  'Sign Up'
                )}
            </button>
            <Link
              className="inline-block align-baseline text-xs text-blue-700 hover:text-blue-700-darker"
              to="/login-user"
            >
              Already Have Account? Login
          </Link>
          </form>
        </div>
      </div>
    </>
  );
};

SignupUserPage.propTypes = {
  signupRequest: PropTypes.func.isRequired,
  signupWithFbRequest: PropTypes.func.isRequired,
  signupWithGoogleRequest: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'signupUserPage', reducer });
const withSaga = injectSaga({ key: 'signupUserPage', saga });

// const styles = {
//   googbtn: {
//     boxShadow: 'none!important',
//     border: '1px solid gainsboro!important',
//     borderLeft: 'none!important',
//   },
// };

export default compose(withReducer, withSaga, withConnect)(SignupUserPage);
