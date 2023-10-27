import { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  var [users, setUsers] = useState([]);

  var GetUSers = async () => {
    var res = await axios.get("http://localhost:4600/api/users", {
      withCredentials: true,
    });
    setUsers(res.data.message);
  };

  useEffect(() => {
    GetUSers();
  }, []);

  return (
    <div>
      <div className="overflow-x-auto border rounded-lg">
        <div className="bg-white p-4">
          <h2 className="text-xl font-semibold">
            Added <span className="text-indigo-600">Users</span>
          </h2>
        </div>
        <table className="text-sm min-w-[1000px] w-full text-left text-gray-500">
          <thead className="text-xs text-gray-700 bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              {/* <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((v) => {
              return (
                <tr className="bg-white border-b">
                  <td
                    scope="row"
                    className="px-6 flex items-center py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                        <img className="w-full h-full object-cover" src={v.photo} alt="" />
                    </div>
                    {v.name}
                  </td>
                  <td className="px-6 py-4">{v.role}</td>
                  <td className="px-6 py-4">{v.email}</td>
                  {/* <td className="px-6 py-4 text-lg text-center">
                    <i
                      title="Edit"
                      className="bx p-1 hover:bg-gray-100 rounded-full  bx-edit text-indigo-600"
                    ></i>
                    <i
                      title="Delete"
                      className="bx p-1 hover:bg-gray-100 rounded-full bx-trash text-red-600"
                    ></i>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
