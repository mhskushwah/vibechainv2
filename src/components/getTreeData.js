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

export const fetchUserTree = async (userId, depth = 2, level = 0, startIndex = 0, batchSize = 1000) => {
  try {
    if (typeof userId !== "number" || isNaN(userId) || userId <= 0) {
      console.warn("Invalid userId provided to fetchUserTree:", userId);
      return null;
    }

    const contract = await getContract();
    const user = await contract.userInfo(userId);

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
      let hasMore = true;
      let currentIndex = startIndex;
      let childrenFetched = [];

      while (hasMore) {
        const usersBatch = await contract.getMatrixUsers(userId, level, currentIndex, batchSize);
        if (usersBatch.length === 0) break;

        for (const u of usersBatch) {
          const childId = Number(u.id);
          const childNode = await fetchUserTree(childId, depth - 1, level );
          if (childNode) {
            childrenFetched.push(childNode);
          }
        }

        hasMore = usersBatch.length === batchSize;
        currentIndex += batchSize;
      }

      // Always fill 2 child positions (binary layout)
      const maxChildren = 2;
      for (let i = 0; i < maxChildren; i++) {
        if (childrenFetched[i]) {
          node.children.push(childrenFetched[i]);
        } else {
          node.children.push({
            name: "EMPTY",
            attributes: {},
            level: level ,
            children: [] // ❌ Don't add children under an empty node
          });
        }
      }
    }

    return node;
  } catch (error) {
    console.error(`Error in fetchUserTree for ID ${userId}:`, safeStringify(error));
    return null;
  }
};

