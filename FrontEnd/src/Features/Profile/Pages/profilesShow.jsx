
import { useContext, useEffect } from 'react'
import { Outlet, useLocation, useParams, NavLink } from 'react-router-dom'
import { assets } from '../../../assets/assets';
import AppContext from '../../../context/AppContext';
import { Home, List, Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from '../../Auth/Hooks/useAuth';

function ProfileShow() {

    const location = useLocation();

    const { id } = useParams();

    const { navigate } = useContext(AppContext);

    const { userData, setUserData, setUserToken, getUserData, currDashboard, setCurrDashboard } = useAuth()

    // Set active tab based on current path
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('all-listings')) {
            setCurrDashboard(0);
        } else if (path.includes('all-booking')) {
            setCurrDashboard(2);
        } else {
            setCurrDashboard(1);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!userData) {
            getUserData()
        }

    }, [id])



    const sidebarLinks = [
        { name: "My Listings", path: `/profile/${id}/all-listings`, icon: <Home className="w-5 h-5" /> },
        { name: "Manage Listing", path: `/profile/${id}/${userData?._id || 'listing'}`, icon: <List className="w-5 h-5" /> },
        { name: "All Bookings", path: `/profile/${id}/all-booking`, icon: <Calendar className="w-5 h-5" /> },
    ];

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-24 bg-gray-200 rounded hidden md:block animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row min-h-[calc(100vh-73px)]'>
                    {/* Sidebar Skeleton */}
                    <aside className="w-full md:w-64 lg:w-72 border-r border-gray-200 bg-white md:min-h-[calc(100vh-73px)] flex flex-col">
                        {/* Sidebar Header */}
                        <div className="p-5 border-b border-gray-200 bg-gray-50">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded mt-2 animate-pulse"></div>
                        </div>

                        {/* Stats Skeleton */}
                        <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-200">
                            <div className="bg-rose-50 rounded-lg p-3">
                                <div className="h-8 w-12 bg-gray-200 rounded mx-auto animate-pulse"></div>
                                <div className="h-3 w-20 bg-gray-200 rounded mt-2 mx-auto animate-pulse"></div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="h-8 w-12 bg-gray-200 rounded mx-auto animate-pulse"></div>
                                <div className="h-3 w-20 bg-gray-200 rounded mt-2 mx-auto animate-pulse"></div>
                            </div>
                        </div>

                        {/* Navigation Skeleton */}
                        <nav className="flex-1 p-3 space-y-1">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-lg">
                                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-32 bg-gray-200 rounded flex-1 animate-pulse"></div>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Skeleton */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-auto">
                        <div className="space-y-6">
                            {/* Content Title Skeleton */}
                            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>

                            {/* Content Cards Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div key={item} className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="h-40 w-full bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-4 bg-white shadow-sm">
                <a href="/" className="flex items-center gap-2">
                    <img className="h-8" src={assets.RoamHub} alt="Airbnb Logo" />
                    <span className="font-semibold text-rose-500 hidden md:block">Dashboard</span>
                </a>
                <div className="flex items-center gap-4">
                    {userData && (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block">

                                <p className="text-gray-700 font-semibold">{userData.name || 'User'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                                {userData.profilePic ? (
                                    <img src={userData.profilePic} alt="Profile" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            localStorage.removeItem('air_bnb_token');
                            setUserToken("token is null ", null)
                            setUserData(null);
                            navigate('/');
                        }}
                        className='flex items-center gap-1 border border-gray-300 rounded-full text-sm px-3 py-1.5 hover:bg-gray-100 transition-colors'
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Logout3</span>
                    </button>
                </div>
            </div>

            <div className='flex flex-col md:flex-row min-h-[calc(100vh-73px)]'>
                {/* Sidebar */}
                <aside className="w-full md:w-64 lg:w-72 border-r border-gray-200 bg-white md:min-h-[calc(100vh-73px)] flex flex-col">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">User Dashboard</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your listings and bookings</p>
                    </div>

                    {/* Stats */}
                    <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-200">
                        <div className="bg-rose-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-rose-600">{userData.totalPublicListings}</p>
                            <p className="text-xs text-gray-600 mt-1">Public Listings</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-blue-600">{userData.totalBookings}</p>
                            <p className="text-xs text-gray-600 mt-1">Total Bookings</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-3 space-y-1">
                        {sidebarLinks.map((item, index) => (
                            <NavLink
                                to={item.path}
                                key={index}
                                onClick={() => setCurrDashboard(index)}
                                className={
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ` +
                                    (currDashboard === index ?
                                        "bg-rose-50 text-rose-600 font-semibold shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100")
                                }
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ProfileShow

