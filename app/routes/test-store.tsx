import { useRideCreationStore } from "~/lib/store/rideCreationStore";
import { useEffect } from "react";

export default function TestStore() {
  const { rideData, setPickup, setDropoff } = useRideCreationStore();
  
  useEffect(() => {
    console.log("Store data on mount:", rideData);
  }, []);
  
  const testSetPickup = () => {
    console.log("Setting pickup...");
    setPickup({
      lat: 40.7128,
      lng: -74.0060,
      address: "New York, NY",
      placeId: "test-place-id"
    });
    console.log("Pickup set, checking store...");
    setTimeout(() => {
      console.log("Store after setting pickup:", useRideCreationStore.getState().rideData);
    }, 100);
  };
  
  const testSetDropoff = () => {
    console.log("Setting dropoff...");
    setDropoff({
      lat: 34.0522,
      lng: -118.2437,
      address: "Los Angeles, CA",
      placeId: "test-place-id-2"
    });
    console.log("Dropoff set, checking store...");
    setTimeout(() => {
      console.log("Store after setting dropoff:", useRideCreationStore.getState().rideData);
    }, 100);
  };
  
  return (
    <div className="p-8">
      <h1>Store Test</h1>
      <div className="mb-4">
        <h2>Current Store Data:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(rideData, null, 2)}
        </pre>
      </div>
      <div className="space-x-4">
        <button 
          onClick={testSetPickup}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Set Pickup
        </button>
        <button 
          onClick={testSetDropoff}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Set Dropoff
        </button>
      </div>
    </div>
  );
}