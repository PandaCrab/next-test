import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
import { Provider } from 'react-redux';
import SiteLayout from '../components/site-layout';

import store from '../redux/store';

import '../styles/globals.css'

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </Provider>
    </ApolloProvider>
  )
}

export default MyApp
