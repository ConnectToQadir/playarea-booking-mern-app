import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import {SessionData} from '../context/Context'
import { useContext } from "react";


const Sidebar = () => {

  var {user} = useContext(SessionData)


  const [menu,setMenu] = useState( [
    {
      link: "/",
      name: "Dashboard",
      icon: "bx bx-home-alt relative z-1 text-lg",
    },
    {
      link: "/profile",
      name: "Profile",
      icon: "bx bx-user relative z-1 text-lg",
    },
    {
      link: "/bookings",
      name: "Bookings",
      icon: "bx bx-calendar relative z-1 text-lg",
    },
  ])



  useEffect(()=>{
    if(user){
      if(user.role == "admin"){
        var copy = menu
        copy.push(    {
          link: "/users",
          name: "Users",
          icon: "bx bx-group relative z-1 text-lg",
        })
        setMenu(copy)
      }
  
      if(user.role == "admin"|| user.role == "owner"){
        var copy = menu
        copy.push({
          link: "/playareas",
          name: "Playareas",
          icon: "bx bx-building-house relative z-1 text-lg",
        },)
        setMenu(copy)
      }
    }
  },[])

  const arrSettings = ["Profile", "Settings", "Logout"];
  return (
    <div className="min-h-screen max-h-screen w-14 border text-gray-800 bg-white hover:w-min group">
      <div className="flex items-center h-14 px-4 border-b">
        <i className="bx bxs-dashboard text-2xl text-indigo-600"></i>
        <span className="opacity-0 group-hover:opacity-100 ml-1 font-semibold transition -translate-x-2 group-hover:translate-x-0">
          {" "}
          Playease
        </span>
      </div>
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col px-2 py-4 space-y-1 transition-all">
          {menu?.map((v, i) => (
            <li key={i}>
              <Link to={v.link} className=" h-11 focus:outline-none">
                <div className="flex items-center relative p-2 hover:bg-indigo-50 hover:border-l-5 hover:text-zinc-900 rounded-lg text-zinc-600">
                  <i className={v.icon}></i>
                  <span className="ml-2 text-sm tracking-wide -translate-x-2 group-hover:translate-x-0 transition opacity-0  group-hover:opacity-100">
                    {v.name}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
