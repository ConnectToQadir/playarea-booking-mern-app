import toast from "react-hot-toast";
import { SessionData } from "../../context/Context";
import { useContext, useState } from "react";
import axios from "axios";

const page = () => {
  var { user, setUser } = useContext(SessionData);
  var [editPhone, setEditPhone] = useState(true);
  var [phoneInput,setPhoneInput] = useState('')

  const [loading, setLoading] = useState(false);

  const ChangeProfilePic = async (e) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("upload_preset", "go9leens");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dngehao41/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const file = await res.json();
      setUser({ ...user, photo: file.secure_url });

      var resp = await axios.post(
        "http://localhost:4600/api/auth/update-profile/",
        { url: file.secure_url },
        {
          withCredentials: true,
        }
      );

      if (resp.data.success) {
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePhone = async (e) =>{
    e.preventDefault()
    try {

      var resp = await axios.post(
        `http://localhost:4600/api/auth/update-profile/?phone=${phoneInput}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (resp.data.success) {
        toast.success("Phone Updated Successfully");
        setUser({ ...user, phone: phoneInput });
        setPhoneInput("")
        setEditPhone(true)
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

 

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <div className="relative h-40 sm:h-80">
            <img
              className="w-full h-full object-cover rounded-md"
              src="https://img.freepik.com/free-vector/v915_53876-174949.jpg?w=1060&t=st=1697190099~exp=1697190699~hmac=1ee4735678a5ac8c50bad840d45e42f8de770678f08caf721d7c316bdb398df1"
              alt=""
            />
          </div>
          <div className="left-[6%] w-[88%] top-[-30px] relative flex flex-col items-center sm:flex-row sm:items-center">
            <div className="mb-5 sm:mb-0">
              <div className="relative">
                <div className="w-32 h-32  border-[2px] border-gray-300 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      user?.photo ||
                      "https://www.emmegi.co.uk/wp-content/uploads/2019/01/User-Icon.jpg"
                    }
                    alt=""
                  />
                </div>
                <label
                  htmlFor="file"
                  className="absolute w-6 h-6 flex justify-center items-center cursor-pointer rounded-full border-gray-300 bg-white border z-10 text-[13px] top-1 right-1"
                >
                  <i className="bx bx-edit text-base"></i>
                  {/* Edit */}
                </label>
                <input
                  onChange={ChangeProfilePic}
                  type="file"
                  id="file"
                  className="sr-only"
                />
              </div>
            </div>
            <div className="sm:ml-5 text-center sm:text-left">
              <h2 className="font-semibold text-lg sm:text-2xl flex items-center">
                {user?.name}
              </h2>
              <p className="text-sm text-slate-800">{user?.role}</p>
            </div>
          </div>

          <div className="px-4 lg:px-0 grid sm:grid-cols-2 gap-4">
            <div className="flex items-center p-3 border rounded-lg">
              <div className="hexagon p-2 rounded-md mr-3 flex justify-center items-center bg-gray-200">
                <i className={`bx text-indigo-600 text-2xl bx-phone`}></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-sm line-clamp-1 font-semibold">
                  {editPhone ? (
                    <div className="flex items-center">
                      {user?.phone || "Null"}
                      <i
                        onClick={() => {setEditPhone(false);user.phone && setPhoneInput(user.phone)}}
                        className="bx ml-2 cursor-pointer bx-edit text-gray-600 text-lg"
                      ></i>
                    </div>
                  ) : (
                    <form onSubmit={updatePhone}>
                      <input
                      required
                      value={phoneInput}
                      onChange={(e)=>setPhoneInput(e.target.value)}
                        type="number"
                        className="text-sm p-1 border-gray-200 rounded-md mr-1"
                      />
                      <button className="border bg-indigo-600 text-white rounded-md p-1">
                        Update
                      </button>
                    </form>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 border rounded-lg">
              <div className="hexagon p-2 rounded-md mr-3 flex justify-center items-center bg-gray-200">
                <i className={`bx text-indigo-600 text-2xl bx-envelope`}></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm line-clamp-1 font-semibold">
                  {user?.email || "Null"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
