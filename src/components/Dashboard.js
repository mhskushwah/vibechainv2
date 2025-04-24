import React, { useEffect, useState } from "react";
import { BrowserProvider, ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../blockchain/config";
import { CheckCircle, ArrowUpCircle, Lock} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import DayIncomeList from "../components/DayIncomeList";



/* global BigInt */

const LEVELS = [
  "0.0040", "0.0060", "0.0120", "0.0240", "0.0480", "0.0960", "0.1920",
  "0.3840", "0.7680", "1.5360", "3.0720", "6.1440", "12.2880", "24.5760",
  "49.1520", "98.3040", "196.6080"
];
const LEVEL_NAMES = [
  "PLAYER","STAR", "HERO", "EXPERT", "WINNER", "PROVIDER", "ICON", "BOSS", "DIRECTOR", "PRESIDENT", "COMMANDER", "REGENT", "LEGEND", "APEX", "INFINITY", "NOVA", "BLOOM"
];
const LEVEL_NAMES1 = [
  "UNKNOWN", "PLAYER", "STAR", "HERO", "EXPERT", "WINNER", "PROVIDER", "ICON", "BOSS", "DIRECTOR", "PRESIDENT", "COMMANDER", "REGENT", "LEGEND", "APEX", "INFINITY", "NOVA", "BLOOM"
];

const PERCENTS = [ 10, 5, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]; // Admin percentage

const Dashboard = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [walletBalance, setWalletBalance] = useState("0");
    const [userId, setUserId] = useState(0);
    const [referrerId, setReferrerId] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [rank, setRank] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [lostIncome, setlostIncome] = useState(0);
    const [directTeam, setDirectTeam] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalDeposit, setTotalDeposit] = useState(0);
    const [totalMatrixTeam, setTotalMatrixTeam] = useState(0);
    const [upgradingIncome, setupgradingIncome] = useState(0);
    const [referralIncome, setReferralIncome] = useState(0);
    const [directReferralIncome, setdirectReferralIncome] = useState(0);
    const [income, setIncome] = useState(Array(17).fill("0")); // 17 elements array
    const [ref, setRef] = useState(0); // Referral ID from URL
    const [copied, setCopied] = useState(false); // ✅ Copy Notification
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);
    const [registrationOpen, setRegistrationOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [searchParams] = useSearchParams(); // URL से referral ID निकालने के लिए
    const [userData, setUserData] = useState(null);


    useEffect(() => {
      async function connectWallet() {
          if (window.ethereum) {
              try {
                  const accounts = await window.ethereum.request({ method: "eth_accounts" });
                  if (accounts.length > 0) {
                      setWalletAddress(accounts[0]); // Update wallet address
                  }
              } catch (error) {
                  console.error("Wallet Connection Error:", error);
              }
          }
      }

      connectWallet();

      // **Wallet change event listener**
      if (window.ethereum) {
          window.ethereum.on("accountsChanged", (accounts) => {
              if (accounts.length > 0) {
                  setWalletAddress(accounts[0]); // Update state when wallet changes
              } else {
                  setWalletAddress(null);
              }
          });
      }
  }, []);



     // Detect wallet connection change
     useEffect(() => {
      const handleAccountsChanged = (accounts) => {
          if (accounts.length > 0) {
              setWalletAddress(accounts[0]);
              getWalletDetails(accounts[0]);
          } else {
              setWalletAddress("");
              setWalletBalance("0");
              setIsRegistered(false); // Reset user data when wallet is disconnected
          }
      };

      if (window.ethereum) {
          window.ethereum.on("accountsChanged", handleAccountsChanged);
      }

      return () => {
          if (window.ethereum) {
              window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          }
      };
  }, []);

  // Get referral ID from URL
  useEffect(() => {
      const refIdFromUrl = searchParams.get("ref");
      if (refIdFromUrl) {
          setRef(refIdFromUrl);
          localStorage.setItem("referrerId", refIdFromUrl);
      }

      if (walletAddress) {
        getWalletDetails(walletAddress); // Ensure correct wallet details are fetched
    }
  }, [searchParams, walletAddress]);




  // Fetch wallet details including balance
  const getWalletDetails = async (wallet) => {
      if (!window.ethereum) {
          alert("🦊 MetaMask not found! Please install MetaMask.");
          return;
      }

      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(wallet);
          setWalletBalance(ethers.formatEther(balance)); 
          getUserData(wallet); // Fetch user data after wallet balance
      } catch (error) {
          console.error("Error fetching wallet details:", error);
      }
  };


    // ✅ Get User Data & Income Array
    const getUserData = async (wallet) => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            const userId = await contract.id(wallet);
            setUserId(userId.toString());
            if (userId > 0) {
                setIsRegistered(true);
                const userData = await contract.userInfo(userId);
                const userData1 = await contract.incomeInfo(userId);

                setReferrerId(userData.referrer);
                setStartTime(userData.start.toString());
                setRank(userData.level);
                setDirectTeam(userData.directTeam);
                setTotalIncome(userData1.totalIncome);
                setTotalDeposit(userData.totalDeposit);
                setTotalMatrixTeam(userData.totalMatrixTeam);
                setupgradingIncome(userData1.upgradingIncome   );
                setReferralIncome(userData1.referralIncome);
                setdirectReferralIncome(userData1.directReferralIncome);
                setlostIncome(userData1.lostIncome);

                const incomeArray = await contract.getLevelIncome(userId);
                const formattedIncome = incomeArray.map(value => value.toString());
                setIncome(formattedIncome);
            } else {
                setIsRegistered(false);
                setRegistrationOpen(true);   // <-- Yeh add kar de

            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
      const handleAccountsChanged = async (accounts) => {
          if (accounts.length === 0) {
              // 🔴 No wallet connected → Logout user
              setWalletAddress("");
              setIsRegistered(false);
              setUserId(null);
              setUserData(null);
              alert("Wallet disconnected! Please connect again.");
          } else {
              // 🟢 New wallet connected → Load everything
              const newWallet = accounts[0];
              setWalletAddress(newWallet);
  
              // 🔄 Check registration and fetch user data again
              const isRegistered = await checkUserRegistration(newWallet);
              if (isRegistered) {
                  await fetchUserDetails(newWallet);  // Replace with your actual data fetch function
              }
          }
      };
  
      if (window.ethereum) {
          window.ethereum.on("accountsChanged", handleAccountsChanged);
      }
  
      // 🧹 Cleanup event listener when component unmounts
      return () => {
          if (window.ethereum && window.ethereum.removeListener) {
              window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          }
      };
  }, []);

  const fetchUserDetails = async (wallet) => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const userId = await contract.id(wallet);
        const user = await contract.userInfo(wallet); // Example: assuming your contract has users mapping

        console.log("👤 Full User Info:", user);
        setUserId(Number(userId));
        setUserData(user);  // You can use this to store and display user info
    } catch (error) {
        console.error("❌ Error fetching user details:", error);
    }
};


  useEffect(() => {
      if (walletAddress) {
          checkUserRegistration(walletAddress);
      }
  }, [walletAddress]);

  const checkUserRegistration = async (wallet) => {
      try {
          if (!window.ethereum) {
              alert("🦊 Please install MetaMask!");
              return false;
          }

          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

          // 🔹 Fetch User ID
          const userId = await contract.id(wallet);
          console.log("User ID:", Number(userId));

          if (Number(userId) > 0) {
              setIsRegistered(true);
              setShowRegisterPopup(false);
              return true;
          }

          setIsRegistered(false);

          // ✅ Get Referral ID
          const urlParams = new URLSearchParams(window.location.search);
          let refId = urlParams.get("ref") || localStorage.getItem("referrerId") || "0";

          if (!isNaN(refId) && Number(refId) > 0) {
              localStorage.setItem("referrerId", refId);
              console.log("Referral ID Set:", refId);
              setShowRegisterPopup(true);
          } else {
              localStorage.removeItem("referrerId");
          }
          return false;
      } catch (error) {
          console.error("⚠️ Error checking registration:", error);
          alert("❌ Error checking registration! Try again.");
          return false;
      }
  };

  const handleRegister = async () => {
      if (!window.ethereum) {
          alert("🦊 Please install MetaMask!");
          return;
      }

      if (!walletAddress) {
          alert("❌ Connect wallet first!");
          return;
      }

      setLoading(true);

      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          const wallet = await signer.getAddress();

          const userAddress = await signer.getAddress();
          const balance = await provider.getBalance(userAddress);
          const valueInWei = ethers.parseUnits("0.0044", "ether");

          let refId = localStorage.getItem("referrerId") || "0";
          refId = isNaN(refId) || Number(refId) <= 0 ? "0" : refId;

          console.log("User Balance:", ethers.formatEther(balance), "BNB");
          console.log("Referral ID Used:", refId);

          // 🔹 Check if already registered
          const isRegistered = await checkUserRegistration(userAddress);
          if (isRegistered) {
              alert("✅ You are already registered!");
              setLoading(false);
              return;
          }

          // 🔹 Check Balance
          if (balance < valueInWei) {
              alert("❌ Insufficient BNB Balance! Please add funds.");
              setLoading(false);
              return;
          }

          // ✅ Register User
          const tx = await contract.register(refId, userAddress, { value: valueInWei });
          await tx.wait();
          alert("✅ Registration Successful!");
          await fetchUserDetails(wallet);
          setIsRegistered(true);
          setShowRegisterPopup(false);
      } catch (err) {
          console.error("❌ Registration failed:", err);
          alert("❌ Registration Failed! Please try again.");
      } finally {
          setLoading(false);
      }
  };


    const toggleLevel = (index) => {
      console.log("Clicked index:", index);
      console.log("Selected Levels Before:", selectedLevels);
    
      if (index < rank) return; // Already activated levels ko ignore karo
    
      // Agar level already selected hai, to usko deselect karo
      if (selectedLevels.includes(index)) {
        setSelectedLevels(selectedLevels.filter((lvl) => lvl !== index));
      } else {
        // Sirf sequential order me hi select hone de
        if (
          (selectedLevels.length === 0 && index === Number(rank)) || 
          selectedLevels[selectedLevels.length - 1] === index - 1
        ) {
          setSelectedLevels([...selectedLevels, index]);
        }
      }
    
      console.log("Selected Levels After:", selectedLevels);
    };
    

    const checkUserRegistered = async () => {
      if (!window.ethereum) {
          alert("🦊 Please install MetaMask to continue!");
          return false;
      }
  
      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
          // 🔹 Wallet Address Fetch
          const walletAddress = await signer.getAddress();
  
          // ✅ Try fetching userInfo (Change according to contract structure)
          const userInfo = await contract.userInfo(walletAddress); 
  
          // ✅ Check if user exists (Adjust according to contract return type)
          if (!userInfo || userInfo.referrer === 0) { 
              alert("❌ You are not registered! Please register first to upgrade your level.");
              return false;
          }
  
          return true; // ✅ User registered hai
      } catch (error) {
          console.error("⚠️ Error checking user registration:", error);
          alert("❌ Error checking user registration. Please try again!");
          return false;
      }
  };
  
  const upgradeLevels = async () => {
    if (!window.ethereum) {
        alert("🦊 Please install MetaMask!");
        return;
    }

    try {
        setLoading(true);

        // ✅ Check if user is registered
        const isRegistered = await checkUserRegistered();
        if (!isRegistered) {
            alert("❌ You are not registered. Please register first.");
            setLoading(false);
            return;
        }

        // ✅ Check if levels are selected
        if (selectedLevels.length === 0) {
            alert("⚠️ Please select at least one level to upgrade!");
            setLoading(false);
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const wallet = await signer.getAddress();


        // 💰 Calculate total amount + admin charges
        const totalAmount = selectedLevels.reduce((acc, idx) => acc + parseFloat(LEVELS[idx]), 0);
        const totalAdminCharge = selectedLevels.reduce((acc, idx) => {
            return acc + (parseFloat(LEVELS[idx]) * PERCENTS[idx]) / 100;
        }, 0);
        
        // 🔁 Use fixed precision, avoid float conversion errors
        const finalAmount = (totalAmount + totalAdminCharge).toFixed(18);
        const totalBNB = ethers.parseUnits(finalAmount, 18);

        // 💼 Wallet balance check
        const walletAddress = await signer.getAddress();
        const balance = await provider.getBalance(walletAddress);
        console.log("User ID:", userId);
        console.log("Selected Levels:", selectedLevels);
        console.log("Total Cost (BNB):", ethers.formatEther(totalBNB));
        console.log("Calling upgrade...");

        if (balance < totalBNB) {
            alert(`❌ Insufficient funds! You need at least ${ethers.formatEther(totalBNB)} BNB.`);
            setLoading(false);
            return;
        }

        // 🧾 Debug logs
        console.log("User ID:", userId);
        console.log("Selected Levels:", selectedLevels);
        console.log("Total Cost (BNB):", ethers.formatEther(totalBNB));
        console.log("Calling upgrade...");

        // ✅ Final Transaction (auto gas)
        const tx = await contract.upgrade(userId, selectedLevels.length, {
            value: totalBNB,
        });
        await tx.wait();

        await fetchUserDetails(wallet);

        alert("✅ Upgrade Successful!");
        setSelectedLevels([]);

    } catch (error) {
        console.error("⚠️ Upgrade Error:", error);

        if (error?.message?.includes("insufficient funds")) {
            alert("❌ Upgrade Failed! You don't have enough BNB.");
        } else if (error?.info?.error?.message) {
            alert(`❌ ${error.info.error.message}`);
        } else {
            alert(`❌ Upgrade Failed! ${error.message || error}`);
        }

    } finally {
        setLoading(false);
    }
};




const totalAmount = selectedLevels.reduce((acc, idx) => acc + parseFloat(LEVELS[idx]), 0);
const totalAdminCharge = selectedLevels.reduce((acc, idx) => {
  return acc + (parseFloat(LEVELS[idx]) * PERCENTS[idx]) / 100;}, 0);
const finalAmount = totalAmount + totalAdminCharge;

    // ✅ Referral Link
    const referralLink = `https://vibechain.vercel.app/dashboard?ref=${userId}`;

    // ✅ Copy Handler
    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // 1.5 sec me hide
    };


  return (
    <>
  {/* saved from url=(0029)https://getrise.pro/dashboard */}
  <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />

  <link rel="icon" href="assets/RainBNB_files/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="RainBNB, the next generation of RideBNB." />
  <title>VIBE CHAIN</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "/*\n! tailwindcss v3.4.4 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */ /* 3 */\n  tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font-family by default.\n2. Use the user's configured `mono` font-feature-settings by default.\n3. Use the user's configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type='button']),\ninput:where([type='reset']),\ninput:where([type='submit']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n.pointer-events-none {\n  pointer-events: none;\n}\n.visible {\n  visibility: visible;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.sticky {\n  position: sticky;\n}\n.left-0 {\n  left: 0px;\n}\n.left-\\[33px\\] {\n  left: 33px;\n}\n.right-0 {\n  right: 0px;\n}\n.right-\\[33px\\] {\n  right: 33px;\n}\n.top-0 {\n  top: 0px;\n}\n.z-0 {\n  z-index: 0;\n}\n.z-10 {\n  z-index: 10;\n}\n.z-50 {\n  z-index: 50;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.my-4 {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n}\n.mb-10 {\n  margin-bottom: 2.5rem;\n}\n.mb-2 {\n  margin-bottom: 0.5rem;\n}\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\n.mb-4 {\n  margin-bottom: 1rem;\n}\n.mb-6 {\n  margin-bottom: 1.5rem;\n}\n.mb-8 {\n  margin-bottom: 2rem;\n}\n.ml-0 {\n  margin-left: 0px;\n}\n.ml-1 {\n  margin-left: 0.25rem;\n}\n.ml-2 {\n  margin-left: 0.5rem;\n}\n.ml-3 {\n  margin-left: 0.75rem;\n}\n.ml-4 {\n  margin-left: 1rem;\n}\n.ml-5 {\n  margin-left: 1.25rem;\n}\n.mr-2 {\n  margin-right: 0.5rem;\n}\n.mr-3 {\n  margin-right: 0.75rem;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-10 {\n  margin-top: 2.5rem;\n}\n.mt-14 {\n  margin-top: 3.5rem;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-3 {\n  margin-top: 0.75rem;\n}\n.mt-4 {\n  margin-top: 1rem;\n}\n.mt-5 {\n  margin-top: 1.25rem;\n}\n.mt-6 {\n  margin-top: 1.5rem;\n}\n.mt-8 {\n  margin-top: 2rem;\n}\n.block {\n  display: block;\n}\n.flex {\n  display: flex;\n}\n.table {\n  display: table;\n}\n.grid {\n  display: grid;\n}\n.hidden {\n  display: none;\n}\n.h-10 {\n  height: 2.5rem;\n}\n.h-12 {\n  height: 3rem;\n}\n.h-14 {\n  height: 3.5rem;\n}\n.h-16 {\n  height: 4rem;\n}\n.h-20 {\n  height: 5rem;\n}\n.h-24 {\n  height: 6rem;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-52 {\n  height: 13rem;\n}\n.h-8 {\n  height: 2rem;\n}\n.h-80 {\n  height: 20rem;\n}\n.h-full {\n  height: 100%;\n}\n.min-h-32 {\n  min-height: 8rem;\n}\n.min-h-screen {\n  min-height: 100vh;\n}\n.w-0 {\n  width: 0px;\n}\n.w-1\\/2 {\n  width: 50%;\n}\n.w-1\\/3 {\n  width: 33.333333%;\n}\n.w-1\\/4 {\n  width: 25%;\n}\n.w-16 {\n  width: 4rem;\n}\n.w-2\\/3 {\n  width: 66.666667%;\n}\n.w-20 {\n  width: 5rem;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-\\[100px\\] {\n  width: 100px;\n}\n.w-\\[76\\%\\] {\n  width: 76%;\n}\n.w-full {\n  width: 100%;\n}\n.min-w-32 {\n  min-width: 8rem;\n}\n.min-w-8 {\n  min-width: 2rem;\n}\n.min-w-\\[150px\\] {\n  min-width: 150px;\n}\n.max-w-6xl {\n  max-width: 72rem;\n}\n.max-w-full {\n  max-width: 100%;\n}\n.max-w-md {\n  max-width: 28rem;\n}\n.max-w-screen-xl {\n  max-width: 1280px;\n}\n.flex-shrink-0 {\n  flex-shrink: 0;\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n@keyframes pulse {\n\n  50% {\n    opacity: .5;\n  }\n}\n.animate-pulse {\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.resize {\n  resize: both;\n}\n.grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n}\n.flex-col {\n  flex-direction: column;\n}\n.flex-wrap {\n  flex-wrap: wrap;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-center {\n  align-items: center;\n}\n.justify-start {\n  justify-content: flex-start;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-10 {\n  gap: 2.5rem;\n}\n.gap-4 {\n  gap: 1rem;\n}\n.gap-6 {\n  gap: 1.5rem;\n}\n.gap-8 {\n  gap: 2rem;\n}\n.gap-x-4 {\n  column-gap: 1rem;\n}\n.space-x-6 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.self-center {\n  align-self: center;\n}\n.overflow-auto {\n  overflow: auto;\n}\n.overflow-x-auto {\n  overflow-x: auto;\n}\n.overflow-y-hidden {\n  overflow-y: hidden;\n}\n.overflow-x-scroll {\n  overflow-x: scroll;\n}\n.whitespace-nowrap {\n  white-space: nowrap;\n}\n.break-all {\n  word-break: break-all;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-sm {\n  border-radius: 0.125rem;\n}\n.rounded-xl {\n  border-radius: 0.75rem;\n}\n.border-2 {\n  border-width: 2px;\n}\n.border-t-0 {\n  border-top-width: 0px;\n}\n.border-t-4 {\n  border-top-width: 4px;\n}\n.border-none {\n  border-style: none;\n}\n.border-\\[rgba\\(124\\2c 240\\2c 89\\2c 0\\.16\\)\\] {\n  border-color: rgba(124,240,89,0.16);\n}\n.border-\\[rgba\\(240\\2c 194\\2c 89\\2c \\.16\\)\\] {\n  border-color: rgba(240,194,89,.16);\n}\n.border-\\[rgba\\(79\\2c 206\\2c 100\\2c 0\\.16\\)\\] {\n  border-color: rgba(79,206,100,0.16);\n}\n.border-\\[rgba\\(89\\2c 222\\2c 240\\2c 0\\.16\\)\\] {\n  border-color: rgba(89,222,240,0.16);\n}\n.border-blue-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(59 130 246 / var(--tw-border-opacity));\n}\n.border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-border-opacity));\n}\n.border-red-700 {\n  --tw-border-opacity: 1;\n  border-color: rgb(185 28 28 / var(--tw-border-opacity));\n}\n.bg-\\[\\#1e2026\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 32 38 / var(--tw-bg-opacity));\n}\n.bg-\\[\\#8080821a\\] {\n  background-color: #8080821a;\n}\n.bg-\\[\\#FFE900\\] {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 233 0 / var(--tw-bg-opacity));\n}\n.bg-\\[rgba\\(124\\2c 240\\2c 89\\2c 0\\.14\\)\\] {\n  background-color: rgba(25, 29, 90, 0.14);\n}\n.bg-\\[rgba\\(240\\2c 194\\2c 89\\2c \\.14\\)\\] {\n  background-color: rgba(240,194,89,.14);\n}\n.bg-\\[rgba\\(85\\2c 183\\2c 80\\2c 0\\.14\\)\\] {\n  background-color: rgba(85,183,80,0.14);\n}\n.bg-\\[rgba\\(89\\2c 222\\2c 240\\2c 0\\.14\\)\\] {\n  background-color: rgba(4, 74, 83, 0.719);\n}\n.bg-blue-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(219 234 254 / var(--tw-bg-opacity));\n}\n.bg-blue-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 246 255 / var(--tw-bg-opacity));\n}\n.bg-blue-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity));\n}\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.bg-gray-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity));\n}\n.bg-gray-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(75 85 99 / var(--tw-bg-opacity));\n}\n.bg-gray-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(55 65 81 / var(--tw-bg-opacity));\n}\n.bg-gray-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity));\n}\n.bg-gray-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity));\n}\n.bg-green-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(34 197 94 / var(--tw-bg-opacity));\n}\n.bg-green-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(22 163 74 / var(--tw-bg-opacity));\n}\n.bg-lime-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(132 204 22 / var(--tw-bg-opacity));\n}\n.bg-purple-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(168 85 247 / var(--tw-bg-opacity));\n}\n.bg-red-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 68 68 / var(--tw-bg-opacity));\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-yellow-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(234 179 8 / var(--tw-bg-opacity));\n}\n.bg-opacity-35 {\n  --tw-bg-opacity: 0.35;\n}\n.bg-opacity-40 {\n  --tw-bg-opacity: 0.4;\n}\n.bg-opacity-45 {\n  --tw-bg-opacity: 0.45;\n}\n.bg-opacity-50 {\n  --tw-bg-opacity: 0.5;\n}\n.bg-opacity-60 {\n  --tw-bg-opacity: 0.6;\n}\n.bg-opacity-90 {\n  --tw-bg-opacity: 0.9;\n}\n.bg-gradient-to-b {\n  background-image: linear-gradient(to bottom, var(--tw-gradient-stops));\n}\n.bg-gradient-to-r {\n  background-image: linear-gradient(to right, var(--tw-gradient-stops));\n}\n.from-blue-500 {\n  --tw-gradient-from: #3b82f6 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(59 130 246 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-gray-800 {\n  --tw-gradient-from: #1f2937 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(31 41 55 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-gray-900 {\n  --tw-gradient-from: #111827 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(17 24 39 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-purple-500 {\n  --tw-gradient-from: #a855f7 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(168 85 247 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-red-600 {\n  --tw-gradient-from: #dc2626 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(220 38 38 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-yellow-500 {\n  --tw-gradient-from: #eab308 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(234 179 8 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.via-cyan-500 {\n  --tw-gradient-to: rgb(6 182 212 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #06b6d4 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-green-500 {\n  --tw-gradient-to: rgb(34 197 94 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #22c55e var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-pink-500 {\n  --tw-gradient-to: rgb(236 72 153 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #ec4899 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.via-red-500 {\n  --tw-gradient-to: rgb(239 68 68 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #ef4444 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n.to-black {\n  --tw-gradient-to: #000 var(--tw-gradient-to-position);\n}\n.to-blue-500 {\n  --tw-gradient-to: #3b82f6 var(--tw-gradient-to-position);\n}\n.to-gray-900 {\n  --tw-gradient-to: #111827 var(--tw-gradient-to-position);\n}\n.to-indigo-500 {\n  --tw-gradient-to: #6366f1 var(--tw-gradient-to-position);\n}\n.to-red-500 {\n  --tw-gradient-to: #ef4444 var(--tw-gradient-to-position);\n}\n.to-yellow-500 {\n  --tw-gradient-to: #eab308 var(--tw-gradient-to-position);\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-3 {\n  padding: 0.75rem;\n}\n.p-4 {\n  padding: 1rem;\n}\n.p-5 {\n  padding: 1.25rem;\n}\n.p-6 {\n  padding: 1.5rem;\n}\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.px-5 {\n  padding-left: 1.25rem;\n  padding-right: 1.25rem;\n}\n.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n.px-8 {\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.py-10 {\n  padding-top: 2.5rem;\n  padding-bottom: 2.5rem;\n}\n.py-12 {\n  padding-top: 3rem;\n  padding-bottom: 3rem;\n}\n.py-16 {\n  padding-top: 4rem;\n  padding-bottom: 4rem;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\n.py-20 {\n  padding-top: 5rem;\n  padding-bottom: 5rem;\n}\n.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n.py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n.py-8 {\n  padding-top: 2rem;\n  padding-bottom: 2rem;\n}\n.py-\\[6px\\] {\n  padding-top: 6px;\n  padding-bottom: 6px;\n}\n.pb-4 {\n  padding-bottom: 1rem;\n}\n.pt-10 {\n  padding-top: 2.5rem;\n}\n.text-center {\n  text-align: center;\n}\n.font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n.text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\n.text-3xl {\n  font-size: 1.875rem;\n  line-height: 2.25rem;\n}\n.text-4xl {\n  font-size: 2.25rem;\n  line-height: 2.5rem;\n}\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-extrabold {\n  font-weight: 800;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-semibold {\n  font-weight: 600;\n}\n.uppercase {\n  text-transform: uppercase;\n}\n.italic {\n  font-style: italic;\n}\n.leading-tight {\n  line-height: 1.25;\n}\n.tracking-wide {\n  letter-spacing: 0.025em;\n}\n.tracking-wider {\n  letter-spacing: 0.05em;\n}\n.text-\\[\\#FFE900\\] {\n  --tw-text-opacity: 1;\n  color: rgb(255 233 0 / var(--tw-text-opacity));\n}\n.text-\\[\\#f0c259\\] {\n  --tw-text-opacity: 1;\n  color: rgb(240 194 89 / var(--tw-text-opacity));\n}\n.text-black {\n  --tw-text-opacity: 1;\n  color: rgb(0 0 0 / var(--tw-text-opacity));\n}\n.text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgb(59 130 246 / var(--tw-text-opacity));\n}\n.text-blue-600 {\n  --tw-text-opacity: 1;\n  color: rgb(37 99 235 / var(--tw-text-opacity));\n}\n.text-gray-200 {\n  --tw-text-opacity: 1;\n  color: rgb(229 231 235 / var(--tw-text-opacity));\n}\n.text-gray-300 {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity));\n}\n.text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity));\n}\n.text-gray-800 {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity));\n}\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.text-green-400 {\n  --tw-text-opacity: 1;\n  color: rgb(74 222 128 / var(--tw-text-opacity));\n}\n.text-green-500 {\n  --tw-text-opacity: 1;\n  color: rgb(34 197 94 / var(--tw-text-opacity));\n}\n.text-lime-500 {\n  --tw-text-opacity: 1;\n  color: rgb(132 204 22 / var(--tw-text-opacity));\n}\n.text-pink-400 {\n  --tw-text-opacity: 1;\n  color: rgb(244 114 182 / var(--tw-text-opacity));\n}\n.text-purple-500 {\n  --tw-text-opacity: 1;\n  color: rgb(168 85 247 / var(--tw-text-opacity));\n}\n.text-purple-600 {\n  --tw-text-opacity: 1;\n  color: rgb(147 51 234 / var(--tw-text-opacity));\n}\n.text-red-500 {\n  --tw-text-opacity: 1;\n  color: rgb(239 68 68 / var(--tw-text-opacity));\n}\n.text-teal-500 {\n  --tw-text-opacity: 1;\n  color: rgb(20 184 166 / var(--tw-text-opacity));\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-yellow-200 {\n  --tw-text-opacity: 1;\n  color: rgb(254 240 138 / var(--tw-text-opacity));\n}\n.text-yellow-300 {\n  --tw-text-opacity: 1;\n  color: rgb(253 224 71 / var(--tw-text-opacity));\n}\n.text-yellow-400 {\n  --tw-text-opacity: 1;\n  color: rgb(250 204 21 / var(--tw-text-opacity));\n}\n.text-yellow-500 {\n  --tw-text-opacity: 1;\n  color: rgb(234 179 8 / var(--tw-text-opacity));\n}\n.underline {\n  text-decoration-line: underline;\n}\n.opacity-100 {\n  opacity: 1;\n}\n.opacity-80 {\n  opacity: 0.8;\n}\n.opacity-90 {\n  opacity: 0.9;\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-xl {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.duration-1000 {\n  transition-duration: 1000ms;\n}\n.duration-300 {\n  transition-duration: 300ms;\n}\n\nbody{\n  background-color: black;\n}\n\n.custom-modal .ant-modal-close-x {\n  color: white; /* Change this to your desired color */\n}\n\n  .blue_blur {\n    background-image: url(https://getrise.pro/static/media/p-background.554a4c4dc178bc7bbb19.png);\n    background-repeat: no-repeat;\n    background-size: cover;\n  }\n\n  .hover\\:bg-\\[\\#FFE900\\]:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 233 0 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-blue-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-gray-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-green-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(22 163 74 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-green-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(21 128 61 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-lime-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(101 163 13 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-purple-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(147 51 234 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-red-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 38 38 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-yellow-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(202 138 4 / var(--tw-bg-opacity));\n}\n\n  .hover\\:bg-gradient-to-r:hover {\n  background-image: linear-gradient(to right, var(--tw-gradient-stops));\n}\n\n  .hover\\:from-red-500:hover {\n  --tw-gradient-from: #ef4444 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(239 68 68 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n\n  .hover\\:via-pink-500:hover {\n  --tw-gradient-to: rgb(236 72 153 / 0)  var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), #ec4899 var(--tw-gradient-via-position), var(--tw-gradient-to);\n}\n\n  .hover\\:to-purple-500:hover {\n  --tw-gradient-to: #a855f7 var(--tw-gradient-to-position);\n}\n\n  .hover\\:text-black:hover {\n  --tw-text-opacity: 1;\n  color: rgb(0 0 0 / var(--tw-text-opacity));\n}\n\n  .hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\n  .hover\\:underline:hover {\n  text-decoration-line: underline;\n}\n\n  .hover\\:shadow-lg:hover {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n  .focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n  .focus\\:ring-4:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n\n  .focus\\:ring-red-300:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(252 165 165 / var(--tw-ring-opacity));\n}\n\n  .dark\\:bg-\\[\\#181a1e\\]:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(24 26 30 / var(--tw-bg-opacity));\n}\n\n  .dark\\:bg-\\[\\#1e2026\\]:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(30 32 38 / var(--tw-bg-opacity));\n}\n\n  .dark\\:bg-red-500:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 68 68 / var(--tw-bg-opacity));\n}\n\n  .dark\\:bg-opacity-40:is(.dark *) {\n  --tw-bg-opacity: 0.4;\n}\n\n  .dark\\:text-\\[\\#FFE900\\]:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(255 233 0 / var(--tw-text-opacity));\n}\n\n  .dark\\:text-purple-400:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(192 132 252 / var(--tw-text-opacity));\n}\n\n  .dark\\:text-white:is(.dark *) {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n\n  .dark\\:hover\\:bg-red-600:hover:is(.dark *) {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 38 38 / var(--tw-bg-opacity));\n}\n\n  .dark\\:focus\\:ring-red-400:focus:is(.dark *) {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(248 113 113 / var(--tw-ring-opacity));\n}\n\n  @media (min-width: 640px) {\n\n  .sm\\:mr-2 {\n    margin-right: 0.5rem;\n  }\n}\n\n  @media (min-width: 768px) {\n\n  .md\\:top-0 {\n    top: 0px;\n  }\n\n  .md\\:ml-0 {\n    margin-left: 0px;\n  }\n\n  .md\\:ml-4 {\n    margin-left: 1rem;\n  }\n\n  .md\\:mt-0 {\n    margin-top: 0px;\n  }\n\n  .md\\:block {\n    display: block;\n  }\n\n  .md\\:hidden {\n    display: none;\n  }\n\n  .md\\:w-1\\/2 {\n    width: 50%;\n  }\n\n  .md\\:w-1\\/4 {\n    width: 25%;\n  }\n\n  .md\\:w-1\\/5 {\n    width: 20%;\n  }\n\n  .md\\:w-3\\/4 {\n    width: 75%;\n  }\n\n  .md\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-4 {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n\n  .md\\:flex-row {\n    flex-direction: row;\n  }\n\n  .md\\:p-0 {\n    padding: 0px;\n  }\n\n  .md\\:px-0 {\n    padding-left: 0px;\n    padding-right: 0px;\n  }\n\n  .md\\:text-xl {\n    font-size: 1.25rem;\n    line-height: 1.75rem;\n  }\n}\n\n  @media (min-width: 1024px) {\n\n  .lg\\:order-2 {\n    order: 2;\n  }\n\n  .lg\\:col-span-5 {\n    grid-column: span 5 / span 5;\n  }\n\n  .lg\\:col-span-7 {\n    grid-column: span 7 / span 7;\n  }\n\n  .lg\\:mr-0 {\n    margin-right: 0px;\n  }\n\n  .lg\\:flex {\n    display: flex;\n  }\n\n  .lg\\:max-w-full {\n    max-width: 100%;\n  }\n\n  .lg\\:grid-cols-12 {\n    grid-template-columns: repeat(12, minmax(0, 1fr));\n  }\n\n  .lg\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .lg\\:px-5 {\n    padding-left: 1.25rem;\n    padding-right: 1.25rem;\n  }\n\n  .lg\\:py-2 {\n    padding-top: 0.5rem;\n    padding-bottom: 0.5rem;\n  }\n\n  .lg\\:py-2\\.5 {\n    padding-top: 0.625rem;\n    padding-bottom: 0.625rem;\n  }\n\n  .lg\\:text-5xl {\n    font-size: 3rem;\n    line-height: 1;\n  }\n\n  .lg\\:text-xl {\n    font-size: 1.25rem;\n    line-height: 1.75rem;\n  }\n}\n\n"
    }}
  />
  <style
    type="text/css"
    dangerouslySetInnerHTML={{
      __html:
        '.rfm-marquee-container {\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: row;\n  position: relative;\n  width: var(--width);\n  transform: var(--transform);\n}\n.rfm-marquee-container:hover div {\n  animation-play-state: var(--pause-on-hover);\n}\n.rfm-marquee-container:active div {\n  animation-play-state: var(--pause-on-click);\n}\n\n.rfm-overlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.rfm-overlay::before, .rfm-overlay::after {\n  background: linear-gradient(to right, var(--gradient-color), rgba(255, 255, 255, 0));\n  content: "";\n  height: 100%;\n  position: absolute;\n  width: var(--gradient-width);\n  z-index: 2;\n  pointer-events: none;\n  touch-action: none;\n}\n.rfm-overlay::after {\n  right: 0;\n  top: 0;\n  transform: rotateZ(180deg);\n}\n.rfm-overlay::before {\n  left: 0;\n  top: 0;\n}\n\n.rfm-marquee {\n  flex: 0 0 auto;\n  min-width: var(--min-width);\n  z-index: 1;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  animation: scroll var(--duration) linear var(--delay) var(--iteration-count);\n  animation-play-state: var(--play);\n  animation-delay: var(--delay);\n  animation-direction: var(--direction);\n}\n@keyframes scroll {\n  0% {\n    transform: translateX(0%);\n  }\n  100% {\n    transform: translateX(-100%);\n  }\n}\n\n.rfm-initial-child-container {\n  flex: 0 0 auto;\n  display: flex;\n  min-width: auto;\n  flex-direction: row;\n  align-items: center;\n}\n\n.rfm-child {\n  transform: var(--transform);\n}'
    }}
  />
  <style
    dangerouslySetInnerHTML={{
      __html:
        '@charset "UTF-8";\n@font-face {\n  font-family: \'Notification\';\n  src: url(https://getrise.pro/static/media/notification.3657084dc0419605a91c.eot);\n  src: url(https://getrise.pro/static/media/notification.3657084dc0419605a91c.eot?#iefixs3g3t9) format("embedded-opentype"), url(https://getrise.pro/static/media/notification.c392cd33d9d9de730f9d.woff) format("woff"), url(https://getrise.pro/static/media/notification.c5d9251ea82e42f75381.ttf) format("truetype"), url(https://getrise.pro/static/media/notification.5d0158671dd860c714c4.svg#notification) format("svg");\n  font-weight: normal;\n  font-style: normal;\n}\n\n.notification-container {\n  box-sizing: border-box;\n  position: fixed;\n  top: 0;\n  right: 0;\n  z-index: 999999;\n  width: 320px;\n  padding: 0px 15px;\n  max-height: calc(100% - 30px);\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.notification {\n  box-sizing: border-box;\n  padding: 15px 15px 15px 58px;\n  border-radius: 2px;\n  color: #fff;\n  background-color: #ccc;\n  box-shadow: 0 0 12px #999;\n  cursor: pointer;\n  font-size: 1em;\n  line-height: 1.2em;\n  position: relative;\n  opacity: 0.9;\n  margin-top: 15px;\n}\n\n.notification .title {\n  font-size: 1em;\n  line-height: 1.2em;\n  font-weight: bold;\n  margin: 0 0 5px 0;\n}\n\n.notification:hover, .notification:focus {\n  opacity: 1;\n}\n\n.notification-enter {\n  visibility: hidden;\n  transform: translate3d(100%, 0, 0);\n}\n\n.notification-enter.notification-enter-active {\n  visibility: visible;\n  transform: translate3d(0, 0, 0);\n  transition: all 0.4s;\n}\n\n.notification-exit {\n  visibility: visible;\n  transform: translate3d(0, 0, 0);\n}\n\n.notification-exit.notification-exit-active {\n  visibility: hidden;\n  transform: translate3d(100%, 0, 0);\n  transition: all 0.4s;\n}\n\n.notification:before {\n  position: absolute;\n  top: 50%;\n  left: 15px;\n  margin-top: -14px;\n  display: block;\n  font-family: \'Notification\';\n  width: 28px;\n  height: 28px;\n  font-size: 28px;\n  text-align: center;\n  line-height: 28px;\n}\n\n.notification-info {\n  background-color: #2f96b4;\n}\n\n.notification-info:before {\n  content: "";\n}\n\n.notification-success {\n  background-color: #51a351;\n}\n\n.notification-success:before {\n  content: "";\n}\n\n.notification-warning {\n  background-color: #f89406;\n}\n\n.notification-warning:before {\n  content: "";\n}\n\n.notification-error {\n  background-color: #bd362f;\n}\n\n.notification-error:before {\n  content: "";\n}\n\n'
    }}
  />
  <div id="root">
 
    <div className="App">
      <img
        src="assets/RainBNB_files/bgimg.png"
        className="fixed hidden md:block right-0 top-0 z-0 opacity-100 w-full h-full"
      />
      <img
        src="assets/RainBNB_files/bgmobimg.png"
        className="fixed w-full left-0 md:top-0 block md:hidden top-0 z-0 opacity-100"
      />
    
      <div className="pb-4 text-black dark:text-white transition-colors duration-1000 min-h-screen relative">

        <br></br>
        <br></br>
        <br></br>
        {/* Registration Popup */}
        {showRegisterPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-white">
                        <h2 className="text-xl font-semibold text-center text-yellow-400">Registration</h2>
                        <p className="text-gray-300 text-sm text-center mb-2">You need to register with 0.0044 BNB + Gas Fee</p>
                        <p className="text-center mb-4">Referrer ID: {ref}</p>
                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600 mb-2"
                        >
                            {loading ? "Registering..." : "Register Now"}
                        </button>
                        <button
                            onClick={() => setShowRegisterPopup(false)}
                            className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        {userId && <DayIncomeList userId={userId} />}
        

        <div className="flex flex-col items-center px-4 md:px-8 lg:px-16 py-6 bg-black min-h-screen text-white">
            {/* Wallet Section */}
            <div className="mt-6 w-full max-w-2xl bg-gray-900 text-yellow-300 p-6 rounded-lg shadow-lg">
            <div className="text-center text-sm bg-gray-800 p-2 rounded-md break-all max-w-full overflow-hidden text-ellipsis">
    {walletAddress || "Not connected"}
</div>
                <div className="mt-4 bg-yellow-500 text-black font-bold py-3 px-6 text-center rounded-md shadow-md">
                    My Wallet Fund: {walletBalance} BNB
                </div>
                
                {/* User Info */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="font-semibold">User ID:</div>
                    <div className="bg-gray-800 py-1 px-3 rounded-md">{userId?.toString()}</div>
                    <div className="font-semibold">Rank:</div>
                    <div className="bg-gray-800 py-1 px-3 rounded-md">{LEVEL_NAMES1[rank] || "Unknown"}</div>
                    <div className="font-semibold">Activation Date:</div>
                    <div className="bg-gray-800 py-1 px-3 rounded-md">{new Date(startTime * 1000).toLocaleString()}</div>
                    <div className="font-semibold">Referred By:</div>
                    <div className="bg-gray-800 py-1 px-3 rounded-md">{referrerId}</div>
                </div>

            </div>
            
       
    <div className="flex flex-col items-center mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-lg shadow-lg">
    <h1 className="text-lg font-bold mb-4 text-yellow-400">Referral Link</h1>
    <div className="flex items-center bg-gray-800 p-3 rounded-md w-full">
    <span 
    className="text-lg bg-yellow-500 rounded-sm px-5 py-2 text-black break-all w-full text-center cursor-pointer overflow-hidden text-ellipsis"
    onClick={handleCopy}
>
    {referralLink}
</span>
        {copied && (
            <span className="text-xs text-green-400 ml-3 whitespace-nowrap">Copied!</span>
        )}
    </div>
</div>

   
           
        </div>

<div className="p-4 md:p-8 flex flex-col items-center bg-black min-h-screen text-white">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-6 tracking-widest text-center">
    🚀 PACKAGES
  </h2>

  {/* Grid Adjustments */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl justify-center">
    {LEVELS.map((amount, index) => {
      if (index < rank) return null; // Hide already activated levels
      const adminCharge = (parseFloat(amount) * PERCENTS[index]) / 100;
      const totalAmount = (parseFloat(amount) + adminCharge).toFixed(4);
      const isSelected = selectedLevels.includes(index);
      const isNextInSequence =
        (selectedLevels.length === 0 && index === Number(rank)) ||
        selectedLevels[selectedLevels.length - 1] === index - 1;

      return (
        <motion.button
          key={index}
          onClick={() => toggleLevel(index)}
          whileHover={isNextInSequence ? { scale: 1.1 } : {}}
          whileTap={isNextInSequence ? { scale: 0.95 } : {}}
          disabled={!isNextInSequence && !isSelected} // Lock levels that are not unlocked
          className={`px-8 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 flex flex-col items-center text-xs sm:text-sm md:text-base rounded-full transition-all duration-300 ease-in-out 
          shadow-md border-2 text-center font-extrabold transform hover:scale-105 active:scale-95
          ${isSelected
            ? "bg-yellow-500 text-black font-bold border-yellow-600 scale-105 shadow-yellow-600"
            : isNextInSequence
            ? "bg-gray-800 text-yellow-300 hover:bg-yellow-500 hover:text-black hover:border-yellow-600"
            : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
          }`}
        >
          {isSelected ? (
            <CheckCircle className="h-5 w-5 mb-1 text-black" />
          ) : isNextInSequence ? (
            <CheckCircle className="h-5 w-5 mb-1 text-yellow-400" />
          ) : (
            <Lock className="h-5 w-5 mb-1 text-gray-400" />
          )}
          <span className="font-bold text-4xl sm:text-xl md:text-2xl text-center block">
  {LEVEL_NAMES[index]}
</span>
<span className="font-bold text-lg sm:text-xl md:text-2xl text-center block">
  {totalAmount} BNB
</span>
        </motion.button>
      );
    })}
  </div>

  {/* Adjusting Margin for Button */}
 {rank < 17 ? (
  <motion.button
    onClick={upgradeLevels}
    disabled={loading || selectedLevels.length === 0}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={`mt-6 sm:mt-8 px-8 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 flex items-center gap-3 text-sm sm:text-base md:text-lg font-semibold rounded-full transition-all duration-300 ease-in-out 
      shadow-md border-2 border-green-500 glow-effect text-center
      ${loading || selectedLevels.length === 0
        ? "bg-gray-600 cursor-not-allowed opacity-50"
        : "bg-green-500 text-black hover:bg-green-600"
      }`}
  >
    <ArrowUpCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
    {loading ? "Processing..." : `Upgrade for ${finalAmount.toFixed(5)} BNB`}
  </motion.button>
) : (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="mt-6 sm:mt-8 text-center text-white"
  >
    <motion.div
      initial={{ scale: 0.5, rotate: -10 }}
      animate={{ scale: 1.2, rotate: 0 }}
      transition={{ yoyo: Infinity, duration: 1.5, ease: "easeInOut" }}
      className="inline-block"
    >
      🎉
    </motion.div>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-lg">
      ALL LEVELS UPGRADED!
    </h2>
    <p className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold text-gray-300">
      You have successfully unlocked all levels.
    </p>
  </motion.div>
)}

</div>

<div className="flex flex-wrap justify-center gap-6 mt-6 px-4">
    {[
        { title: "Total Income", value: totalIncome, icon: "bnb.png", showBNB: true, isBNB: true },
        { title: "Total Deposit", value: totalDeposit, icon: "bnb.png", showBNB: true, isBNB: true },
        { title: "Direct Referrals", value: directTeam, icon: "leader.png", showBNB: false, isBNB: false },
        { title: "My Community Size", value: totalMatrixTeam, icon: "matrix.png", showBNB: false, isBNB: false },
        { title: "Referral Income (20%) ", value: directReferralIncome, icon: "bnb.png", showBNB: true, isBNB: true },
        { title: "Direct Income (100%)", value: referralIncome, icon: "bnb.png", showBNB: true, isBNB: true },
        { title: "Level Upgrade Income", value: upgradingIncome, icon: "bnb.png", showBNB: true, isBNB: true },
        { title: "Lost Income", value: lostIncome, icon: "bnb.png", showBNB: true, isBNB: true },

    ].map((item, index) => (
        <div key={index} className="bg-gray-900 bg-opacity-50 p-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-xl shadow-lg border border-gray-800 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-lg font-semibold text-yellow-400">{item.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">
  {item.isBNB
    ? parseFloat(ethers.formatUnits(item.value || 0, "ether")).toFixed(4)
    : Number(item.value || 0).toLocaleString()}{" "}
  {item.showBNB ? "BNB" : ""}
</p>
                </div>
                <img src={`assets/RainBNB_files/${item.icon}`} alt={item.title} className="h-12" />
            </div>
        </div>
    ))}
</div>

        <div className="flex justify-center px-4 md:p-0 mt-8">
          <div className="md:w-3/4 w-full">
            <h1 className="font-bold text-2xl px-2 text-yellow-500">
              Rank <span className="text-green-500">Income</span>
            </h1>
            <div className="overflow-auto flex justify-between w-full mt-2 p-2 rounded-sm">
              <div className="whitespace-nowrap ml-0 md:ml-0 w-1/2">
                <p className="text-center text-lime-500 whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  Rank
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  PLAYER
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  STAR
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  HERO
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  EXPERT
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  WINNER
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  PROVIDER
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  ICON
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  BOSS
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  DIRECTOR
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  PRESIDENT
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  COMMANDER
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  REGENT
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  LEGEND
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  APEX
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  INFINITY
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  NOVA
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  BLOOM
                </p>
              </div>
              <div className="whitespace-nowrap ml-4 w-1/2">
                <p className="text-center text-lime-500 whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                  Amount
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[0] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[1] || "0", "ether")}  <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[2] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[3] || "0", "ether")}<span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[4] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[5] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[6] || "0", "ether")}<span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[7] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[8] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[9] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[10] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[11] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[12] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[13] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[14] || "0", "ether")}<span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[15] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
                <p className="text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                {ethers.formatUnits(income[16] || "0", "ether")} <span className="text-[#FFE900]">BNB</span>
                </p>
              </div>
            </div>
          </div>
        </div>
       

        <div className="flex justify-center px-4 md:p-0 mt-10 mb-4">
          
          <div className="md:w-3/4 w-full">
          <div>
              <div className="w-full">
                <div className="w-full flex justify-between">
                  <a
                    href="https://t.me/vibechainoffcial"
                    target="_blank"
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40px"
                      height="40px"
                      viewBox="0 0 256 256"
                    >
                      <defs>
                        <linearGradient
                          id="logosTelegram0"
                          x1="50%"
                          x2="50%"
                          y1="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#2aabee" />
                          <stop offset="100%" stopColor="#229ed9" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#logosTelegram0)"
                        d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.04 128.04 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51s-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0"
                      />
                      <path
                        fill="#fff"
                        d="M57.94 126.648q55.98-24.384 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/vibechainofficial"
                    target="_blank"
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40px"
                      height="40px"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="#1877f2"
                        d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
                      />
                      <path
                        fill="#fff"
                        d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://whatsapp.com/channel/vibechain"
                    target="_blank"
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40px"
                      height="40px"
                      viewBox="0 0 256 258"
                    >
                      <defs>
                        <linearGradient
                          id="logosWhatsappIcon0"
                          x1="50%"
                          x2="50%"
                          y1="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#1faf38" />
                          <stop offset="100%" stopColor="#60d669" />
                        </linearGradient>
                        <linearGradient
                          id="logosWhatsappIcon1"
                          x1="50%"
                          x2="50%"
                          y1="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#f9f9f9" />
                          <stop offset="100%" stopColor="#fff" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#logosWhatsappIcon0)"
                        d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"
                      />
                      <path
                        fill="url(#logosWhatsappIcon1)"
                        d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z"
                      />
                      <path
                        fill="#fff"
                        d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64"
                      />
                    </svg>
                  </a>
                  <a
                    href="https://x.com/vibechainoffical"
                    target="_blank"
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40px"
                      height="40px"
                      viewBox="0 0 256 256"
                    >
                      <g fill="none">
                        <rect width={256} height={256} fill="#fff" rx={60} />
                        <rect width={256} height={256} fill="#1d9bf0" rx={60} />
                        <path
                          fill="#fff"
                          d="M199.572 91.411c.11 1.587.11 3.174.11 4.776c0 48.797-37.148 105.075-105.075 105.075v-.03A104.54 104.54 0 0 1 38 184.677q4.379.525 8.79.533a74.15 74.15 0 0 0 45.865-15.839a36.98 36.98 0 0 1-34.501-25.645a36.8 36.8 0 0 0 16.672-.636c-17.228-3.481-29.623-18.618-29.623-36.198v-.468a36.7 36.7 0 0 0 16.76 4.622c-16.226-10.845-21.228-32.432-11.43-49.31a104.8 104.8 0 0 0 76.111 38.582a36.95 36.95 0 0 1 10.683-35.283c14.874-13.982 38.267-13.265 52.249 1.601a74.1 74.1 0 0 0 23.451-8.965a37.06 37.06 0 0 1-16.234 20.424A73.5 73.5 0 0 0 218 72.282a75 75 0 0 1-18.428 19.13"
                        />
                      </g>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/vibechain"
                    target="_blank"
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40px"
                      height="40px"
                      viewBox="0 0 256 256"
                    >
                      <g fill="none">
                        <rect
                          width={256}
                          height={256}
                          fill="url(#skillIconsInstagram0)"
                          rx={60}
                        />
                        <rect
                          width={256}
                          height={256}
                          fill="url(#skillIconsInstagram1)"
                          rx={60}
                        />
                        <path
                          fill="#fff"
                          d="M128.009 28c-27.158 0-30.567.119-41.233.604c-10.646.488-17.913 2.173-24.271 4.646c-6.578 2.554-12.157 5.971-17.715 11.531c-5.563 5.559-8.98 11.138-11.542 17.713c-2.48 6.36-4.167 13.63-4.646 24.271c-.477 10.667-.602 14.077-.602 41.236s.12 30.557.604 41.223c.49 10.646 2.175 17.913 4.646 24.271c2.556 6.578 5.973 12.157 11.533 17.715c5.557 5.563 11.136 8.988 17.709 11.542c6.363 2.473 13.631 4.158 24.275 4.646c10.667.485 14.073.604 41.23.604c27.161 0 30.559-.119 41.225-.604c10.646-.488 17.921-2.173 24.284-4.646c6.575-2.554 12.146-5.979 17.702-11.542c5.563-5.558 8.979-11.137 11.542-17.712c2.458-6.361 4.146-13.63 4.646-24.272c.479-10.666.604-14.066.604-41.225s-.125-30.567-.604-41.234c-.5-10.646-2.188-17.912-4.646-24.27c-2.563-6.578-5.979-12.157-11.542-17.716c-5.562-5.562-11.125-8.979-17.708-11.53c-6.375-2.474-13.646-4.16-24.292-4.647c-10.667-.485-14.063-.604-41.23-.604zm-8.971 18.021c2.663-.004 5.634 0 8.971 0c26.701 0 29.865.096 40.409.575c9.75.446 15.042 2.075 18.567 3.444c4.667 1.812 7.994 3.979 11.492 7.48c3.5 3.5 5.666 6.833 7.483 11.5c1.369 3.52 3 8.812 3.444 18.562c.479 10.542.583 13.708.583 40.396s-.104 29.855-.583 40.396c-.446 9.75-2.075 15.042-3.444 18.563c-1.812 4.667-3.983 7.99-7.483 11.488c-3.5 3.5-6.823 5.666-11.492 7.479c-3.521 1.375-8.817 3-18.567 3.446c-10.542.479-13.708.583-40.409.583c-26.702 0-29.867-.104-40.408-.583c-9.75-.45-15.042-2.079-18.57-3.448c-4.666-1.813-8-3.979-11.5-7.479s-5.666-6.825-7.483-11.494c-1.369-3.521-3-8.813-3.444-18.563c-.479-10.542-.575-13.708-.575-40.413s.096-29.854.575-40.396c.446-9.75 2.075-15.042 3.444-18.567c1.813-4.667 3.983-8 7.484-11.5s6.833-5.667 11.5-7.483c3.525-1.375 8.819-3 18.569-3.448c9.225-.417 12.8-.542 31.437-.563zm62.351 16.604c-6.625 0-12 5.37-12 11.996c0 6.625 5.375 12 12 12s12-5.375 12-12s-5.375-12-12-12zm-53.38 14.021c-28.36 0-51.354 22.994-51.354 51.355s22.994 51.344 51.354 51.344c28.361 0 51.347-22.983 51.347-51.344c0-28.36-22.988-51.355-51.349-51.355zm0 18.021c18.409 0 33.334 14.923 33.334 33.334c0 18.409-14.925 33.334-33.334 33.334s-33.333-14.925-33.333-33.334c0-18.411 14.923-33.334 33.333-33.334"
                        />
                        <defs>
                          <radialGradient
                            id="skillIconsInstagram0"
                            cx={0}
                            cy={0}
                            r={1}
                            gradientTransform="matrix(0 -253.715 235.975 0 68 275.717)"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#fd5" />
                            <stop offset="0.1" stopColor="#fd5" />
                            <stop offset="0.5" stopColor="#ff543e" />
                            <stop offset={1} stopColor="#c837ab" />
                          </radialGradient>
                          <radialGradient
                            id="skillIconsInstagram1"
                            cx={0}
                            cy={0}
                            r={1}
                            gradientTransform="matrix(22.25952 111.2061 -458.39518 91.75449 -42.881 18.441)"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#3771c8" />
                            <stop offset="0.128" stopColor="#3771c8" />
                            <stop offset={1} stopColor="#60f" stopOpacity={0} />
                          </radialGradient>
                        </defs>
                      </g>
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com/@vibechainofficial"
                    target="_blank"
                    className="cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40px"
                      height="40px"
                      viewBox="0 0 256 180"
                    >
                      <path
                        fill="#f00"
                        d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"
                      />
                      <path
                        fill="#fff"
                        d="m102.421 128.06l66.328-38.418l-66.328-38.418z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div><br></br>
            <div className="w-full flex flex-col justify-center items-center text-yellow-400 underline">
              <h4 className="font-bold">VIBE CHAIN Contract opbnb.bscscan</h4>
              <a
                className="text-yellow-400 underline"
                href="https://opbnb.bscscan.com/address/0x79b8C37FB6e98A64e0Da8c151A9a562F5188e660"
                target="_blank"
              >
                (0x79b8C37FB6............a562F5188e660)
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</>

  );
};

export default Dashboard;
