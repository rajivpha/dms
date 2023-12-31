import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FaArrowLeft, FaCheck, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Loading from '../../../../components/Loading';
import PageContent from '../../../../components/PageContent/PageContent';
import PageHeader from '../../../../components/PageHeader/PageHeader';
import * as mapDispatchToProps from '../actions';
import reducer from '../reducer';
import saga from '../saga';
import {
  makeSelectErrors,
  makeSelectLoading,
  makeSelectOne,
  makeSelectRoles,
} from '../selectors';

class AddEdit extends React.PureComponent {
  static propTypes = {
    loadOneRequest: PropTypes.func.isRequired,
    addEditRequest: PropTypes.func.isRequired,
    setOneValue: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    one: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  };

  state = {
    isSecure: true,
    tab: 'basic',
  };

  componentDidMount() {
    this.props.clearErrors();
    if (this.props.match.params && this.props.match.params.id) {
      this.props.loadOneRequest(this.props.match.params.id);
    }
    this.props.loadAllRolesRequest();
  }

  handleChange = name => event => {
    event.persist();
    const tempUser = { ...this.props.one.users };
    tempUser[name] = event.target.value;
    this.props.setOneValue({ key: 'users', value: tempUser });
  };

  handleChecked = name => event => {
    event.persist();
    const tempUser = { ...this.props.one.users };
    tempUser[name] = event.target.checked;
    this.props.setOneValue({ key: 'users', value: tempUser });
  };

  handleRolesChecked = roleid => {
    const tempUser = { ...this.props.one.users };
    if (tempUser.roles.includes(roleid)) {
      const index = tempUser.roles.indexOf(roleid);
      tempUser.roles = [
        ...tempUser.roles.slice(0, index),
        ...tempUser.roles.slice(index + 1),
      ];
    } else {
      tempUser.roles = [...tempUser.roles, roleid];
    }
    this.props.setOneValue({ key: 'users', value: tempUser });
  };

  handleTogglePassword = () => {
    this.setState({ isSecure: !this.state.isSecure });
  };

  handleSave = () => {
    this.props.addEditRequest(this.props.history.goBack);
  };

  handleUpdate = () => {
    this.props.updatePasswordRequest();
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  handleTab = tabVal => {
    this.setState({ tab: tabVal });
  };

  render() {
    const {
      classes,
      match: {
        params: { id },
      },
      one: { users, rolesNormalized, roles },
      roless,
      loading,
      errors,
    } = this.props;
    return loading && loading == true ? (
      <Loading />
    ) : (
      <>
        <Helmet>
          <title>{id ? 'Edit User' : 'Add User'}</title>
        </Helmet>

        <div className="flex justify-between my-3">
          <PageHeader>
            <span className="backbtn" onClick={this.handleBack}>
              <FaArrowLeft className="text-xl" />
            </span>
            {id ? 'Edit' : 'Add'} User
          </PageHeader>
        </div>

        <PageContent>
          {window.location.pathname.includes('edit') && (
            <div className="flex border border-b-0 _Tab">
              <button
                type="button "
                className={`block py-2 px-4 hover:text-primary  border-r ${
                  this.state.tab === 'basic' ? 'active' : ''
                }`}
                onClick={() => this.handleTab('basic')}
              >
                Basic Info
              </button>
              <button
                type="button "
                className={`block py-2 px-4 hover:text-primary  border-r ${
                  this.state.tab === 'reset' ? 'active' : ''
                }`}
                onClick={() => this.handleTab('reset')}
              >
                Reset Password
              </button>
            </div>
          )}
          {this.state.tab === 'basic' && (
            <div className="p-4 border">
              <div className="w-full md:w-1/2 pb-4">
                {window.location.pathname.includes('edit') ? null : (
                  <h3 className="text-lg font-bold mb-2">Basic Information</h3>
                )}

                <label>Email</label>
                <input
                  className="inputbox"
                  id="email"
                  type="text"
                  value={users.email || ''}
                  onChange={this.handleChange('email')}
                />
              </div>
              <div className="w-full md:w-1/2 pb-4">
                <label>Name</label>
                <input
                  className="inputbox"
                  id="name"
                  type="text"
                  value={users.name || ''}
                  onChange={this.handleChange('name')}
                />
                {errors && errors.name && errors.name.trim() !== '' && (
                  <div className="error">{(errors && errors.name) || ''}</div>
                )}
              </div>
              <div className="w-full md:w-1/2 pb-4">
                <label className="text-sm">Bio</label>
                <textarea
                  className="inputbox"
                  id="bio"
                  type="text"
                  value={(users && users.bio) || ''}
                  onChange={this.handleChange('bio')}
                />
              </div>
              {roless.map(each => (
                <div className="checkbox" key={each._id}>
                  <input
                    checked={users.roles.includes(each._id)}
                    onChange={() => this.handleRolesChecked(each._id)}
                    type="checkbox"
                    id={each._id}
                  />
                  <label htmlFor={each._id}>
                    <span className="box">
                      <FaCheck className="check-icon" />
                    </span>
                    {each.role_title || ''}
                  </label>
                </div>
              ))}
              {errors && errors.roles && errors.roles.trim() !== '' && (
                <div className="error">{(errors && errors.roles) || ''}</div>
              )}

              <div className="checkbox">
                <input
                  disabled
                  name="email_verified"
                  checked={users.email_verified || false}
                  onChange={this.handleChecked('email_verified')}
                  type="checkbox"
                />
                <label>
                  <span className="box">
                    <FaCheck className="check-icon" />
                  </span>
                  Email Verified
                </label>
              </div>

              <div className="checkbox">
                <input
                  name="is_active"
                  checked={users.is_active || false}
                  onClick={this.handleChecked('is_active')}
                  onChange={null}
                  type="checkbox"
                  id="is_active"
                />
                <label htmlFor="is_active">
                  <span className="box">
                    <FaCheck className="check-icon" />
                  </span>
                  Active?
                </label>
              </div>

              {id ? (
                <div className="mt-4">
                  <button
                    className="block btn text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
                    onClick={this.handleSave}
                    style={{ marginTop: '0' }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <></>
              )}
              {window.location.pathname.includes('add') ? (
                <>
                  <h3 className="text-lg font-bold mt-3">
                    {window.location.pathname.includes('edit')
                      ? 'Reset '
                      : 'New '}
                    Password
                  </h3>
                  <div className="w-full md:w-1/2 pb-4">
                    <label className="label">Password</label>
                    <div className="relative">
                      <input
                        className="inputbox"
                        id="password"
                        type={this.state.isSecure ? 'password' : 'text'}
                        value={users.password || ''}
                        onChange={this.handleChange('password')}
                      />
                      <span
                        className="absolute right-0 top-0 mt-2 mr-2"
                        aria-label="Toggle password visibility"
                        onClick={this.handleTogglePassword}
                      >
                        {this.state.isSecure ? <FaRegEye /> : <FaRegEyeSlash />}
                      </span>
                    </div>
                    <div className="error">{errors.password || ''}</div>
                  </div>
                  <button
                    className="block btn text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
                    onClick={this.handleUpdate}
                  >
                    {id ? 'Update Password' : 'Save'}
                  </button>
                </>
              ) : null}
            </div>
          )}
          {this.state.tab === 'reset' && (
            <div className="p-4 border">
              <div className="w-full md:w-1/2 pb-4">
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    className="inputbox"
                    id="password"
                    type={this.state.isSecure ? 'password' : 'text'}
                    value={users.password || ''}
                    onChange={this.handleChange('password')}
                  />
                  <span
                    className="absolute right-0 top-0 mt-2 mr-2"
                    aria-label="Toggle password visibility"
                    onClick={this.handleTogglePassword}
                  >
                    {this.state.isSecure ? <FaRegEye /> : <FaRegEyeSlash />}
                  </span>
                </div>
                <div className="error">{errors.password || ''}</div>
              </div>
              <button
                className="block btn text-white bg-blue-500 border border-blue-600 hover:bg-blue-600"
                onClick={this.handleUpdate}
              >
                {id ? 'Update Password' : 'Save'}
              </button>
            </div>
          )}
        </PageContent>
      </>
    );
  }
}

const withReducer = injectReducer({ key: 'adminUserManagePage', reducer });
const withSaga = injectSaga({ key: 'adminUserManagePage', saga });

const mapStateToProps = createStructuredSelector({
  one: makeSelectOne(),
  roless: makeSelectRoles(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

const withConnect = connect(mapStateToProps, { ...mapDispatchToProps, push });

export default compose(withReducer, withSaga, withConnect)(AddEdit);
