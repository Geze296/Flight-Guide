import { useState } from "react";
import FlightCard from "./FlightCard";

const FlightResults = ({ flights, isLoading }) => {
  const [filters, setFilters] = useState({
    sortBy: "best", // best, price, duration
    stops: null, // null (all), 0 (nonstop), 1 (1 stop), 2+ (2+ stops)
    airlines: [],
    priceRange: [0, 10000],
    departureTime: [], // morning, afternoon, evening, night
    baggage: null // carry-on, checked
  });

  const airlines = [...new Set(flights?.flatMap(flight => 
    flight.legs.flatMap(leg => 
      leg.carriers.marketing.map(carrier => carrier.name)
    ) || []))];

  const filteredFlights = flights?.filter(flight => {
    // Filter by stops
    if (filters.stops !== null && flight.legs[0].stopCount !== filters.stops) {
      return false;
    }
    
    // Filter by airlines
    if (filters.airlines.length > 0) {
      const flightAirlines = flight.legs[0].carriers.marketing.map(c => c.name);
      if (!filters.airlines.some(airline => flightAirlines.includes(airline))) {
        return false;
      }
    }
    
    // Filter by price
    if (flight.price.raw < filters.priceRange[0] || flight.price.raw > filters.priceRange[1]) {
      return false;
    }
    
    // Filter by departure time
    if (filters.departureTime.length > 0) {
      const departureHour = new Date(flight.legs[0].departure).getHours();
      let timeMatch = false;
      
      if (filters.departureTime.includes("morning") && departureHour >= 5 && departureHour < 12) {
        timeMatch = true;
      }
      if (filters.departureTime.includes("afternoon") && departureHour >= 12 && departureHour < 17) {
        timeMatch = true;
      }
      if (filters.departureTime.includes("evening") && departureHour >= 17 && departureHour < 21) {
        timeMatch = true;
      }
      if (filters.departureTime.includes("night") && (departureHour >= 21 || departureHour < 5)) {
        timeMatch = true;
      }
      
      if (!timeMatch) return false;
    }
    
    return true;
  });

  const sortedFlights = [...filteredFlights || []].sort((a, b) => {
    if (filters.sortBy === "price") {
      return a.price.raw - b.price.raw;
    } else if (filters.sortBy === "duration") {
      return a.legs[0].durationInMinutes - b.legs[0].durationInMinutes;
    }
    // Default: best (sort by score or other criteria)
    return (b.score || 0) - (a.score || 0);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            
            {/* Sort By */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Sort by</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="best">Best</option>
                <option value="price">Price (lowest first)</option>
                <option value="duration">Duration (shortest first)</option>
              </select>
            </div>
            
            {/* Stops */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Stops</h4>
              <div className="space-y-2">
                {[null, 0, 1, 2].map(stops => (
                  <label key={stops} className="flex items-center">
                    <input
                      type="radio"
                      name="stops"
                      checked={filters.stops === stops}
                      onChange={() => setFilters({...filters, stops})}
                      className="mr-2"
                    />
                    {stops === null ? 'All flights' : 
                     stops === 0 ? 'Nonstop only' : 
                     stops === 1 ? 'Up to 1 stop' : '2+ stops'}
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price range</h4>
              <div className="flex justify-between mb-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({
                  ...filters, 
                  priceRange: [0, parseInt(e.target.value)]
                })}
                className="w-full"
              />
            </div>
            
            {/* Airlines */}
            {airlines.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Airlines</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {airlines.map(airline => (
                    <label key={airline} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.airlines.includes(airline)}
                        onChange={() => {
                          const newAirlines = filters.airlines.includes(airline)
                            ? filters.airlines.filter(a => a !== airline)
                            : [...filters.airlines, airline];
                          setFilters({...filters, airlines: newAirlines});
                        }}
                        className="mr-2"
                      />
                      {airline}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Departure Time */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Departure time</h4>
              <div className="grid grid-cols-2 gap-2">
                {['morning', 'afternoon', 'evening', 'night'].map(time => (
                  <label key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.departureTime.includes(time)}
                      onChange={() => {
                        const newTimes = filters.departureTime.includes(time)
                          ? filters.departureTime.filter(t => t !== time)
                          : [...filters.departureTime, time];
                        setFilters({...filters, departureTime: newTimes});
                      }}
                      className="mr-2"
                    />
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Main Content */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {sortedFlights.length} {sortedFlights.length === 1 ? "Flight" : "Flights"} Found
              </h2>
              <div className="text-sm text-gray-600">
                {filters.stops === null ? 'All flights' : 
                 filters.stops === 0 ? 'Nonstop only' : 
                 filters.stops === 1 ? 'Up to 1 stop' : '2+ stops'}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : sortedFlights.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-medium mb-2">No flights match your filters</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFlights.map((flight, index) => (
                <FlightCard key={`${flight.id}-${index}`} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightResults;