import { Provider } from 'react-redux';
import SiteLayout from '../components/site-layout';

import store from '../redux/store';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <SiteLayout>
                <Component {...pageProps} />
            </SiteLayout>
        </Provider>
    );
}

export default MyApp;
