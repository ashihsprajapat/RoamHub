import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';

import AppContext from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { useAuth } from '../../Features/Auth/Hooks/useAuth';

function Navbar() {
    const [open, setOpen] = useState(false);

    const { navigate, setMenuBarShow, } =
        useContext(AppContext);

    const { userData, setState } = useAuth()

    return (
        <nav className="flex  items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3 border-b border-gray-300 bg-white relative">

            {/* Logo */}
            <NavLink to="/">
                <img
                    className="h-12 w-auto rounded-lg  cursor-pointer object-contain transition-transform duration-200 hover:scale-105"
                    src={assets.RoamHub}
                    alt="logo"
                    onClick={() => navigate('/')}
                />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">

                {/* Search */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                    />
                </div>
                {
                    userData?.verify ?
                        <NavLink to="/host/homes" className="relative group font-semibold text-gray-700 hover:text-gray-900">
                            <span className="inline-flex items-center gap-1">
                                Host Your Room
                                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 scale-x-0 bg-gray-900 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                            </span>
                        </NavLink>
                        : (userData &&
                            <NavLink className={`text-red-500 border border-gray-600 bg-gray-300 px-7 rounded-3xl font-semibold cursor-pointer hover:bg-gray-200 py-1
                        `} to="/verify-email">Verify Email</NavLink>)
                }



                {/* Profile / Login */}
                {userData ? (
                    <div
                        onClick={() => {
                            setMenuBarShow(true);
                            navigate(`/profile/${userData.id}/all-listings`);
                        }}
                        className="bg-blue-700 px-3 py-1.5 rounded-full text-white font-semibold cursor-pointer hover:bg-blue-600"
                    >
                        {userData.name[0].toUpperCase()}
                    </div>
                ) : (
                    <button
                        className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
                        onClick={() => {
                            setState('Login');
                            navigate('/auth');
                        }}
                    >
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                className="sm:hidden"
            >
                <svg width="21" height="15" viewBox="0 0 21 15">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {/* Mobile Menu */}
            <div
                className={`${open ? 'flex' : 'hidden'
                    } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col gap-3 px-5 text-sm sm:hidden`}
            >
                {
                    userData?.verify ?
                        <NavLink to="/host/homes" className="relative group hover:text-gray-900" onClick={() => setOpen(false)}>
                            <span className="inline-flex items-center gap-1">
                                Host Your Room
                                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 scale-x-0 bg-gray-900 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                            </span>
                        </NavLink>
                        :
                        <NavLink className={`text-red-500 border border-gray-600 bg-gray-300 px-7 rounded-3xl font-semibold cursor-pointer hover:bg-gray-200 py-1
                        `} to="/verify-email">Verify Email</NavLink>
                }



                {userData ? (
                    <div
                        className="bg-blue-700 px-3 py-1.5 rounded-full text-white font-semibold cursor-pointer hover:bg-blue-600 w-fit"
                        onClick={() => {
                            setMenuBarShow(true);
                            navigate(`/profile/${userData.id}/all-listings`);
                            setOpen(false);
                        }}
                    >
                        {userData.name[0].toUpperCase()}
                    </div>
                ) : (
                    <button
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-fit"
                        onClick={() => {
                            setState('Login');
                            navigate('/auth');
                            setOpen(false);
                        }}
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
