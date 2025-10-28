import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AI_PROMPT,
  CUISINE_AI_PROMPT,
  TRANSPORTATION_AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { DatePickerInput } from "@/components/custom/DatePicker";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Enhanced retry logic with exponential backoff and jitter
  const callWithRetry = async (fn, maxRetries = 5, baseDelay = 1000) => {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fn();
        return response;
      } catch (error) {
        lastError = error;
        const status = error.response?.status;
        
        // Log the error with attempt number
        console.warn(`Attempt ${attempt} failed with status ${status}:`, error.message);
        
        // Don't retry on client errors (4xx) except 429 (Too Many Requests)
        if (status && status >= 400 && status < 500 && status !== 429) {
          console.error('Client error, not retrying:', error);
          throw error;
        }
        
        // If max retries reached, throw the last error
        if (attempt === maxRetries) {
          console.error(`All ${maxRetries} attempts failed`);
          throw lastError;
        }
        
        // Calculate delay with exponential backoff and jitter
        const backoff = Math.min(
          baseDelay * Math.pow(2, attempt - 1) + // Exponential backoff
          Math.random() * 1000, // Add jitter
          30000 // Max 30 seconds
        );
        
        console.log(`Retrying in ${Math.round(backoff)}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
    // This should never be reached due to the throw in the loop
    throw lastError;
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (!formData?.location) {
      toast("Please select a location");
      return;
    }

    if (
      (formData?.noOfDAys > 5 && !formData?.location) ||
      !formData?.budget ||
      !formData.traveler
    ) {
      toast("Please fill all the details");
      return;
    }

    setLoading(true);

    try {
      const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",
        formData?.location?.label
      )
        .replace("{totalDays}", formData?.noOfDays)
        .replace("{traveler}", formData?.traveler)
        .replace("{budget}", formData?.budget);

      // Wrap API calls with retry logic
      const [itineraryResponse, cuisineResponse, transportResponse] = await Promise.all([
        callWithRetry(() => chatSession.sendMessage(FINAL_PROMPT)),
        callWithRetry(() =>
          chatSession.sendMessage(
            CUISINE_AI_PROMPT.replace("{location}", formData?.location?.label)
              .replace("{traveler}", formData?.traveler)
              .replace("{budget}", formData?.budget)
          )
        ),
        callWithRetry(() =>
          chatSession.sendMessage(
            TRANSPORTATION_AI_PROMPT.replace("{fromLocation}", formData?.from?.label || 'your location')
              .replace("{toLocation}", formData?.location?.label)
              .replace("{travelDate}", formData?.travelDate || new Date().toISOString().split('T')[0])
          )
        ),
      ]);
      console.log("..")
  
console.log(cuisineResponse?.response?.text())
console.log(itineraryResponse?.response?.text())
console.log(transportResponse?.response?.text())
      // Parse the JSON responses
      const itineraryData = JSON.parse(
        itineraryResponse?.response?.text() || "{}"
      );
      
      const cuisineData = JSON.parse(cuisineResponse?.response?.text() || "{}");
      const transportData = JSON.parse(transportResponse?.response?.text() || "{}");

      // Merge all data into the main itinerary object
      const result = {
        ...itineraryData,
        ...cuisineData,
        ...transportData,
      }; 

      console.log("Combined Trip Data:", result);
      SaveAiTrip(JSON.stringify(result));
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error(
        error.response?.data?.error?.message ||
          "Failed to generate trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    // Add a new document in collection "AITrips"
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });
    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  const login = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        onGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile: ", error);
      });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Travelling from?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("from", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            When are you traveling?
          </h2>
          <DatePickerInput
            date={formData?.travelDate}
            setDate={(date) => handleInputChange("travelDate", date)}
            className="mt-2"
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex.4"}
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.budget == item.title && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData?.traveler == item.people && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button disabled={loading} onClick={onGenerateTrip}>
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img
                src="/logo.svg"
                alt="logo"
                width="100px"
                className="items-center"
              />
              <h2 className="font-bold text-lg">
                Sign In to check out your travel plan
              </h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button
                onClick={login}
                className="w-full mt-6 flex gap-4 items-center"
              >
                <FcGoogle className="h-7 w-7" />
                Sign in With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
