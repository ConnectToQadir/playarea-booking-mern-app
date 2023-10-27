import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { SessionData } from "./context/Context";
import { useContext, useState, useEffect } from "react";

const Layout = ({ children }) => {
  var [loading, setLoading] = useState(true);

  var { user } = useContext(SessionData);
  var { pathname } = useLocation();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [pathname]);

  return (
    <>
      <div className="flex h-screen max-h-screen">
        <div>
          {pathname != "/login" && pathname != "/signup" && user && (
            <Sidebar></Sidebar>
          )}
        </div>
        <div className="flex-1 overflow-hidden flex w-[90%] flex-col">
          <Navbar />
          <div className="overflow-y-auto w-full flex-1 bg-gray-50 shadow-[inset_0px_0px_10px_rgba(56,56,56,0.2)] p-4">
            {/* {loading ? (
              <div className="h-full flex justify-center items-center">
                <svg
                  width="58"
                  height="58"
                  viewBox="0 0 58 58"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="none" fill-rule="evenodd">
                    <g
                      transform="translate(2 1)"
                      stroke="#4f46e5"
                      stroke-width="1.5"
                    >
                      <circle
                        cx="42.601"
                        cy="11.462"
                        r="5"
                        fill-opacity="1"
                        fill="#4f46e5"
                      >
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="1;0;0;0;0;0;0;0"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="49.063"
                        cy="27.063"
                        r="5"
                        fill-opacity="0"
                        fill="#4f46e5"
                      >
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="0;1;0;0;0;0;0;0"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="42.601"
                        cy="42.663"
                        r="5"
                        fill-opacity="0"
                        fill="#4f46e5"
                      >
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="0;0;1;0;0;0;0;0"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="27"
                        cy="49.125"
                        r="5"
                        fill-opacity="0"
                        fill="#4f46e5"
                      >
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="0;0;0;1;0;0;0;0"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="11.399"
                        cy="42.663"
                        r="5"
                        fill-opacity="0"
                        fill="#4f46e5"
                      >
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="0;0;0;0;1;0;0;0"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="4.938"
                        cy="27.063"
                        r="5"
                        fill-opacity="0"
                        fill="#4f46e5"
                      >
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="0;0;0;0;0;1;0;0"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="11.399"
                        cy="11.462"
                        r="5"
                        fill-opacity="0"
                        fill="#4f46e5"
                      >
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="0;0;0;0;0;0;1;0"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="27" cy="5" r="5" fill-opacity="0" fill="#2563eb">
                        <animate
                          attributeName="fill-opacity"
                          begin="0s"
                          dur=".7s"
                          values="0;0;0;0;0;0;0;1"
                          calcMode="linear"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  </g>
                </svg>
              </div>
            ) : ( */}
              {children}
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
