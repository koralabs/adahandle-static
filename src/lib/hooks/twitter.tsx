import { useContext } from "react";

import { AdditionalUserInfo } from "firebase/auth";
import { HandleMintContext } from "../../context/mint";
import { initializeFirebaseApp } from "../helpers/firebase";

export const useTwitter = (): [
  () => Promise<boolean>
] => {
  const { setTwitterToken, handle } = useContext(HandleMintContext);
  initializeFirebaseApp();

  const checkHandleAgainstUser = async () => {
    const {
      getAuth,
      getAdditionalUserInfo,
      signInWithPopup,
      signOut,
      TwitterAuthProvider
    } = await import("firebase/auth");

    const provider = new TwitterAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
      .then(async (result) => {
        const user: AdditionalUserInfo | null = getAdditionalUserInfo(result);

        // If we match, proceed.
        if (user?.username?.toLowerCase() === handle.toLowerCase()) {
          const token = await result.user.getIdToken(true);
          setTwitterToken(token);
          return true;
        }

        await signOut(auth);
        return false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  return [checkHandleAgainstUser];
};
