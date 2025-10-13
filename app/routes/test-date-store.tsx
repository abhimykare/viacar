import { useRideCreationStore } from "~/lib/store/rideCreationStore";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export default function TestDateStore() {
  const { rideData, setDepartureDate } = useRideCreationStore();
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSetDate = () => {
    console.log("Setting departure date to:", testDate);
    setDepartureDate(testDate);
    
    // Check localStorage immediately
    setTimeout(() => {
      const storedData = localStorage.getItem('ride-creation-storage');
      console.log("Raw localStorage after setting:", storedData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed localStorage departure_date:", parsedData.state?.rideData?.departure_date);
      }
    }, 100);
  };

  const handleCheckStore = () => {
    console.log("Current store data:", rideData);
    console.log("Current departureDate:", rideData.departure_date);
    
    const storedData = localStorage.getItem('ride-creation-storage');
    console.log("Raw localStorage:", storedData);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Parsed localStorage departure_date:", parsedData.state?.rideData?.departure_date);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Date Store</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Test Date (YYYY-MM-DD):
          </label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        
        <div className="space-x-2">
          <Button onClick={handleSetDate}>
            Set Departure Date
          </Button>
          <Button onClick={handleCheckStore} variant="outline">
            Check Store
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Current Store State:</h3>
          <pre className="text-sm">{JSON.stringify(rideData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}