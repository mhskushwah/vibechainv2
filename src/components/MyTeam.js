import React, { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../blockchain/config";
import { BrowserProvider, ethers } from "ethers";
const LEVEL_NAMES1 = [
  "UNKNOWN", "PLAYER", "STAR", "HERO", "EXPERT", "WINNER", "PROVIDER", "ICON", "BOSS", "DIRECTOR", "PRECIDENT", "COMMANDER", "REGENT", "LEGEND", "APEX", "INFINITY", "NOVA", "BLOOM"
];
const MyTeam = () => {
  const [directTeamUsers, setDirectTeamUsers] = useState([]);
  const [loading, setLoading] = useState(true);
   const [walletAddress, setWalletAddress] = useState("");
    const [userId, setUserId] = useState(0);

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
              } else {
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

  useEffect(() => {
      const wallet = localStorage.getItem("wallet");
      if (wallet) {
          setWalletAddress(wallet);
           // Fetch details for saved wallet
      }
  }, []);

      useEffect(() => {
          const interval = setInterval(() => {
              if (window.ethereum) {
                  clearInterval(interval);
                  const wallet = localStorage.getItem("wallet");
                  if (wallet) {
                      setWalletAddress(wallet);
                      getUserData(wallet);
                  }
              }
          }, 500);
          return () => clearInterval(interval);
      }, []);


      const getUserData = async (wallet) => {
              try {
                  const provider = new BrowserProvider(window.ethereum);
                  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
                  const userId = await contract.id(wallet);
                  setUserId(userId.toString());
      
              
              } catch (error) {
                  console.error("Error fetching user data:", error);
              }
          };
      




  // Log the userId to check if it's passed correctly
  useEffect(() => {
    console.log("User ID passed from parent component:", userId); // Log userId
    if (userId) {
      fetchDirectTeamMatrix(userId);
    } else {
      console.error("User ID is missing");
    }
  }, [userId]);

  const fetchDirectTeamMatrix = async (userId) => {
    try {
      if (!window.ethereum) {
        alert("🦊 Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // Fetch the direct team users from contract
      const users = await contract.getDirectTeamUsers(userId);

      console.log("Direct Team Users:", users);

      // Update state with fetched data
      setDirectTeamUsers(users);
      setLoading(false);
    } catch (error) {
      console.error("⚠️ Error fetching direct team users:", error);
      setLoading(false);
    }
  };


  return (
    <>
   {/* saved from url=(0029)https://getrise.pro/dashboard */}
  <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
  <style
    data-rc-order="prepend"
    rc-util-key="@ant-design-icons"
    dangerouslySetInnerHTML={{
      __html:
        "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="1ueedyr"
    data-token-hash="r5zvrw"
    data-cache-path="r5zvrw|Shared|ant"
    dangerouslySetInnerHTML={{
      __html:
        ":where(.css-dev-only-do-not-override-1fumvat) a{color:#1677ff;text-decoration:none;background-color:transparent;outline:none;cursor:pointer;transition:color 0.3s;-webkit-text-decoration-skip:objects;}:where(.css-dev-only-do-not-override-1fumvat) a:hover{color:#69b1ff;}:where(.css-dev-only-do-not-override-1fumvat) a:active{color:#0958d9;}:where(.css-dev-only-do-not-override-1fumvat) a:active,:where(.css-dev-only-do-not-override-1fumvat) a:hover{text-decoration:none;outline:0;}:where(.css-dev-only-do-not-override-1fumvat) a:focus{text-decoration:none;outline:0;}:where(.css-dev-only-do-not-override-1fumvat) a[disabled]{color:rgba(0, 0, 0, 0.25);cursor:not-allowed;}"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="1brlkoc"
    data-token-hash="r5zvrw"
    data-cache-path="r5zvrw|Modal-Modal|ant-modal|anticon"
    dangerouslySetInnerHTML={{
      __html:
        ':where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"],:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"]{font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,\'Noto Sans\',sans-serif,\'Apple Color Emoji\',\'Segoe UI Emoji\',\'Segoe UI Symbol\',\'Noto Color Emoji\';font-size:14px;box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"]::after{box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"] [class^="ant-modal"],:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"] [class^="ant-modal"],:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"] [class*=" ant-modal"],:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"] [class*=" ant-modal"]{box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"] [class^="ant-modal"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"] [class^="ant-modal"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"] [class*=" ant-modal"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"] [class*=" ant-modal"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"] [class^="ant-modal"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"] [class^="ant-modal"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-modal"] [class*=" ant-modal"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-modal"] [class*=" ant-modal"]::after{box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-wrap-rtl{direction:rtl;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-centered{text-align:center;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-centered::before{display:inline-block;width:0;height:100%;vertical-align:middle;content:"";}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-centered .ant-modal{top:0;display:inline-block;padding-bottom:0;text-align:start;vertical-align:middle;}@media (max-width: 767px){:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal{max-width:calc(100vw - 16px);margin:8px auto;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-centered .ant-modal{flex:1;}}:where(.css-dev-only-do-not-override-1fumvat).ant-modal{box-sizing:border-box;margin:0 auto;padding:0;color:rgba(0, 0, 0, 0.88);font-size:14px;line-height:1.5714285714285714;list-style:none;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,\'Noto Sans\',sans-serif,\'Apple Color Emoji\',\'Segoe UI Emoji\',\'Segoe UI Symbol\',\'Noto Color Emoji\';pointer-events:none;position:relative;top:100px;width:auto;max-width:calc(100vw - 32px);padding-bottom:24px;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-title{margin:0;color:rgba(0, 0, 0, 0.88);font-weight:600;font-size:16px;line-height:1.5;word-wrap:break-word;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-content{position:relative;background-color:#ffffff;background-clip:padding-box;border:0;border-radius:8px;box-shadow:0 6px 16px 0 rgba(0, 0, 0, 0.08),0 3px 6px -4px rgba(0, 0, 0, 0.12),0 9px 28px 8px rgba(0, 0, 0, 0.05);pointer-events:auto;padding:20px 24px;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-close{position:absolute;top:12px;inset-inline-end:12px;z-index:1010;padding:0;color:rgba(0, 0, 0, 0.45);font-weight:600;line-height:1;text-decoration:none;background:transparent;border-radius:4px;width:32px;height:32px;border:0;outline:0;cursor:pointer;transition:color 0.2s,background-color 0.2s;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-close-x{display:flex;font-size:16px;font-style:normal;line-height:32px;justify-content:center;text-transform:none;text-rendering:auto;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-close:hover{color:rgba(0, 0, 0, 0.88);background-color:rgba(0, 0, 0, 0.06);text-decoration:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-close:active{background-color:rgba(0, 0, 0, 0.15);}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-close:focus-visible{outline:4px solid #91caff;outline-offset:1px;transition:outline-offset 0s,outline 0s;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-header{color:rgba(0, 0, 0, 0.88);background:#ffffff;border-radius:8px 8px 0 0;margin-bottom:8px;padding:0;border-bottom:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-body{font-size:14px;line-height:1.5714285714285714;word-wrap:break-word;padding:0;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-body .ant-modal-body-skeleton{width:100%;height:100%;display:flex;justify-content:center;align-items:center;margin:16px auto;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-footer{text-align:end;background:transparent;margin-top:12px;padding:0;border-top:none;border-radius:0;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-footer >.ant-btn+.ant-btn{margin-inline-start:8px;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal .ant-modal-open{overflow:hidden;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-pure-panel{top:auto;padding:0;display:flex;flex-direction:column;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-pure-panel .ant-modal-content,:where(.css-dev-only-do-not-override-1fumvat).ant-modal-pure-panel .ant-modal-body,:where(.css-dev-only-do-not-override-1fumvat).ant-modal-pure-panel .ant-modal-confirm-body-wrapper{display:flex;flex-direction:column;flex:auto;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-pure-panel .ant-modal-confirm-body{margin-bottom:auto;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-wrap-rtl{direction:rtl;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-wrap-rtl .ant-modal-confirm-body{direction:rtl;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal.ant-zoom-enter,:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal.ant-zoom-appear{transform:none;opacity:0;animation-duration:0.3s;user-select:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal.ant-zoom-leave .ant-modal-content{pointer-events:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-mask{position:fixed;inset:0;z-index:1000;height:100%;background-color:rgba(0, 0, 0, 0.45);pointer-events:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-mask .ant-modal-hidden{display:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-modal-wrap{position:fixed;inset:0;z-index:1000;overflow:auto;outline:0;-webkit-overflow-scrolling:touch;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-enter,:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-appear{animation-duration:0.2s;animation-fill-mode:both;animation-play-state:paused;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-leave{animation-duration:0.2s;animation-fill-mode:both;animation-play-state:paused;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-enter.ant-fade-enter-active,:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-appear.ant-fade-appear-active{animation-name:css-dev-only-do-not-override-1fumvat-antFadeIn;animation-play-state:running;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-leave.ant-fade-leave-active{animation-name:css-dev-only-do-not-override-1fumvat-antFadeOut;animation-play-state:running;pointer-events:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-enter,:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-appear{opacity:0;animation-timing-function:linear;}:where(.css-dev-only-do-not-override-1fumvat).ant-modal-root .ant-fade-leave{animation-timing-function:linear;}:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-enter,:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-appear{animation-duration:0.2s;animation-fill-mode:both;animation-play-state:paused;}:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-leave{animation-duration:0.2s;animation-fill-mode:both;animation-play-state:paused;}:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-enter.ant-zoom-enter-active,:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-appear.ant-zoom-appear-active{animation-name:css-dev-only-do-not-override-1fumvat-antZoomIn;animation-play-state:running;}:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-leave.ant-zoom-leave-active{animation-name:css-dev-only-do-not-override-1fumvat-antZoomOut;animation-play-state:running;pointer-events:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-enter,:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-appear{transform:scale(0);opacity:0;animation-timing-function:cubic-bezier(0.08, 0.82, 0.17, 1);}:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-enter-prepare,:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-appear-prepare{transform:none;}:where(.css-dev-only-do-not-override-1fumvat).ant-zoom-leave{animation-timing-function:cubic-bezier(0.78, 0.14, 0.15, 0.86);}'
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="_effect-css-dev-only-do-not-override-1fumvat-antFadeIn"
    dangerouslySetInnerHTML={{
      __html:
        "@keyframes css-dev-only-do-not-override-1fumvat-antFadeIn{0%{opacity:0;}100%{opacity:1;}}"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="_effect-css-dev-only-do-not-override-1fumvat-antFadeOut"
    dangerouslySetInnerHTML={{
      __html:
        "@keyframes css-dev-only-do-not-override-1fumvat-antFadeOut{0%{opacity:1;}100%{opacity:0;}}"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="_effect-css-dev-only-do-not-override-1fumvat-antZoomIn"
    dangerouslySetInnerHTML={{
      __html:
        "@keyframes css-dev-only-do-not-override-1fumvat-antZoomIn{0%{transform:scale(0.2);opacity:0;}100%{transform:scale(1);opacity:1;}}"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="_effect-css-dev-only-do-not-override-1fumvat-antZoomOut"
    dangerouslySetInnerHTML={{
      __html:
        "@keyframes css-dev-only-do-not-override-1fumvat-antZoomOut{0%{transform:scale(1);}100%{transform:scale(0.2);opacity:0;}}"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="141yxjc"
    data-token-hash="r5zvrw"
    data-cache-path="r5zvrw|Message-Message|ant-message|anticon"
    dangerouslySetInnerHTML={{
      __html:
        ':where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"],:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"]{font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,\'Noto Sans\',sans-serif,\'Apple Color Emoji\',\'Segoe UI Emoji\',\'Segoe UI Symbol\',\'Noto Color Emoji\';font-size:14px;box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"]::after{box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"] [class^="ant-message"],:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"] [class^="ant-message"],:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"] [class*=" ant-message"],:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"] [class*=" ant-message"]{box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"] [class^="ant-message"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"] [class^="ant-message"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"] [class*=" ant-message"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"] [class*=" ant-message"]::before,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"] [class^="ant-message"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"] [class^="ant-message"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class^="ant-message"] [class*=" ant-message"]::after,:where(.css-dev-only-do-not-override-1fumvat)[class*=" ant-message"] [class*=" ant-message"]::after{box-sizing:border-box;}:where(.css-dev-only-do-not-override-1fumvat).ant-message{box-sizing:border-box;margin:0;padding:0;color:rgba(0, 0, 0, 0.88);font-size:14px;line-height:1.5714285714285714;list-style:none;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,\'Noto Sans\',sans-serif,\'Apple Color Emoji\',\'Segoe UI Emoji\',\'Segoe UI Symbol\',\'Noto Color Emoji\';position:fixed;top:8px;width:100%;pointer-events:none;z-index:2010;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-move-up{animation-fill-mode:forwards;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-move-up-appear,:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-move-up-enter{animation-name:css-dev-only-do-not-override-1fumvat-MessageMoveIn;animation-duration:0.3s;animation-play-state:paused;animation-timing-function:cubic-bezier(0.78, 0.14, 0.15, 0.86);}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-move-up-appear.ant-message-move-up-appear-active,:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-move-up-enter.ant-message-move-up-enter-active{animation-play-state:running;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-move-up-leave{animation-name:css-dev-only-do-not-override-1fumvat-MessageMoveOut;animation-duration:0.3s;animation-play-state:paused;animation-timing-function:cubic-bezier(0.78, 0.14, 0.15, 0.86);}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-move-up-leave.ant-message-move-up-leave-active{animation-play-state:running;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-rtl{direction:rtl;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-rtl span{direction:rtl;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper{padding:8px;text-align:center;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-custom-content{display:flex;align-items:center;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-custom-content>.anticon{margin-inline-end:8px;font-size:16px;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-notice-content{display:inline-block;padding:9px 12px;background:#ffffff;border-radius:8px;box-shadow:0 6px 16px 0 rgba(0, 0, 0, 0.08),0 3px 6px -4px rgba(0, 0, 0, 0.12),0 9px 28px 8px rgba(0, 0, 0, 0.05);pointer-events:all;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-success>.anticon{color:#52c41a;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-error>.anticon{color:#ff4d4f;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-warning>.anticon{color:#faad14;}:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-info>.anticon,:where(.css-dev-only-do-not-override-1fumvat).ant-message .ant-message-notice-wrapper .ant-message-loading>.anticon{color:#1677ff;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel{padding:0;text-align:start;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-custom-content{display:flex;align-items:center;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-custom-content>.anticon{margin-inline-end:8px;font-size:16px;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-notice-content{display:inline-block;padding:9px 12px;background:#ffffff;border-radius:8px;box-shadow:0 6px 16px 0 rgba(0, 0, 0, 0.08),0 3px 6px -4px rgba(0, 0, 0, 0.12),0 9px 28px 8px rgba(0, 0, 0, 0.05);pointer-events:all;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-success>.anticon{color:#52c41a;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-error>.anticon{color:#ff4d4f;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-warning>.anticon{color:#faad14;}:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-info>.anticon,:where(.css-dev-only-do-not-override-1fumvat).ant-message-notice-pure-panel .ant-message-loading>.anticon{color:#1677ff;}'
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="_effect-css-dev-only-do-not-override-1fumvat-MessageMoveIn"
    dangerouslySetInnerHTML={{
      __html:
        "@keyframes css-dev-only-do-not-override-1fumvat-MessageMoveIn{0%{padding:0;transform:translateY(-100%);opacity:0;}100%{padding:8px;transform:translateY(0);opacity:1;}}"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-rc-priority={-999}
    data-css-hash="_effect-css-dev-only-do-not-override-1fumvat-MessageMoveOut"
    dangerouslySetInnerHTML={{
      __html:
        "@keyframes css-dev-only-do-not-override-1fumvat-MessageMoveOut{0%{max-height:150px;padding:8px;opacity:1;}100%{max-height:0;padding:0;opacity:0;}}"
    }}
  />
  <style
    data-rc-order="prependQueue"
    data-css-hash="1bpjxgl"
    data-token-hash="r5zvrw"
    data-cache-path="r5zvrw|ant-design-icons|anticon"
    dangerouslySetInnerHTML={{
      __html:
        ".anticon{display:inline-flex;align-items:center;color:inherit;font-style:normal;line-height:0;text-align:center;text-transform:none;vertical-align:-0.125em;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}.anticon >*{line-height:1;}.anticon svg{display:inline-block;}.anticon .anticon .anticon-icon{display:block;}"
    }}
  />
  <link rel="icon" href="https://getrise.pro/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="RainBNB, the next generation of RideBNB." />
  <link rel="apple-touch-icon" href="https://getrise.pro/logo192.png" />
  {/*
manifest.json provides metadata used when your web app is installed on a
user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    */}
  <link rel="manifest" href="https://getrise.pro/manifest.json" />
  {/*
Notice the use of  in the tags above.
It will be replaced with the URL of the `public` folder during the build.
Only files inside the `public` folder can be referenced from the HTML.

Unlike "/favicon.ico" or "favicon.ico", "/favicon.ico" will
work correctly both with client-side routing and a non-root public URL.
Learn how to configure a non-root public URL by running `npm run build`.
    */}
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
  <noscript>You need to enable JavaScript to run this app.</noscript>
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
      <div className="notification-container notification-container-empty">
        <div />
      </div>
      <div className="pb-4 text-black dark:text-white transition-colors duration-1000 min-h-screen relative">
        
        <div className="flex justify-center w-full px-4 mt-6">
          <div className="w-full md:w-3/4">
            <div className="flex items-center justify-between w-full overflow-x-auto">
              <a
                className="md:w-1/5 whitespace-nowrap min-w-[150px]"
                href="https://vibechain.pro/dashboard"
              >
                
              </a>
              <a
                className="md:w-1/5 whitespace-nowrap min-w-[150px] ml-4"
                href="https://vibechain.pro/myteam"
              >
               
              </a>
              <a
                className="md:w-1/5 whitespace-nowrap min-w-[150px] ml-4"
                href="https://vibechain.pro/communityinfo"
              >
                
              </a>
              <a
                className="md:w-1/5 whitespace-nowrap min-w-[150px] ml-4"
                href="https://getrise.pro/communitytree"
              >
               
              </a>
            </div>
          </div>
        </div>
        <div />
        <div className="flex justify-center px-4 md:p-0 mt-6">
          <div className="md:w-3/4 w-full">
           
            
          
          </div>
        </div>
    
     <br></br>
    
        <br></br>
        <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">DIRECT REFERRAL TEAM</h2>

        <div className="p-4">

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
       

      <table className="min-w-max w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden bg-black text-white">
              <thead>
                  <tr className="bg-gradient-to-r from-yellow-500 to-yellow-500 text-black">
                      <th className="border px-4 py-2 text-left">S.No</th>
                      <th className="border px-4 py-2 text-left">User ID</th>
                      <th className="border px-4 py-2 text-left">Address</th>
                      <th className="border px-4 py-2 text-left">Sponsor ID</th>
                      <th className="border px-4 py-2 text-left">Activation Date</th>
                      <th className="border px-4 py-2 text-left">Level</th>
                      <th className="border px-4 py-2 text-left">Direct Team</th>
                  </tr>
              </thead>

              <tbody>
              {directTeamUsers.length > 0 ? (
                directTeamUsers.map((user, index) => (
                  <tr key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-900" : "bg-black"
                  } hover:bg-yellow-500 hover:text-black transition duration-200`}
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{user.id.toString()}</td>
                    <td className="border px-4 py-2">{user.account.slice(0, 6)}...{user.account.slice(-4)}</td>
                    <td className="border px-4 py-2">{user.referrer.toString()}</td>
                    <td className="border px-4 py-2">{new Date(Number(user.start) * 1000).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{LEVEL_NAMES1[user.level] || "UNKNOWN"}</td>
                    <td className="border px-4 py-2">{user.directTeam.toString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-400">No direct team found</td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </div>
        
       
      </div>
    </div>
  </div>
</>

  
  );
}

export default MyTeam;
