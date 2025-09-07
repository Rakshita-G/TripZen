import React from 'react'
import CuisineCardItem from './CuisineCardItem'

function Cuisines({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-xl'>Local Cuisines to Try</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4'>
                {trip?.tripData?.cuisine_options?.map((cuisine, index) => (
                    <CuisineCardItem key={index} cuisine={cuisine} />
                ))}
            </div>
        </div>
    )
}

export default Cuisines
