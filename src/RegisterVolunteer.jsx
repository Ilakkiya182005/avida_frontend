
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion"; 
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/purple.css";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
const userId = localStorage.getItem("userId");
console.log(userId);
const RegisterVolunteer = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId : localStorage.getItem("userId"),
    state: "",
    city: "",
    languages_known: "",
    qualification: "",
    available_dates: [],
    available_session: "",
    past_experience: "no",
    travel_distance_km: "",
    Aadhar_Number: "",
    Pan_Card_Number: "",
    location_coordinate_latitude: "12.34567",
    location_coordinate_longitude: "34.345667",
  });

  const fetchStates = async () => {
    const response = await fetch("https://api.countrystatecity.in/v1/countries/IN/states", {
      headers: { "X-CSCAPI-KEY": "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==" },
    });
    const data = await response.json();
    setStates(data);
  };

  const fetchCities = async (stateCode) => {
    const response = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`, {
      headers: { "X-CSCAPI-KEY": "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==" },
    });
    const data = await response.json();
    setCities(data);
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value, city: "" });
    fetchCities(e.target.value);
  };

  const handleMapClick = (latlng) => {
    setPosition(latlng);
    
    // Reverse geocoding for address
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
      .then((res) => res.json())
      .then((data) => setAddress(data.display_name));
  
    // ✅ Correctly update latitude & longitude in formData
    setFormData((prevData) => ({
      ...prevData,
      location_coordinate_latitude: latlng.lat,
      location_coordinate_longitude: latlng.lng,
    }));
  };
  

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng);
      },
    });
    return null;
  };

  const handleDateClick = (dates) => {
    const formattedDates = dates.map(date => date.format("YYYY-MM-DD"));
    setSelectedDates(formattedDates);
    setFormData((prevData) => ({
      ...prevData,
      available_dates: formattedDates,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(formData+"formData")
  
  //   const token = localStorage.getItem("token"); 
  //   console.log(token);// Retrieve token from local storage
  
  //   if (!token) {
  //     alert("Unauthorized: Token is missing. Please log in again.");
  //     navigate("/login"); // Redirect to login page if token is missing
  //     return;
  //   }
  //   const VolunteerData = { ...formData, userId : userId};
  //   console.log(VolunteerData);
  
  //   fetch("http://localhost:5001/register-volunteer", {
  //     method: "POST",
  //     headers: {
  //         "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(VolunteerData), // Ensure volunteerData is properly defined
  //     credentials: "include", // Ensure cookies like JWT tokens are included
  // })
  // .then(response => {
  //     if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     return response.json();
  // })
  // .then(data => {
  //     console.log("Registration successful:", data);
  //     alert("Volunteer registered successfully!");
  //     navigate('/volunteer-dashboard'); // Show success alert
  // })
  // .catch(error => {
  //     console.error("Error:", error);
  //     alert("Error in registration: " + error.message); // Show error alert
  // });

  // };
 

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true); // Start animation

  console.log(formData, "formData");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Unauthorized: Token is missing. Please log in again.");
    navigate("/login");
    return;
  }

  const VolunteerData = { ...formData, userId };
  console.log(VolunteerData);

  try {
    const response = await fetch("https://avida-backend.onrender.com/register-volunteer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(VolunteerData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Registration successful:", data);
    toast.success("Volunteer registered successfully!", {
      theme: "colored",
       position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      style: { backgroundColor: "#862D86", color: "white" },
    });

    setTimeout(() => {
      navigate("/volunteer-dashboard");
    }, 1000);


  } catch (error) {
    console.error("Error:", error);
    alert("Error in registration: " + error.message);
  }
};


  return (
    <>
    <ToastContainer />
       <motion.div
  className="flex items-center justify-center min-h-screen p-10"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  style={{
    background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
  }}
>
<div className="max-w-6xl w-full bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl rounded-2xl p-10 flex border border-white border-opacity-30">
    {/* Left Section - Form */}
    <div className="w-1/2 p-6 border-r">
    <h2 
  className="text-3xl font-bold mb-6 text-center" 
  style={{
    background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Register as a Volunteer
</h2>


      <form onSubmit={handleSubmit} className="space-y-4">
        {/* State & City */}
        <label className="font-medium text-gray-700">State</label>
        <select onChange={handleStateChange} value={formData.state} required className="p-2 border rounded w-full">
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.iso2} value={state.iso2}>{state.name}</option>
          ))}
        </select>

        <label className="font-medium text-gray-700">City</label>
        <select onChange={(e) => setFormData({ ...formData, city: e.target.value })} value={formData.city} required className="p-2 border rounded w-full">
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>

        {/* Qualification & Languages */}
        <label className="font-medium text-gray-700">Qualification</label>
        <select onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className="p-2 border rounded w-full">
          <option value="">Select Qualification</option>
          <option value="10th">10th</option>
          <option value="12th">12th</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="Diploma">Diploma</option>
        </select>

        <label className="font-medium text-gray-700">Languages Known</label>
        <select onChange={(e) => setFormData({ ...formData, languages_known: e.target.value })} className="p-2 border rounded w-full">
          <option value="">Select Languages</option>
          <option value="Tamil">Tamil</option>
          <option value="English">English</option>
          <option value="Others">Others</option>
        </select>

        <label className="font-medium text-gray-700">How many kilometers can you travel?</label>
        <input type="number" className="p-2 border rounded w-full" onChange={(e) => setFormData({ ...formData, travel_distance_km: e.target.value })} />

        {/* Past Experience */}
        <label className="font-medium text-gray-700">Do you have past experience?</label>
        <select className="p-2 border rounded w-full" onChange={(e) => setFormData({ ...formData, past_experience: e.target.value })}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <label className="font-medium text-gray-700">Available Dates</label>
        <DatePicker
          multiple
          onChange={handleDateClick}
          className="p-2 border rounded w-full"
        />
        {selectedDates.length > 0 && (
          <div className="text-sm text-white p-2 border rounded w-full"  style={{
            background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
          }}>
            Available Dates: {selectedDates.join(", ")}
          </div>
        )}
      </form>
    </div>

    {/* Right Section - Map & Additional Details */}
    <div className="w-1/2 p-6">
      <label className="font-medium text-gray-700">Available Sessions</label>
      <select onChange={(e) => setFormData({ ...formData, available_session: e.target.value })} className="p-2 border rounded w-full">
        <option value="">Select Available Session</option>
        <option value="Morning">Morning</option>
        <option value="Afternoon">Afternoon</option>
        <option value="Evening">Evening</option>
      </select>

      <label className="font-medium text-gray-700">Aadhar Number</label>
      <input type="text" className="p-2 border rounded w-full" onChange={(e) => setFormData({ ...formData, Aadhar_Number: e.target.value })} />

      <label className="font-medium text-gray-700">PAN Card Number</label>
      <input type="text" className="p-2 border rounded w-full" onChange={(e) => setFormData({ ...formData, Pan_Card_Number: e.target.value })} />

      <label className="font-medium text-gray-700">Choose Your Location</label>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-64 w-full border rounded">
      <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

        <MapClickHandler />
        {position && <Marker position={position} />}
      </MapContainer>
      {address && <p className="text-sm mt-2">Selected Address: {address}</p>}

      <motion.button
        type="submit"
        className=" p-3 rounded w-full mt-4 text-white font-bold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        style={{
          background: "linear-gradient(135deg, #12062E 0%, #862D86 100%)",
        }}
      >
        Submit
      </motion.button>
    </div>
  </div>
</motion.div>

    </>
    
  );
};

export default RegisterVolunteer;


 

