import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { SessionData } from "../../context/Context";

const Playareas = () => {
  var { user } = useContext(SessionData);

  var [playareas, setPlayareas] = useState([]);
  const [loadAgain, setLoadAgain] = useState(false);
  var [showForm, setShowForm] = useState(false);

  var fetchPlayareas = async () => {
    var res = await axios.get(
      `http://localhost:4600/api/playareas${
        user?.role == "owner" ? `?owner=${user?._id}` : ""
      }`
    );
    setPlayareas(res.data.message);
  };

  useEffect(() => {
    if (user) {
      fetchPlayareas();
    }
  }, [loadAgain, user]);

  // Add Playarea Start ------------------------------------------------------------------------>
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var [data, setData] = useState({
    address: {
      zip: "",
      country: "",
      state: "",
      city: "",
      street: "",
    },
    title: "",
    images: [],
    pricePerHour: "",
    type: "",
    openingHours: [],
  });

  var dataChangeHandler = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    var type = e.target.type;

    if (name.startsWith("address")) {
      setData({
        ...data,
        address: {
          ...data.address,
          [name.split(".")[1]]: value,
        },
      });
      return;
    }

    if (name.startsWith("openingHours")) {
      if (type === "checkbox") {
        var copy = data.openingHours;
        if (e.target.checked) {
          copy.push({
            day: value,
            startTime: "",
            endTime: "",
          });
        } else {
          copy = copy.filter((v) => v.day != value);
        }
        setData({ ...data, openingHours: copy });
      } else {
        var targetDay = data.openingHours.filter(
          (v) => v.day == name.split(".")[1]
        );
        var otherDays = data.openingHours.filter(
          (v) => v.day != name.split(".")[1]
        );
        targetDay[0][name.split(".")[2]] = value;
        setData({ ...data, openingHours: [...targetDay, ...otherDays] });
      }
      return;
    }

    setData({ ...data, [name]: value });
  };

  var resetData = () => {
    setData({
      address: {
        zip: "",
        country: "",
        state: "",
        city: "",
        street: "",
      },
      title: "",
      images: [],
      pricePerHour: "",
      type: "",
      openingHours: [],
    });
  };

  var [tempImages, setTempImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadImages = async () => {
    const images = [];
    try {
      setLoading(true);
      for (let i = 0; i < tempImages.length; i++) {
        const data = new FormData();
        data.append("file", tempImages[i]);
        data.append("upload_preset", "go9leens");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dngehao41/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const file = await res.json();
        images.push(file.secure_url);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      return images;
    }
  };

  const submitPlayarea = async (e) => {
    e.preventDefault();

    try {
      var res
      if (!editMode) {
        let uploadedImgUrls = await uploadImages();
        if (!uploadedImgUrls.length) {
          toast.error("No images selected yet!");
          return;
        }
        res = await axios.post(
          "http://localhost:4600/api/playareas",
          { ...data, images: uploadedImgUrls },
          { withCredentials: true }
        );
      } else {
        res = await axios.put(
          `http://localhost:4600/api/playareas/${data._id}`,
          data,
          { withCredentials: true }
        );
      }

      if (res.data.success) {
        resetData();
        setLoadAgain(!loadAgain);
        setTempImages([]);
        setShowForm(false);
        toast.success("Task Done");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Add Playarea End   ------------------------------------------------------------------------>

  const deletePlayarea = async (id) => {
    try {
      if (window.confirm("Are you sure to delete this Playarea")) {
        let res = await axios.delete(
          `http://localhost:4600/api/playareas/${id}`,
          { withCredentials: true }
        );
        res && toast.success("Playarea Deleted Successfully!");
        setLoadAgain(!loadAgain);
      }
    } catch (error) {
      toast.error("Something Went Wrong!");
    }
  };

  // Confirm and Pending status handler
  const changeApproveStatus = async (id) => {
    try {
      var res = await axios.get(
        `http://localhost:4600/api/playareas/change-approve-stutus/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      setLoadAgain(!loadAgain);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Editing Playarea
  const [editMode, setEditMode] = useState(false);
  const setPlayareaEditEnv = (p) => {
    setEditMode(true);
    setData(p);
    setShowForm(true);
  };

  console.log(data);

  useEffect(() => {
    if (showForm == false) {
      resetData();
      setEditMode(false);
    }
  }, [showForm]);

  return (
    <div className="relative h-full">
      <div>
        <div
          style={{
            visibility: showForm ? "visible" : "hidden",
            opacity: showForm ? "1" : "0",
            transition: ".4s",
          }}
          className="fixed z-10 top-0 left-0 w-full h-screen border-red-600 backdrop-blur-[2px] bg-[#00000094] overflow-auto"
        >
          <form
            onSubmit={submitPlayarea}
            style={{ transition: ".7s" }}
            className={`${
              showForm ? "scale-100 opacity-100" : "scale-0 opacity-0"
            } bg-white mx-auto my-8 relative p-4 max-w-4xl border rounded-lg`}
          >
            <i
              onClick={() => setShowForm(false)}
              class="bx bx-x text-2xl cursor-pointer absolute top-4 right-4"
            ></i>

            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-xl font-semibold">
                  {editMode ? "Edit" : "Add"}{" "}
                  <span className="text-indigo-600">Playareas</span>
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Playarea Title
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                        <input
                          required
                          type="text"
                          value={data.title}
                          onChange={dataChangeHandler}
                          name="title"
                          id="title"
                          autoComplete="title"
                          className="block flex-1 p-2 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Title Here"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Playarea Type
                    </label>
                    <div className="mt-2">
                      <select
                        required
                        value={data.type}
                        onChange={dataChangeHandler}
                        id="type"
                        name="type"
                        autoComplete="type"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Category</option>
                        <option>Playground</option>
                        <option>Playland</option>
                        <option>Playstation</option>
                        <option>Farmhouse</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      for="pricePerHour"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Price / Hour
                    </label>
                    <div class="mt-2">
                      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          Rs
                        </span>
                        <input
                          required
                          value={data.pricePerHour}
                          onChange={dataChangeHandler}
                          type="number"
                          name="pricePerHour"
                          id="pricePerHour"
                          autocomplete="pricePerHour"
                          class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Playarea Images
                    </label>

                    {!(tempImages.length || editMode) ? (
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <i class="bx bx-images text-5xl text-gray-300"></i>
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload Images</span>
                              <input
                                required
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) => setTempImages(e.target.files)}
                                multiple
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4  gap-4 my-4">
                        {data.images.length
                          ? data.images.map((v, i) => {
                              return (
                                <div
                                  key={i}
                                  className="rounded-lg border h-52 relative overflow-hidden"
                                >
                                  <i
                                    onClick={() => {
                                      var copy = data.images;
                                      copy.splice(i, 1);
                                      setData({ ...data, images: copy });
                                    }}
                                    className="bx bx-x absolute top-1 p-[2px] rounded-full shadow-md cursor-pointer text-white bg-indigo-600 right-1"
                                  ></i>
                                  <img
                                    className="h-full object-cover w-full"
                                    src={v}
                                    alt=""
                                  />
                                </div>
                              );
                            })
                          : Object.keys(tempImages).map((v, i) => {
                              return (
                                <div
                                  key={i}
                                  className="rounded-lg border h-52 relative overflow-hidden"
                                >
                                  <i
                                    onClick={() => {
                                      var copy = Object.keys(tempImages).map(
                                        (v, i) => {
                                          return tempImages[v];
                                        }
                                      );
                                      copy.splice(i, 1);
                                      setTempImages(copy);
                                    }}
                                    className="bx bx-x absolute top-1 p-[2px] rounded-full shadow-md cursor-pointer text-white bg-indigo-600 right-1"
                                  ></i>
                                  <img
                                    className="h-full object-cover w-full"
                                    src={URL.createObjectURL(tempImages[v])}
                                    alt=""
                                  />
                                </div>
                              );
                            })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Address Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Country
                    </label>
                    <div className="mt-2">
                      <select
                        value={data.address.country}
                        onChange={dataChangeHandler}
                        id="country"
                        name="address.country"
                        autoComplete="country-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Country</option>
                        <option>Pakistan</option>
                        <option>India</option>
                        <option>Bangladesh</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="text"
                        value={data.address.street}
                        onChange={dataChangeHandler}
                        name="address.street"
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="text"
                        value={data.address.city}
                        onChange={dataChangeHandler}
                        name="address.city"
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        required
                        type="text"
                        value={data.address.state}
                        onChange={dataChangeHandler}
                        name="address.state"
                        id="region"
                        autoComplete="address-level1"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ZIP / Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        value={data.address.zip}
                        onChange={dataChangeHandler}
                        name="address.zip"
                        id="postal-code"
                        autoComplete="postal-code"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Opening Hours
                </h2>

                <p className="mt-1 text-sm mb-5 leading-6 text-gray-600">
                  Select opening days and time also.
                </p>

                <div className="space-y-10">
                  <fieldset>
                    <div className="mt-4 space-y-6">
                      {days.map((v, i) => {
                        return (
                          <div
                            key={i}
                            className="relative border p-3 rounded-lg gap-x-3"
                          >
                            <div className="flex h-6 items-center">
                              <input
                                onChange={dataChangeHandler}
                                id={v}
                                value={v}
                                checked={data.openingHours.find(
                                  (value) => value.day == v
                                )}
                                name={`openingHours.${v}`}
                                type="checkbox"
                                className="h-4 w-4 mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor={v}
                                className="font-medium flex-1 text-gray-900"
                              >
                                {v}
                              </label>
                            </div>
                            {data.openingHours.find((d) => d.day == v) && (
                              <div className="text-sm flex justify-between mt-4 leading-6">
                                <div className="flex items-center">
                                  <label className="text-sm font-medium whitespace-nowrap mr-4 leading-6 text-gray-900">
                                    Opening
                                  </label>
                                  <input
                                    required
                                    value={
                                      data.openingHours.find((d) => d.day == v)
                                        .startTime
                                    }
                                    onChange={dataChangeHandler}
                                    name={`openingHours.${v}.startTime`}
                                    type="time"
                                    autoComplete="address-level2"
                                    className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <label className="text-sm font-medium whitespace-nowrap mr-4 leading-6 text-gray-900">
                                    Closing
                                  </label>
                                  <input
                                    required
                                    value={
                                      data.openingHours.find((d) => d.day == v)
                                        .endTime
                                    }
                                    onChange={dataChangeHandler}
                                    name={`openingHours.${v}.endTime`}
                                    type="time"
                                    autoComplete="address-level2"
                                    className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="reset"
                disabled={loading}
                className="text-sm disabled:cursor-not-allowed font-semibold leading-6 text-gray-900"
              >
                Reset
              </button>
              <button
                disabled={loading}
                type="submit"
                className="rounded-md disabled:cursor-not-allowed bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Added Playareas --------------------------------- */}
        <div className="overflow-x-auto border rounded-lg">
          <div className="bg-white p-4">
            <h2 className="text-xl font-semibold">
              Added <span className="text-indigo-600">Playareas</span>
            </h2>
          </div>
          <table className="text-sm min-w-[1000px] w-full text-left text-gray-500">
            <thead className="text-xs text-gray-700 bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Playarea
                </th>
                <th scope="col" className="px-6 py-3">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Approval
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Price / Hour
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {playareas.map((v, i) => {
                return (
                  <tr key={v._id} className="bg-white border-b">
                    <td
                      scope="row"
                      className="px-6 flex items-center py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={v.images[0]}
                          alt=""
                        />
                      </div>
                      <Link
                        className="hover:text-indigo-600"
                        to={`/playareas/${v._id}`}
                      >
                        {v.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{v.owner[0].name}</td>
                    <td className="px-6 py-4">{v.type}</td>
                    <td className={`px-6 py-4`}>
                      <span
                        className={`${
                          v.isApproved
                            ? "text-green-500 border-green-500"
                            : "text-red-500 border-red-500"
                        } border py-1 px-2 rounded-md`}
                      >
                        {v.isApproved ? "Approved" : "Not Approved"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${
                          v.isActive
                            ? "text-green-500 border-green-500"
                            : "text-red-500 border-red-500"
                        } border py-1 px-2 rounded-md`}
                      >
                        {v.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">Rs {v.pricePerHour}</td>
                    <td className="px-6 py-4 text-lg text-center">
                      {user.role == "admin" && (
                        <i
                          onClick={() => changeApproveStatus(v._id)}
                          title={
                            v.isApproved
                              ? "Change Approval to Not Approved"
                              : "Approve Playarea"
                          }
                          className={`${
                            v.isApproved
                              ? "bx bx-checkbox-minus text-yellow-600 text-[23px]"
                              : "bx bx-check-square text-green-600"
                          } p-1 cursor-pointer hover:bg-gray-100 rounded-full`}
                        ></i>
                      )}

                      <i
                        title="Edit"
                        onClick={() => setPlayareaEditEnv(v)}
                        className="bx p-1 hover:bg-gray-100 rounded-full  bx-edit text-indigo-600"
                      ></i>

                      <i
                        onClick={() => deletePlayarea(v._id)}
                        title="Delete"
                        className="bx p-1 hover:bg-gray-100 rounded-full bx-trash text-red-600"
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <i
        onClick={() => setShowForm(true)}
        className="bx hover:bg-indigo-500 transition cursor-pointer bx-plus shadow-lg w-14 h-14 flex justify-center items-center rounded-[50%] bg-indigo-600 text-xl text-white fixed right-10 bottom-10"
      >
        <span
          style={{
            clipPath:
              "polygon(90% 0, 100% 50%, 90% 100%, 0% 100%, 0 50%, 0% 0%)",
          }}
          className="absolute slidRight pl-2 pr-4 rounded-md whitespace-nowrap top-[50%] -translate-y-1/2 text-sm p-1 bg-indigo-600 right-[120%]"
        >
          Click to Add Playarea
        </span>
      </i>
    </div>
  );
};

export default Playareas;
