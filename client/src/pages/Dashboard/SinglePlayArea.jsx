import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import toast from "react-hot-toast";

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

const SinglePlayArea = () => {
  var [playarea, setPlayarea] = useState("");
  var { pathname } = useLocation();
  var navigate = useNavigate();
  var [loadAgain, setLoadAgain] = useState(false);

  const fetchPlayarea = async () => {
    var res = await axios.get(
      `http://localhost:4600/api/playareas/${pathname.split("/")[2]}`
    );
    setPlayarea(res.data.message);
  };

  console.log(playarea)

  useEffect(() => {
    fetchPlayarea();
  }, [loadAgain]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDay, setSelectedDay] = useState({});
  const [loading, setLoading] = useState(false);


  var [startTime,setStartTime] = useState("")
  var [endTime,setEndTime] = useState("")

  function calCulatePrice(time1, time2) {
    // Split the times into hours and minutes
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
  
    // Calculate the total minutes for each time
    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;
  
    // Calculate the absolute difference in minutes
    const differenceInMinutes = Math.abs(totalMinutes1 - totalMinutes2);
  
    return (differenceInMinutes * (playarea.pricePerHour / 60));
  }


  const BookPlayarea = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4600/api/bookings",
        {
          price: calCulatePrice(startTime,endTime).toFixed(2),
          startTime,
          endTime,
          bookingDate: selectedSlot,
          playarea: playarea._id,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setTimeout(() => {
          toast.success(res.data.message);
          navigate("/bookings");
        }, 2000);
      }
    } catch (error) {
      // toast.error(error.response?.data?.message);
      navigate("/signup");
      return;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  // Reviews

  const [reviewData, setReviewData] = useState({
    NoOfreviews: "",
    comment: "",
  });

  // const [newReviews, setNewReviews] = useState([...course.reviews])

  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const [AllIns, setAllIns] = useState([]);
  const inputHandler = (e) => {
    const { value, name } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const submiteData = async (e) => {
    e.preventDefault();
    console.log(reviewData);
    try {
      const res = await axios.post(
        `http://localhost:4600/api/playareas/review/${playarea._id}`,
        reviewData,
        { withCredentials: true }
      );
      toast.success("Review Added Successfully!");
      setReviewData({
        NoOfreviews: "",
        comment: "",
      });
      setLoadAgain(!loadAgain);
    } catch (e) {
      console.log(e);
      toast.error("Please create your account First");
      // window.location.replace("/login");
    }
  };


  return (
    <div>
      <div className="">
        <div className="pt-6">
          <div className="mx-auto mt-6 max-w-2xl lg:max-w-7xl sm:px-6">
            <div className="border h-96 rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={playarea.images?.length ? playarea.images[0] : ""}
                alt=""
              />
            </div>
            <div className="grid grid-cols-6 gap-4 my-5">
              {playarea?.images?.slice(1, 10).map((v, i) => {
                return (
                  <div key={i} className="h-40">
                    <img
                      className="rounded-md w-full h-full object-cover"
                      src={v}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">


              <div className="flex gap-2 mb-2 items-center">
                <img
                  className="w-8 h-8 object-cover rounded-full"
                  src={playarea.owner?.photo}
                  alt=""
                />
                <p>{playarea.owner?.name}</p>
              </div>

              <div className="mb-10 text-sm">
                <p><span className="font-semibold">Owner Contact:</span> {playarea.owner?.phone}</p>
                
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {playarea.title}
              </h1>
              <p className="text-sm font-medium text-indigo-600 mt-2">
                {playarea?.type}
              </p>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                Rs {playarea.pricePerHour}
                <span className="text-lg ml-1 tracking-[.5px]">/hr</span>
              </p>

              {/* Reviews */}
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex text-indigo-600 items-center">
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star"></i>
                    <i className="bx bxs-star-half"></i>
                  </div>
                </div>
              </div>

              <form onSubmit={BookPlayarea} className="mt-10">
                <p className="text-base mb-4">Select Booking Slot</p>
                <div className="grid gap-4 mb-6 overflow-hidden relative grid-cols-5">
                  {playarea?.nextSlots?.map((v, i) => {
                    return (
                      <label
                        key={i}
                        title={v.isBooked ? "Booked" : ""}
                        className={`text-xs ${
                          v.isBooked ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                        htmlFor={i}
                      >
                        <input
                          id={i}
                          disabled={v.isBooked}
                          name="bookingDate"
                          onChange={(e) => {
                            setSelectedSlot(e.target.value);
                            var d = playarea.openingHours.filter((a) =>
                              a.day.startsWith(v.day)
                            )[0];
                            setSelectedDay(d);
                          }}
                          className="bookingDate sr-only"
                          type="radio"
                          value={v.jsDate}
                          required
                        />
                        <div
                          className={`hi rounded-lg select-none ${
                            v.isBooked
                              ? "text-gray-400 border-gray-300"
                              : "border-gray-300"
                          } p-2 border flex flex-col items-center`}
                        >
                          <p className="mb-1">{v.day}</p>
                          <p className="whitespace-nowrap uppercase font-semibold">{`${v.date} ${v.month}`}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selectedSlot ? (
                  <div className="border p-3 rounded-md">
                    <p className="font-semibold mb-1">Date</p>
                    <p>Date : {new Date(selectedSlot).toDateString()}</p>

                    <p className="font-semibold mt-4 mb-1">
                      {playarea.type} Timmings
                    </p>
                    <p>From : {convertTo12HourFormat(selectedDay.startTime)}</p>
                    <p>To &nbsp; &nbsp; &nbsp;: {convertTo12HourFormat(selectedDay.endTime)}</p>

                    <p className="font-semibold mt-4 mb-2">
                      Select Booking Timmings
                    </p>

                    <div className="grid gap-2 grid-cols-2">
                      <label className="" htmlFor="">Start Time</label>
                      <input onChange={(e)=>setStartTime(e.target.value)} value={startTime} type="time" min={selectedDay.startTime} max={selectedDay.endTime} required className="p-1 border-gray-300 rounded-md" />

                      <label className="" htmlFor="">End Time</label>
                      <input onChange={(e)=>setEndTime(e.target.value)} value={endTime} type="time" min={selectedDay.startTime} max={selectedDay.endTime} required className="p-1 border-gray-300 rounded-md" />
                    </div>
                    



                    <p className="font-semibold mt-4 mb-1">Total Amount</p>
                    <p className="text-2xl flex font-semibold text-green-600 items-center">
                      Rs : {calCulatePrice(startTime,endTime).toFixed(2) == "NaN" ? <p className="text-sm text-red-600 ml-2">Select Valid Timings First!</p> : calCulatePrice(startTime,endTime).toFixed(2)}
                    </p>

                  </div>
                ) : null}

                <button
                  disabled={loading}
                  type="submit"
                  className="disabled:cursor-not-allowed opacity-75 flex w-full mt-6 items-center justify-center rounded-md border border-transparent bg-indigo-500 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {loading ? "Processing..." : "Book Now"}
                </button>
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    <i className="bx bx-location-plus mr-2 text-xl text-indigo-600"></i>
                    {playarea?.address?.street}
                    {", "}
                    {playarea?.address?.city}
                    {", "}
                    {playarea?.address?.zip}
                    {", "}
                    {playarea?.address?.state}
                    {", "}
                    {playarea?.address?.country}
                  </p>
                </div>
              </div>

              {/* <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Facilities
                </h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    {product.highlights.map((highlight) => (
                      <li key={highlight} className="text-gray-400">
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}

              {/* reviews here */}
              <h2 className="mt-20 font-semibold text-xl">Reviews</h2>

              {playarea?.reviews?.map((review) => {
                return (
                  <div className="flex gap-4 py-4">
                    <img
                      className="w-12 h-12 object-cover rounded-full"
                      src={review.commentingUser.photo}
                      alt=""
                    />
                    <div className="border-b pb-6 mb-4">
                      <h3>{review.commentingUser.name}</h3>
                      <p className="text-xs text-gray-500 mb-6">
                        July 19, 2023
                      </p>
                      <div className="mt-1 text-blue-500 text-lg mb-4">
                        <StarRatings
                          className="activeStar"
                          rating={review.NoOfreviews}
                          starDimension="16px"
                          starSpacing="4px"
                          starRatedColor="#4f46e5"
                        />
                      </div>
                      <p className="text-sm text-gray-500">{review?.comment}</p>
                    </div>
                  </div>
                );
              })}

              {/* Post Reviews */}
              <form onSubmit={submiteData} method="POST">
                <div className="instructor-review sr-only">
                  <div className="reviewsInput">
                    {/* <label htmlFor="NoOfReviews">No Of Reviews</label> */}
                    <input
                      type="number"
                      name="NoOfreviews"
                      onChange={inputHandler}
                      value={reviewData?.NoOfreviews}
                      placeholder="Stars Ratings"
                      min="1"
                      id="NoOfReviews"
                      max="5"
                      required
                    />
                  </div>
                </div>

                <p
                  style={{ marginTop: "5px", color: "white" }}
                  className="Reviews-main-para-rating"
                >
                  Your Ratings
                </p>
                <div className="my-3 flex">
                  {[...Array(5)]?.map((star, index) => {
                    const currentRating = index + 1;

                    return (
                      <label>
                        <FaStar
                          className="star"
                          size={20}
                          color={
                            currentRating <= (hover || rating)
                              ? "rgb(230, 67, 47)"
                              : "#c8c8c8"
                          }
                          onMouseEnter={() => setHover(currentRating)}
                          onMouseLeave={() => setHover(null)}
                        />
                        <input
                          type="radio"
                          className="opacity-0"
                          name="NoOfreviews"
                          onClick={() => setRating(currentRating)}
                          value={(reviewData.NoOfreviews = rating)}
                        />
                      </label>
                    );
                  })}
                </div>

                <textarea
                  className="w-full border border-gray-300"
                  name="comment"
                  required
                  onChange={inputHandler}
                  value={reviewData.comment}
                  id="comment"
                  cols="30"
                  placeholder="Comment"
                  rows="3"
                ></textarea>

                <div>
                  <button className="bg-indigo-500 py-2 px-3 rounded-md text-sm font-semibold text-white">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayArea;
