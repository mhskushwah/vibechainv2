// src/components/DayIncomeList.js
import React, { useEffect, useState } from "react";
import { fetchUserDayIncome } from "../components/fetchUserDayIncome";

const DayIncomeList = ({ userId }) => {
  const [dayIncomes, setDayIncomes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadIncomes = async () => {
      setLoading(true);
      const data = await fetchUserDayIncome(userId, 7);
      setDayIncomes(data);
      setLoading(false);
    };

    if (userId) {
      loadIncomes();
    }
  }, [userId]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-bold mb-4 text-center text-lime-400">🗓 Last 7 Days Income</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="space-y-3">
          {dayIncomes.map(({ day, income }, index) => (
            <li
              key={index}
              className="bg-gray-800 p-3 rounded-md flex justify-between border border-gray-700"
            >
              <span className="font-medium">{day}</span>
              <span className="text-yellow-400 font-semibold">{income} BNB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DayIncomeList;
