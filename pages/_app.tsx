import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { SiteLayout } from '../components';

import store from '../redux/store';

import '../styles/globals.scss';

const MyApp = ({ Component, pageProps }: {Component: React.FC, pageProps: object}) => (
    <Provider store={store}>
        <SiteLayout>
            <Component {...pageProps} />
        </SiteLayout>
    </Provider>
);

MyApp.propType = {
    Component: PropTypes.element,
    pageProps: PropTypes.object,
};

export default MyApp;
