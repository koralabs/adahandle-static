import React, { useContext } from "react";
import { HandleMintContext } from "../../../context/mint";
import { getSPOSessionTokenFromCookie } from "../../../lib/helpers/session";

export const TabNavigation = ({ paymentSessions, updatePaymentSessions }) => {
  const {
    setCurrentIndex,
    currentIndex,
    currentSPOAccess,
    poolChallenged,
    poolVerified,
  } = useContext(HandleMintContext);

  if (!currentSPOAccess || !poolChallenged || !poolVerified) {
    return null;
  }

  return (
    <div className="flex justify-start place-content-center relative">
      <button
        onClick={() => setCurrentIndex(0)}
        className={`${
          currentIndex !== 0 ? "opacity-40" : ""
        } bg-dark-200 flex-inline items-center justify-center px-4 py-2 rounded-t-lg mr-4 relative`}
      >
        <h4 className="text-lg p-4">Mint a Handle!</h4>
      </button>
      {paymentSessions &&
        paymentSessions.map((session, index) => {
          if (!session) {
            return null;
          }

          return (
            <button
              key={index}
              onClick={() => {
                const session = getSPOSessionTokenFromCookie(index + 1);
                if (session) {
                  setCurrentIndex(index + 1);
                } else {
                  updatePaymentSessions();
                }
              }}
              className={`${
                index + 1 !== currentIndex
                  ? `bg-dark-100 opacity-60`
                  : `bg-dark-200`
              } flex-inline items-center justify-center px-8 lg:px-4 py-2 rounded-t-lg mr-4`}
            >
              <h4 className="hidden lg:block">${session.data.handle}</h4>
              <h4 className="lg:hidden font-bold">{index}</h4>
            </button>
          );
        })}
    </div>
  );
};
