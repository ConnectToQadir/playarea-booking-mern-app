import { useState, useEffect } from "react";
import axios from "axios";
import { Link,useLocation } from "react-router-dom";


const Home = () => {

  var location = useLocation()
  var [playareas, setPlayareas] = useState([]);



  var fetchPlayareas = async () => {
    var res = await axios.get(`http://localhost:4600/api/playareas?${location?.search?.split("?")[1]}&isApproved=true`);
    setPlayareas(res.data.message);
  };

  

  useEffect(() => {
    fetchPlayareas();
  }, [location]);

  return (
    <div>
      <div className="">
        <div className="mx-auto max-w-[1200px] py-5 sm:py-10">
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {playareas.length ? playareas.map((product) => (
              <div
                key={product._id}
                className="group relative border border-gray-200 overflow-hidden bg-white rounded-md"
              >
                <div className="h-60 overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-75">
                  <img
                    src={product.images[0]}
                    alt={product.imageAlt}
                    className="relative h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                  <span className="absolute top-3 right-3 bg-indigo-500 text-white p-1 px-3 rounded-md">
                    Rs {product.pricePerHour}<span className="text-sm">/hr</span>
                  </span>
                </div>
                <div className="px-4">
                  {/* Price */}
                  <div className="pb-2 pt-4 flex items-center justify-between">
                    {/* Profile */}
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-8 h-8 object-cover rounded-full"
                        src={product.owner[0].photo}
                        alt=""
                      />
                      <p>{product.owner[0].name}</p>
                    </div>
                    <p className="text-lg text-indigo-500">
                      <i class="bx bxs-star"></i>
                      <i class="bx bxs-star"></i>
                      <i class="bx bxs-star"></i>
                      <i class="bx bxs-star"></i>
                      <i class="bx bxs-star-half"></i>
                    </p>
                  </div>
                  <div className="mb-4 pt-2">
                    <h3 className="text-md font-semibold text-gray-700 line-clamp-2">
                      <Link to={`/playareas/${product._id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </Link>
                    </h3>
                    <p className="text-sm">{product.type}</p>
                  </div>
                </div>
              </div>
            ))
              :
              <h1>No Playarea Uploaded Yet</h1>
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
