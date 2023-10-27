import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { SessionData } from "../../context/Context";
import { useContext } from "react";
import { Link } from "react-router-dom";

function convertTo12HourFormat(time24) {
  // Split the time into hours and minutes
  const [hours, minutes] = time24.split(':');

  // Parse hours and minutes as integers
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  // Determine whether it's AM or PM
  const period = hour < 12 ? 'AM' : 'PM';

  // Convert the hour to 12-hour format
  const hour12 = hour % 12 || 12;

  // Create the 12-hour time string
  const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;

  return time12;
}

const Bookings = () => {
  var { user } = useContext(SessionData);

  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  function fomateDate(bookingDate) {
    bookingDate = new Date(bookingDate);
    var month = monthNames[bookingDate.getMonth()];
    var day = bookingDate.getDate();
    var year = bookingDate.getFullYear();
    var formattedDate = month + " " + day + ", " + year;
    return formattedDate;
  }
  var [bookings, setBookings] = useState([]);
  var [loadAgain, setLoadAgain] = useState(false);

  var getBookings = async () => {
    var res = await axios.get("http://localhost:4600/api/bookings", {
      withCredentials: true,
    });
    setBookings(res.data.message);
  };

  useEffect(() => {
    getBookings();
  }, [loadAgain]);

  // Confirm and Pending status handler
  const confirmBooking = async (id) => {
    try {
      var res = await axios.get(
        `http://localhost:4600/api/bookings/change-booking-status/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      setLoadAgain(!loadAgain);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancleBooking = async (id) => {
    try {
      var res = await axios.get(
        `http://localhost:4600/api/bookings/change-booking-status/${id}?cancle=true`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setLoadAgain(!loadAgain);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto border rounded-lg">
        <div className="bg-white p-4">
          <h2 className="text-xl font-semibold">
            All <span className="text-indigo-600">Bookings</span>
          </h2>
        </div>
        <table className="text-sm min-w-[1000px] w-full text-left text-gray-500">
          <thead className="text-xs text-gray-700 bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Playarea
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Timings
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Owner
              </th>
              <th scope="col" className="px-6 py-3">
                Booking User
              </th>
              <th scope="col" className="px-6 py-3">
                Booking Date
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((v, i) => {
              return (
                <tr key={i} className="bg-white border-b">
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <Link className="flex items-center hover:text-indigo-600" to={`/playareas/${v.playarea[0]._id}`}>
                    <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={v.playarea[0].images[0]}
                        alt=""
                      />
                    </div>
                    {v.playarea[0].title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-semibold text-black">
                    Rs {v.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-black text-center">
                    {v.startTime && convertTo12HourFormat(v.startTime)} to {v.endTime && convertTo12HourFormat(v.endTime)}
                  </td>
                  <td className={`px-6 py-4 flex capitalize items-center`}>
                    <div
                      className={`w-2 h-2 mr-1 rounded-full ${
                        v.status == "confirmed" && "bg-green-600"
                      } ${v.status == "pending" && "bg-yellow-600"} ${
                        v.status == "cancelled" && "bg-red-600"
                      }`}
                    ></div>
                    {v.status}
                  </td>
                  <td className="px-6 py-4">{v.owner[0].name}</td>
                  <td className="px-6 py-4">{v.bookingUser[0].name}</td>
                  <td className="px-6 py-4">{fomateDate(v.bookingDate)}</td>

                  <td className="px-6 py-4 flex items-center justify-center text-lg text-center">
                    {user.role != "customer" ? (
                      <>
                        <i
                          onClick={() => confirmBooking(v._id)}
                          title={
                            v.status == "pending"
                              ? "Confirm Booking"
                              : "Again To Pending"
                          }
                          className={`${
                            v.status == "pending"
                              ? "bx bx-check-square text-green-600"
                              : "bx bx-checkbox-minus text-yellow-600 text-[23px]"
                          } p-1 cursor-pointer hover:bg-gray-100 rounded-full`}
                        ></i>
                        {/* <i
                          title="Delete"
                          className="bx p-1 cursor-pointer hover:bg-gray-100 rounded-full bx-trash text-red-600"
                        ></i> */}
                      </>
                    ) : null}

                    <i
                      onClick={() => cancleBooking(v._id)}
                      title="Cancel Booking"
                      className="bx bx-shield-x p-1 cursor-pointer hover:bg-gray-100 rounded-full text-orange-600"
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
