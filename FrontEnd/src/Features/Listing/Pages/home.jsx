
import { useContext, useState } from "react";
import AppContext from "../../../context/AppContext";
import LisitngCard from "../../../components/LisitngCard";
import HomePageSkeleton from '../../../components/skeletons/HomePageSkeleton';
import { Search, Home as HomeIcon, Smartphone, MapPin, CalendarDays, Users } from 'lucide-react';
import FortIcon from '@mui/icons-material/Fort';
import BusinessIcon from '@mui/icons-material/Business';
import CottageIcon from '@mui/icons-material/Cottage';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import SailingIcon from '@mui/icons-material/Sailing';
import GiteIcon from '@mui/icons-material/Gite';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import BalconyIcon from '@mui/icons-material/Balcony';
import { useListing } from '../Hooks/UseListing';

function Home() {
    const { isHomePageLoading, filteredListings,

        searchQuery, setSearchQuery,
        activeCategory, setActiveCategory } = useListing();

    const [dateRange, setDateRange] = useState('Add dates');
    const [guestCount, setGuestCount] = useState(2);

    const categories = [
        { name: 'All', },
        { name: 'House', icon: <HomeIcon size={18} /> },
        { name: 'Flat/apartment', icon: <BusinessIcon size={18} /> },
        { name: 'Barn', icon: <CottageIcon size={18} /> },
        { name: 'Bed & breakfast', icon: <RamenDiningIcon size={18} /> },
        { name: 'Boat', icon: <SailingIcon size={18} /> },
        { name: 'Cabin', icon: <GiteIcon size={18} /> },
        { name: 'Campervan/motorhome', icon: <AirportShuttleIcon size={18} /> },
        { name: 'Casa particular', icon: <HomeIcon size={18} /> },
        { name: 'Castle', icon: <FortIcon size={18} /> },
        { name: 'Cave', icon: <BalconyIcon size={18} /> }
    ];



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-rose-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 p-8 lg:p-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-4 py-2 text-sm font-medium shadow-sm">
                                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                                    Booking made simple for every stay
                                </div>
                                <div>
                                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                                        Find the perfect place for your next trip
                                    </h1>
                                    <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl">
                                        Search by location, property type, dates, and guests so you can book faster.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <button className="flex items-center justify-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:border-rose-300 hover:text-rose-600 transition">
                                        <MapPin className="h-4 w-4" />
                                        Anywhere
                                    </button>
                                    <button className="flex items-center justify-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:border-rose-300 hover:text-rose-600 transition">
                                        <CalendarDays className="h-4 w-4" />
                                        {dateRange}
                                    </button>
                                    <button className="flex items-center justify-center gap-2 rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:border-rose-300 hover:text-rose-600 transition">
                                        <Users className="h-4 w-4" />
                                        {guestCount} guests
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] bg-rose-50 p-6 shadow-inner shadow-rose-100/80">
                                <div className="mb-4 text-sm font-semibold text-rose-700">Quick search</div>
                                <form className="space-y-4">
                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-gray-700">Location</span>
                                        <div className="relative">
                                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Where are you going?"
                                                className="w-full rounded-3xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-700 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-gray-700">Dates</span>
                                            <input
                                                type="text"
                                                value={dateRange}
                                                readOnly
                                                className="w-full rounded-3xl border border-gray-200 bg-white py-3 px-4 text-gray-700 shadow-sm"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-gray-700">Guests</span>
                                            <input
                                                type="text"
                                                value={`${guestCount} guest${guestCount > 1 ? 's' : ''}`}
                                                readOnly
                                                className="w-full rounded-3xl border border-gray-200 bg-white py-3 px-4 text-gray-700 shadow-sm"
                                            />
                                        </label>
                                    </div>
                                    <button type="button" className="w-full rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-700">
                                        Search listings
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-4">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => setActiveCategory(category.name)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === category.name ? 'bg-rose-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {isHomePageLoading ?
                <HomePageSkeleton />
                :



                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    {filteredListings?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No listings found. Try a different search or category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredListings?.map((listing, i) => (
                                <LisitngCard key={i} listing={listing} />
                            ))}
                        </div>
                    )}
                </div>
            }
            {/* Mobile App Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="bg-gradient-to-r from-indigo-50 to-rose-50 rounded-2xl overflow-hidden shadow-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="p-8 md:p-12 max-w-md">
                            <div className="inline-block p-2 bg-indigo-100 rounded-full mb-4">
                                <Smartphone className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Get the RoamHub App</h2>
                            <p className="text-gray-600 mb-6">Book unique places to stay and things to do, wherever you are in the world.</p>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                <button className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                                    <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.5,1.5h-11c-2.761,0-5,2.239-5,5v11c0,2.761,2.239,5,5,5h11c2.761,0,5-2.239,5-5v-11C22.5,3.739,20.261,1.5,17.5,1.5z M14.5,13.5l-3,1.73c-0.29,0.167-0.65-0.042-0.65-0.37v-3.46c0-0.328,0.36-0.537,0.65-0.37l3,1.73C14.79,12.93,14.79,13.33,14.5,13.5z" />
                                    </svg>
                                    App Store
                                </button>
                                <button className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                                    <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.5,20.5c0,0.552,0.448,1,1,1h15c0.552,0,1-0.448,1-1v-17c0-0.552-0.448-1-1-1h-15c-0.552,0-1,0.448-1,1V20.5z M12,6.5c2.761,0,5,2.239,5,5s-2.239,5-5,5s-5-2.239-5-5S9.239,6.5,12,6.5z M12,14.5c1.657,0,3-1.343,3-3s-1.343-3-3-3s-3,1.343-3,3S10.343,14.5,12,14.5z" />
                                    </svg>
                                    Google Play
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-1/3 lg:w-2/5">
                            <img
                                className="h-full w-full object-cover"
                                src="https://tse1.mm.bing.net/th/id/OIP.p3t-u_PDrPyBZmlSuRgd2wHaHa?pid=Api&P=0&h=180"
                                alt="RoamHub mobile app"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;