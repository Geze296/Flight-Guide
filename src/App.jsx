import { useState } from "react";
import FlightSearchForm from "./components/FlightSearchForm";
import FlightResults from "./components/FlightResults";
import { searchFlights } from "./api/api";

const App = () => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);  

  const handleSearch = async (searchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchFlights(searchParams);
      setFlights(results.data.itineraries);
      console.log('Flight results here : ', results.itineraries); 
    } catch (err) {
      setError(err.message || 'Failed to fetch flights');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Flight Finder</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <FlightSearchForm onSearch={handleSearch} />
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        <FlightResults flights={flights} isLoading={isLoading} />
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} Flight Finder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
