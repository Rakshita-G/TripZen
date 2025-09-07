export const SelectTravelList = [
    {
        id:1,
        title: 'Just Me',
        desc: 'A sole traveles in exploration',
        icon: '✈️',
        people:'1 person'
    },
    {
        id:2,
        title: 'A Couple',
        desc: 'Two traveles in tandem',
        icon: '🥂',
        people:'2 people'
    },
    {
        id:3,
        title: 'Family',
        desc: 'A group of fun loving adv',
        icon: '🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title: 'Friends',
        desc: 'A bunch of thrill-seekes',
        icon: '⛵',
        people:'5 to 10 people'
    }
]

export const SelectBudgetOptions = [
    {
        id:1,
        title: 'Cheap',
        desc: 'Stay conscious of costs',
        icon: '💵',
    },
    {
        id:2,
        title: 'Moderate',
        desc: 'Keep cost on the average side',
        icon: '💰',
    },
    {
        id:3,
        title: 'Luxury',
        desc: 'Dont worry about cost',
        icon: '💸',
    }
]

export const AI_PROMPT = `You are an expert travel planner. Create a detailed {totalDays}-day travel itinerary for {location} for {traveler} with a {budget} budget.

Return the response in this exact JSON format:

{
  "itinerary": {
    "totalDays": {totalDays},
    "bestTimetoVisit": "[Best months to visit]",
    "dailyPlan": [
      {
        "day": "Day 1",
        "plan": [
          {
            "place": "[Place Name]",
            "details": "[Detailed description of the activity/place]",
            "imageUrl": "[Direct URL to high-quality image]",
            "rating": "[X] stars",
            "time": "[Recommended time of day]",
            "geoCoordinates": [latitude,longitude],
            "ticketPricing": "[Cost or 'Free']"
          }
        ]
      }
    ]
  },
  "hotel_options": [
    {
      "name": "[Hotel Name]",
      "description": "[Brief hotel description]",
      "image_url": "[Direct URL to hotel image]",
      "address": "[Full address]",
      "price": "[Price range] per night",
      "rating": "[X] stars",
      "geo_coordinates": [latitude,longitude]
    }
  ]
}

IMPORTANT:
- Only return valid JSON, no additional text
- Include {totalDays} days in the dailyPlan array
- For each day, include 2-4 activities/places to visit
- Ensure all image URLs are direct links that will work in a web browser
- Include 3-5 hotel options with varying price points
- Keep descriptions concise but informative`

export const CUISINE_AI_PROMPT = `You are a Travel Guide and Local Cuisine Expert. Suggest 3-5 must-try local cuisines for Location: {location}, considering a {budget} budget for {traveler}.

For each cuisine, provide:
- name: Name of the dish
- description: Brief description (1-2 sentences)
- image_url: Direct URL to a high-quality image (must be accessible)
- price: Price range in local currency (e.g., "₹150 - ₹250" for India, "€10 - €15" for Europe)
- rating: Rating out of 5 (e.g., "4.2")
- reviews: 1-2 short, realistic reviews from travelers

Return the response in this exact JSON format:
{
  "cuisine_options": [
    {
      "description": "A hearty noodle soup, typically made with whole wheat flour noodles, vegetables and a flavorful broth.",
      "name": "Thenthuk",
      "image_url": "https://example.com/thenthuk.jpg",
      "price": "₹150 - ₹250",
      "reviews": \"Warm, comforting, and perfect for a cold day!\" - Traveler123, \"Simple but delicious, a true local staple.\" - Foodie_gal",
      "rating": "4.5"
    }
  ]
}

IMPORTANT:
- Only return valid JSON, no additional text
- Ensure all image URLs are direct links that will work in a web browser
- Keep descriptions concise but informative
- Make reviews sound natural and varied`

export const TRANSPORTATION_AI_PROMPT = `You are a Travel Transportation Expert. Suggest the best transportation options from {fromLocation} to {toLocation} for the date: {travelDate}. 

Consider the distance between locations and suggest appropriate transport types:
- For distances over 500km: Primarily suggest flights, with train as secondary
- For 200-500km: Suggest trains and buses
- For under 200km: Suggest buses and rental cars

For each transportation option, provide:
- type: flight/train/bus/car
- name: Name of the airline/train/bus service
- departure_time: Departure time in 24-hour format (HH:MM)
- arrival_time: Arrival time in 24-hour format (HH:MM)
- duration: Total travel time (e.g., "2h 30m")
- price_range: Price range in INR (e.g., "1,500-3,000")
- booking_url: Direct booking URL (if available)
- notes: Any important notes (e.g., "Meal included", "Sleeper available")

Return the response in this exact JSON format:
{
  "transportation_options": [
    {
      "type": "flight",
      "name": "IndiGo 6E-123",
      "departure_time": "08:30",
      "arrival_time": "10:45",
      "duration": "2h 15m",
      "price_range": "3,500-5,000",
      "booking_url": "https://www.goindigo.in/",
      "notes": "Includes 7kg cabin baggage"
    },
    {
      "type": "train",
      "name": "Rajdhani Express (12345)",
      "departure_time": "16:00",
      "arrival_time": "22:30",
      "duration": "6h 30m",
      "price_range": "1,200-2,500",
      "booking_url": "https://www.irctc.co.in/",
      "notes": "Meal included, AC 3-tier"
    },
    {
      "type": "bus",
      "name": "SRS Travels",
      "departure_time": "21:00",
      "arrival_time": "04:30",
      "duration": "7h 30m",
      "price_range": "800-1,200",
      "booking_url": "https://www.srsbooking.com/",
      "notes": "Sleeper bus available"
    }
  ]
}

IMPORTANT:
- Only return valid JSON, no additional text
- Include 2-3 options for each relevant transport type based on distance
- Ensure all booking URLs are valid and direct links
- Keep notes concise but informative
- Price ranges should be in INR and realistic for the route`