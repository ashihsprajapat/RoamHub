
import { useContext, useEffect, useState } from 'react'
import AppContext from '../../../context/AppContext';
import axios from 'axios';
import HomePageSkeleton from '../../../components/skeletons/HomePageSkeleton';
import LisitngCard from '../../../components/LisitngCard';
import { useAuth } from '../../Auth/Hooks/useAuth';

function AllListing() {

    const {  isHomePageLoading,  } = useContext(AppContext);
    const { allData } = useAuth()

    const [listings, setListings] = useState([]);

   
    useEffect(() => {
        allData()
    }, [])

    if (isHomePageLoading) {
        return (
            <HomePageSkeleton />
        )
    }
    return (
        <div>

            {
                listings.length >= 1 &&
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-2 md:mx-3 my-10 gap-5" >
                    {
                        listings.map((listing, i) => {
                            return < LisitngCard key={i} listing={listing} />
                        })
                    }
                </div>
            }


        </div>
    )
}

export default AllListing
