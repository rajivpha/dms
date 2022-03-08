/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Helmet } from 'react-helmet';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {

  render() {
    const { classes, category } = this.props;

    return (
      <>
        <Helmet>
          <title>
            Home
          </title>
        </Helmet>

        <div className="mb-2 md:mb-4">
         
        </div>
      </>
    );
  }
}
