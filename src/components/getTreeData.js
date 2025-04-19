import { getContract } from "../blockchain/config";

const safeStringify = (obj, space = 2) => {
  const seen = new WeakSet();
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  }, space);
};

export const fetchUserTree = async (userId, depth = 2, level = 0) => {
  try {

    if (typeof userId !== "number" || isNaN(userId) || userId <= 0) {
      console.warn("Invalid userId provided to fetchUserTree:", userId);
      return null;
    }
    const contract = await getContract();
    const user = await contract.userInfo(userId);

    // Skip if user doesn't exist or is invalid
    if (!user || Number(user.id) === 0) {
      console.warn(`User ID ${userId} not found or invalid.`);
      return null;
    }

    const node = {
      name: `ID: ${Number(user.id)}`,
      attributes: {
        Referrer: Number(user.referrer),
        Address: user.wallet || user[0],
        Rank: Number(user.level),
        Start: new Date(Number(user.start) * 1000).toLocaleDateString(),
        Team: Number(user.directTeam),
        TotalTeam: Number(user.totalMatrixTeam),
      },
      level,
      children: [],
    };

    if (depth > 0) {
      try {
        const layer0Users = await contract.getMatrixUsers(userId, 0);

        for (const u of layer0Users) {
          const childId = Number(u.id);
          const childNode = await fetchUserTree(childId, depth - 1, level + 1);
          if (childNode) {
            node.children.push(childNode);
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch layer0 users for ID ${userId}:`, err.message || err);
      }
    }

    return node;
  } catch (error) {
    console.error(`Error in fetchUserTree for ID ${userId}:`, safeStringify(error));
    return null;
  }
};