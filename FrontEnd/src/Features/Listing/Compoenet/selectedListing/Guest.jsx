import { useState } from "react";
import toast from "react-hot-toast";
import { useBooking } from "../../../Booking/Hooks/useBooking";
import { CircleX, UserRoundPen } from "lucide-react";


function Guest() {


    const [name, setName] = useState("");
    const [gender, setGender] = useState("Male");
    const [age, setAge] = useState(18);
    const [adharLast4, setAdharLast4] = useState("");
    const [guestFormshow, setGuestFormshow] = useState(false);


    const { guests, setGuests } = useBooking()


    const handleAddGuest = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (!age || Number(age) <= 0) {
            toast.error("Please enter a valid age");
            return;
        }
        if (!gender) {
            toast.error("Please select a gender");
            return;
        }

        setGuests((prevGuests) => [
            ...prevGuests,
            {
                name: name.trim(),
                age: Number(age),
                gender,
                adharLast4: adharLast4.trim(),
            },
        ]);
        setName("");
        setAge(18);
        setGender("Male");
        setAdharLast4("");
    };

    const removeGuest = (idx) => {
        setGuests((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <>
            <div className="border flex items-center justify-between border-gray-300 rounded-lg p-3 mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">GUESTS Form</label>
                {
                    guestFormshow ?
                        <CircleX color="#b22e2e" strokeWidth={2.5}
                            className='cursor-pointer'
                            onClick={(e) => {
                                e.preventDefault()
                                setGuestFormshow(!guestFormshow)
                            }}
                        />
                        :
                        <UserRoundPen color="#b22e2e"
                            className='cursor-pointer border-2 border-orange-600 rounded-full p-1 '
                            onClick={(e) => {
                                e.preventDefault()
                                setGuestFormshow(!guestFormshow)
                            }} />
                }

            </div>
            {
                guestFormshow &&
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                    <div className="space-y-4">
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-name">Name</label>
                                <input
                                    id="guest-name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter guest name"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className='flex-1'>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-adhar">Aadhaar Last 4 </label>
                                <input
                                    id="guest-adhar"
                                    type="text"
                                    maxLength={4}
                                    value={adharLast4}
                                    onChange={(e) => setAdharLast4(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="1234 Optional"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                        </div>

                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-age">Age</label>
                                <input
                                    id="guest-age"
                                    type="number"
                                    required
                                    min="1"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Enter age"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className='flex-1'>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="guest-gender">Gender</label>
                                <select
                                    id="guest-gender"
                                    required
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddGuest}
                            className="w-fit px-4  bg-orange-400  text-white py-1 rounded-lg font-medium transition-colors"
                        >
                            Add Guest
                        </button>
                    </div>

                    {guests.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Added Guests</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                {guests.map((guest, index) => (
                                    <li key={index} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                        <div className="flex justify-between gap-4 items-center">
                                            <span className="font-medium text-gray-900">{guest.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-700">{guest.age} yrs</span>

                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-4 text-gray-600 mt-2">
                                            <span>{guest.gender}</span>
                                            <CircleX
                                                type="button"
                                                onClick={() => removeGuest(index)}
                                                className="ml-2 inline-flex items-center justify-center h-7 rounded-full  text-red-600 cursor-pointer  size-1 w-3"
                                                aria-label={`Remove ${guest.name}`}
                                            />

                                            {guest.adharLast4 && (
                                                <span>{`Aadhaar: ${guest.adharLast4}`}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            }
        </>
    )
}

export default Guest
