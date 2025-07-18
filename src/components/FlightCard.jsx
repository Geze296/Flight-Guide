const FlightCard = ({ flight }) => {
    const formatTime = (dateTime) => {
      return new Date(dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };
  
    const formatDuration = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };
  
    return (
      <div className="border rounded-lg hover:shadow-md transition-shadow mb-4">
        <div className="p-4">
          {/* Top Row - Time and Price */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-lg font-medium">
                {formatTime(flight.legs[0].departure)} – {formatTime(flight.legs[0].arrival)}
              </div>
              <div className="text-sm text-gray-600">
                {flight.legs[0].carriers.marketing[0].name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{flight.price.formatted}</div>
              <div className="text-xs text-gray-500">round trip</div>
            </div>
          </div>
  
          {/* Middle Row - Duration and Route */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-sm">
                {formatDuration(flight.legs[0].durationInMinutes)}
              </div>
              <div className="text-xs text-gray-600">
                {flight.legs[0].origin.displayCode}–{flight.legs[0].destination.displayCode}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">{flight.legs[0].stopCount === 0 ? 'Nonstop' : `${flight.legs[0].stopCount} stop`}</div>
              <div className="text-xs text-gray-600">
                {flight.legs[0].origin.city} to {flight.legs[0].destination.city}
              </div>
            </div>
          </div>
  
          {/* Bottom Row - Emissions */}
          <div className="flex justify-between items-center pt-3 border-t">
            <div className="text-sm text-gray-600">
              {Math.floor(Math.random() * 50) + 30} kg CO₂e
            </div>
            <div className="text-xs text-gray-500">
              {Math.floor(Math.random() * 10) + 1}% emissions
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default FlightCard;