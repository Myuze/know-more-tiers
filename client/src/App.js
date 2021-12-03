import './sass/App.scss';
import { Counter } from './features/counter/counter';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as NavRouter, Routes, Route } from 'react-router-dom';
import TierList from './components/TierList'
import { Landing } from './pages';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <nav className="nav"><h1>NAV PLACEHOLDER</h1></nav>
          <Counter />
          <NavRouter>
              <section className="main-content">
                <Routes>
                  <Route exact path="/" element={<Landing />} />
                  <Route exact path="/tierlist" element={<TierList />} />
                </Routes>
              </section>
          </NavRouter>
        </header>
      </div>
    </ApolloProvider>
  );
}
