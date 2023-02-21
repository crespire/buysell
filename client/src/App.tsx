import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {

  return (
    <main className="App container mx-auto px-3">
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="px-2 flex justify-center content-center">
          <Outlet />
        </div>
        <Footer />
      </QueryClientProvider>
    </main>
  );
}

export default App;
