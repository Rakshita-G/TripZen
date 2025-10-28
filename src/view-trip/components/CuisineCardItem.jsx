import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";

function CuisineCardItem({ cuisine }) {
  const [photoUrl, setPhotoUrl] = useState('/cuisine_placeholder.png');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (cuisine?.name && !hasFetched) {
      const fetchImage = async () => {
        setIsLoading(true);
        await GetPlacePhoto();
        setIsLoading(false);
        setHasFetched(true);
      };
      fetchImage();
    }
  }, [cuisine?.name]); // Only re-run if cuisine.name changes

  const GetPlacePhoto = async () => {
    try {
      // More specific query for food images
      const data = {
        textQuery: `${cuisine?.name} food`,
        maxResultCount: 5, // Get more results to find a good match
      };

      const response = await GetPlaceDetails(data);
      const places = response?.data?.places;
      
      if (places && places.length > 0) {
        const place = places[0];
        const photos = place?.photos || [];
        
        // Try to find the first available photo from index 5 down to 0
        for (let i = Math.min(3, photos.length - 1); i >= 0; i--) {
          if (photos[i]?.name) {
            const photoUrl = PHOTO_REF_URL.replace("{NAME}", photos[i].name);
            setPhotoUrl(photoUrl);
            return;
          }
        }
      }
      
      // If no photos found, throw to trigger the fallback
      throw new Error('No suitable photo found');
    } catch (error) {
      
    }
  };

  // Format price with currency symbol if needed
  const formatPrice = () => {
    if (!cuisine?.price) return "Price on request";

    // If price already includes currency code (e.g., "150-250 INR" or "25-40 EUR")
    if (/[a-zA-Z]/.test(cuisine.price)) {
      return cuisine.price;
    }

    // If we have a separate currency field
    if (cuisine?.currency) {
      return `${cuisine.price} ${cuisine.currency}`;
    }

    return cuisine.price;
  };

  return (
    <div className="hover:scale-105 transition-all cursor-pointer mt-5 mb-8 bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full overflow-hidden">
        {isLoading ? (
          <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400">Loading...</span>
          </div>
        ) : (
          <img
            src={photoUrl}
            className="h-full w-full object-cover"
            alt={cuisine?.name || "Food image"}
          />
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {formatPrice()}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="font-bold text-lg mb-1">{cuisine?.name}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-1">
          {cuisine?.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm">{cuisine?.rating || "N/A"}</span>
          </div>
          {cuisine?.price &&
            !cuisine.price.includes(cuisine.currency) &&
            cuisine.currency && (
              <span className="text-xs text-gray-500">{cuisine.currency}</span>
            )}
        </div>

        {cuisine?.reviews && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 italic line-clamp-2">
              "{cuisine.reviews}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CuisineCardItem;
