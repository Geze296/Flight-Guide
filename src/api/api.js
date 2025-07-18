import axios from "axios";

export const getAirportData = async (city) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
    params: { query: city },
    headers: {
      "x-rapidapi-key": "ff55f00ea7mshb67718f9187105dp1abe2fjsn8f5747f8c953",
      "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);
  console.log("getAirportData response:", response.data);

  return response.data.data[0]; // Return first matched result
};

export const searchFlights = async (searchParams) => {
  try {
    const { origin, destination, date, returnDate, passengers, cabinClass } =
      searchParams;

    // Get airport data for both origin and destination
    const originData = await getAirportData(origin);
    const destinationData = await getAirportData(destination);

    console.log(searchParams);
    console.log("Origin Data:", originData);
    console.log("Destination Data:", destinationData);
    
    
    
    

    // Base request options
    const options = {
      method: "GET",
      url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
      params: {
        originSkyId: originData.skyId,
        // originSkyId: "PARI",
        destinationSkyId: destinationData.skyId,
        originEntityId: originData.entityId,
        // originEntityId: "27539733",
        destinationEntityId: destinationData.entityId,
        date,
        cabinClass: cabinClass.toLowerCase(), // Ensure lowercase to match API requirements
        adults: passengers.toString(),
        sortBy: "best",
        currency: "USD",
        market: "en-US",
        countryCode: "US",
      },
      headers: {
        "x-rapidapi-key": "ff55f00ea7mshb67718f9187105dp1abe2fjsn8f5747f8c953",
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    };

    // Add return date if it's a round trip
    if (returnDate) {
      options.params.returnDate = returnDate;
    }

    const response = await axios.request(options);
    console.log("searchFlights response:", response.data);
    return response.data; // Return the full response data
  } catch (error) {
    console.error(
      "searchFlights error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
