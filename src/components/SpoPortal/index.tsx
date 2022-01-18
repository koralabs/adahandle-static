import React, { useContext, useEffect, useMemo, useState } from "react";
import { SessionResponseBody } from "../../../netlify/functions/session";
import { HandleMintContext } from "../../context/mint";
import {
  getAccessTokenFromCookie,
  getAllCurrentSessionData,
  getSessionTokenFromCookie,
} from "../../lib/helpers/session";
import { usePrimeMintingContext } from "../../lib/hooks/primeMintingContext";
import { HandleSession } from "../HandleSession";
import { Loader } from "../Loader";
import NFTPreview from "../NFTPreview";
import { SpoEnterForm } from "./Form";
import { NoSessions } from "./NoSessions";
import { TabNavigation } from "./TabNavigation";

export const SpoPortalPage = (): JSX.Element => {
  const { primed, betaState, stateLoading, handle, currentIndex } =
    useContext(HandleMintContext);

  const [reCaptchaToken, setReCaptchaToken] = useState<string | null>(null);
  const [paymentSessions, setPaymentSessions] = useState<
    (false | SessionResponseBody)[]
  >([]);

  useEffect(() => {
    setPaymentSessions(getAllCurrentSessionData());
  }, [currentIndex, setPaymentSessions]);

  usePrimeMintingContext();

  const currentAccess = useMemo(
    () => getAccessTokenFromCookie(),
    [currentIndex]
  );
  const currentSession =
    currentIndex > 0
      ? (getSessionTokenFromCookie(currentIndex) as SessionResponseBody)
      : null;

  const refreshPaymentSessions = () => {
    setPaymentSessions(getAllCurrentSessionData());
  };

  const spoPageEnabled = betaState?.spoPageEnabled ?? false;

  if (stateLoading) {
    return (
      <div className="flex">
        <Loader />
      </div>
    );
  }

  return (
    <section id="top" className="max-w-5xl mx-auto">
      {spoPageEnabled && (
        <>
          <TabNavigation
            reCaptchaToken={reCaptchaToken}
            paymentSessions={paymentSessions}
            updatePaymentSessions={refreshPaymentSessions}
          />
          <div
            className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8 mb-16"
            style={{ minHeight: "10vh" }}
          >
            {!reCaptchaToken && (
              <SpoEnterForm setReCaptchaToken={setReCaptchaToken} />
            )}
            {/*
        At this point, we have already searched and verified the pool name exists
        Next step is to display the wallet address and the NFT preview
    */}
            {reCaptchaToken && (
              <>
                <div className="col-span-12 lg:col-span-6 relative z-10">
                  <div className="p-8">
                    {currentIndex === 0 ? (
                      <NoSessions />
                    ) : (
                      <HandleSession sessionData={currentSession} />
                    )}
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-6 py-8">
                  <NFTPreview handle={handle} />
                </div>
              </>
            )}
          </div>
        </>
      )}
      {!spoPageEnabled && (
        <div
          className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8 mb-16"
          style={{ minHeight: "10vh" }}
        >
          <div className="col-span-12">
            <h3 className="text-primary-100 font-bold text-4xl text-center mb-2">
              SPO Portal Closed For Maintenance
            </h3>
          </div>
        </div>
      )}
    </section>
  );
};
