import {useState} from "react";
import toast from "react-hot-toast";
import { Link,useNavigate } from "react-router-dom";

const Login = () => {

  var navigate = useNavigate()
  var [loading,setLoading] = useState(false)


  var [data, setData] = useState({
    email: "",
    password: "",
  });

  const dataChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      var res = await fetch(
        "http://localhost:4600/api/auth/login",
        
        {
          method:"POST",
          credentials: "include",
          headers:{
            'content-type':"application/json"
          },
          body:JSON.stringify(data)
        }
      );

      res = await res.json()

      if(res.success) {
        setTimeout(() => {
          toast.success(res.message);
          navigate('/profile')
        },2000);
      }else{
          toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setTimeout(() => {
        setLoading(false)
      },2000);
    }
  };

  return (
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full text-center sm:max-w-sm">
          <i className="bx bxs-dashboard text-4xl text-indigo-600"></i>
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={submitData} className="space-y-6">
          <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                value={data.email}
                  onChange={dataChangeHandler}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`block w-full text-gray-900 border-0 rounded-md py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                value={data.password}
                  onChange={dataChangeHandler}
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
              disabled={loading}
                type="submit"
                className="flex w-full disabled:cursor-not-allowed justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading?"Processing...":"Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not have an account?
            <Link
              to="/signup"
              className="font-semibold leading-6 ml-2 text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
