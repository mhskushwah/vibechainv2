import { getContract } from "../blockchain/config";
import { formatEther } from "ethers"; // ✅ Ethers v6 – use named import

export const fetchUserDayIncome = async (userId, daysToFetch = 7) => {
  try {
    const contract = await getContract();

    const currentDay = await contract.getUserCurDay(userId);
    const dayIndex = Number(currentDay);

    const user = await contract.userInfo(userId);
    const startTimestamp = Number(user.start); // in seconds

    const incomeByDay = [];

    for (let i = 0; i < daysToFetch; i++) {
      const day = dayIndex - i;
      if (day >= 0) {
        const income = await contract.userDayIncome(userId, day);

        // ✅ Convert to BNB using ethers v6
        const bnbIncome = parseFloat(formatEther(income));

        // ✅ Get readable date
        const date = new Date((startTimestamp + day * 86400) * 1000);
        const formattedDate = date.toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        incomeByDay.push({
          day: formattedDate,
          income: bnbIncome.toFixed(6),
        });
      }
    }

    return incomeByDay;
  } catch (error) {
    console.error("Error fetching day income:", error);
    return [];
  }
};
