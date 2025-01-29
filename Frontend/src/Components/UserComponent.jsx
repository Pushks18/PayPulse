import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "./Button"; // Ensure this component is styled appropriately

export default function UserComponent() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          `https://paypulse.onrender.com/api/v1/users/bulk?filter=${filter.toLowerCase()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(response.data.user || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [filter]);

  return (
    <div className="text-white">
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-gray-600 bg-gray-800"
        />
      </div>

      <div>
        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          users.map((user) => <User key={user._id} user={user} />)
        )}
      </div>
    </div>
  );
}

function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-2 hover:bg-gray-800 rounded-md">
      <div className="flex items-center">
        <div className="rounded-full h-12 w-12 bg-gray-700 flex justify-center items-center mr-2">
          <div className="text-xl font-semibold">
            {user.firstName[0].toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>
      <Button
        onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)}
        text="Send Money"
      />
    </div>
  );
}
