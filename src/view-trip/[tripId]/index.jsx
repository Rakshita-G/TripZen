import { db } from '@/service/firebaseConfig';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { toast } from 'sonner';
import InfoSection from "../components/InfoSection"; 
import Hotels from "../components/Hotels"; 
import PlacesToVisit from "../components/PlacesToVisit"; 
import Cuisines from "../components/Cuisines"; 
import Transportation from "../components/Transportation"; 
import Footer from "../components/Footer"; 

function Viewtrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState([])

    useEffect(() => {
        tripId && GetTripData()
    }, [tripId])

    // used to get trip info from firebase
    const GetTripData = async () => {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef)

        console.log("==========Saved Data==========")
        console.log(docSnap.data())
        console.log("==========Saved Data==========")
        if (docSnap.exists()) {
            console.log("Document: ", docSnap.data())
            setTrip(docSnap.data());
        }

        else {
            console.log("No such document")
            toast("No trip found")
        }

    }

    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
            {/* Information Section */}
            <InfoSection trip={trip} />

            {/* Tabbed Interface */}
            <div className="mt-4">
                <Tabs
                    defaultActiveKey="places"
                    id="trip-tabs"
                    className="mb-3"
                >
                    <Tab eventKey="places" title="Itinary">
                        <div className="p-4 border border-top-0 rounded-bottom">
                            <PlacesToVisit trip={trip} />
                        </div>
                    </Tab>
                    <Tab eventKey="hotels" title="Hotels">
                        <div className="p-5 border border-top-0 rounded-bottom">
                            <Hotels trip={trip} />
                        </div>
                    </Tab>
                    <Tab eventKey="cuisines" title="Local Cuisines">
                        <div className="p-5 border border-top-0 rounded-bottom">
                            <Cuisines trip={trip} />
                        </div>
                    </Tab>
                    <Tab eventKey="transportation" title="Transportation">
                        <div className="p-5 border border-top-0 rounded-bottom">
                            <Transportation trip={trip} />
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {/* Footer */}
            <Footer trip={trip} />

        </div>
    )
}

export default Viewtrip