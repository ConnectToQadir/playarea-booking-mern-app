import { Fragment,useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import { SessionData } from "../context/Context";
import { useContext } from "react";
import {useNavigate} from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const signOut = async () => {
  try {
    // if (!window.confirm("Are you sure to logout?")) {
    //   return;
    // }
    var res = await axios.get("http://localhost:4600/api/auth/logout", {
      withCredentials: true,
    });
    if (res.data.success) {
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.replace("/login");
      }, 2000);
    }
  } catch (error) {
    // console.log(error)
    toast.error(error.response.data.message);
  }
};

export default function Example() {
  var { user } = useContext(SessionData);

  var { pathname, search } = useLocation();
  var navigate = useNavigate()

  const navigation = [
    { name: "Home", href: "/", current: pathname == "/" },
    { name: "About", href: "/about", current: pathname == "/about" },
    { name: "Contact", href: "/contact", current: pathname == "/contact" },
  ];

  const categoriesNav = [
    { name: "All", href: "/", current: search == false && pathname == "/" },
    {
      name: "Playgrounds",
      href: "/?type=Playground",
      current: search == "?type=Playground",
    },
    {
      name: "Playstations",
      href: "/?type=Playstation",
      current: search == "?type=Playstation",
    },
    {
      name: "Playlands",
      href: "/?type=Playland",
      current: search == "?type=Playland",
    },
    {
      name: "Farmhouses",
      href: "/?type=Farmhouse",
      current: search == "?type=Farmhouse",
    },
  ];


  const [keyword,setKeyword] = useState('')

  const SearchHandler = (e) =>{
    e.preventDefault()
    navigate(`/?keyword=${keyword}`)
  }

  return (
    <Disclosure as="nav" className="">
      {({ open }) => (
        <div className="px-4">
          <div className={`mx-auto ${!user && "max-w-[1200px]"}`}>
            <div className="relative flex h-14 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <>
                  {!user && (
                    <div className="flex flex-shrink-0 items-center">
                      <Link to="/">
                        <i class="bx bxs-dashboard text-3xl text-indigo-600"></i>
                      </Link>
                    </div>
                  )}

                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {/* {!user ?
                        navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-100 text-black"
                                : "text-gray-500",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))
                      :
                      null
                      } */}

                      {categoriesNav.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-100 text-black"
                              : "text-gray-500",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              </div>

              <form onSubmit={SearchHandler}>
                <input onChange={(e)=>setKeyword(e.target.value)} type="text" placeholder="Search" className="rounded-md" />
              </form>

              {/* Profile */}
              {user ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="relative rounded-full  p-1 text-gray-400 focus:outline-none"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex items-center rounded-full text-sm focus:outline-none">
                        <div>
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.photo}
                            alt=""
                          />
                        </div>

                        <div className="text-left  ml-2">
                          <p
                            style={{ lineHeight: "20px" }}
                            className="text-sm font-semibold"
                          >
                            {user.name}
                          </p>
                          <p style={{ lineHeight: "5px" }} className="text-xs">
                            {user.role}
                          </p>
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <p
                              onClick={signOut}
                              className="block cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm text-gray-700"
                            >
                              Sign out
                            </p>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : (
                <Link
                  className="bg-indigo-500 py-2 px-3 rounded-md text-sm font-semibold text-white"
                  to="/login"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
