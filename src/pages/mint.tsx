import React, { useContext, useEffect, useMemo, useState } from "react";

import { HandleMintContext } from "../context/mint";
import { usePrimeMintingContext } from "../lib/hooks/primeMintingContext";
import { useAccessOpen } from "../lib/hooks/access";

import SEO from "../components/seo";
import { HandleSearchReserveFlow } from "../components/HandleSearch";
import { Loader } from "../components/Loader";
import NFTPreview from "../components/NFTPreview";
import { HandleQueue } from "../components/HandleQueue";
import { getAccessTokenFromCookie, getAllCurrentSessionData, getSessionTokenFromCookie } from "../lib/helpers/session";
import { HandleSession } from "../components/HandleSession";
import { HandleNavigation } from "../components/HandleNavigation";
import { SessionResponseBody } from "../../netlify/functions/session";
import Countdown from "react-countdown";

function MintPage() {
  const { primed, handle, currentIndex, betaState } = useContext(HandleMintContext);
  const [paymentSessions, setPaymentSessions] = useState<(false | SessionResponseBody)[]>();
  const [accessOpen, setAccessOpen] = useAccessOpen();

  useEffect(() => {
    setPaymentSessions(getAllCurrentSessionData());
  }, [currentIndex, setPaymentSessions]);

  usePrimeMintingContext();

  const currentAccess = useMemo(() => getAccessTokenFromCookie(), [currentIndex]);
  const currentSession = currentIndex > 0 ? getSessionTokenFromCookie(currentIndex) as SessionResponseBody : null;

  const refreshPaymentSessions = () => {
    setPaymentSessions(getAllCurrentSessionData());
  }

  return (
    <>
      <SEO title="Mint" />
      <section id="top" className="max-w-5xl mx-auto">
        {currentAccess && (
          <Countdown
            onComplete={() => setAccessOpen(false)}
            date={new Date(currentAccess.data.exp * 1000)}
            renderer={({ formatted }) => {
              return (
                <p className="text-white text-right">Access Expires: {formatted.minutes}:{formatted.seconds}</p>
              )
            }}
          />
        )}
        <HandleNavigation paymentSessions={paymentSessions} updatePaymentSessions={refreshPaymentSessions} />
        <div
          className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8 mb-16"
          style={{ minHeight: "60vh" }}
          >
            {primed && (null === accessOpen || null === betaState) && (
              <div className="col-span-12 md:col-span-6 md:col-start-4 relative z-10">
                <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                  <p className="w-full text-center">Fetching details...</p>
                  <Loader />
                </div>
              </div>
            )}
            {!accessOpen && betaState?.totalHandles <= 15000 && (
              <div className="col-span-12 md:col-span-6 md:col-start-4 relative z-10">
                <h2 className="text-primary-100 font-bold text-5xl text-center mb-8">Beta Sale</h2>
                <HandleQueue />
              </div>
            )}
            {!accessOpen && betaState?.totalHandles > 15000 && (
              <div className="col-span-12 md:col-span-6 md:col-start-4 relative z-10">
                <h2 className="text-primary-100 font-bold text-5xl text-center mb-8">Beta Sale</h2>
                <h2 className="text-white font-bold text-3xl text-center mb-8">Sold Out!</h2>
                <p className="text-lg text-center">We have officially sold out of our first 15,000 public access Handles. We will re-open public minting as soon as possible!</p>
              </div>
            )}
            {accessOpen && (
              <>
                <div className="col-span-12 lg:col-span-6 relative z-10">
                  {primed && (
                    <div className="p-8">
                      {currentIndex === 0
                        ? <HandleSearchReserveFlow />
                        : <HandleSession sessionData={currentSession} />}
                    </div>
                  )}

                  {!primed && (
                    <div className="grid justify-center content-center h-full w-full p-8 flex-wrap">
                      <p className="w-full text-center">Setting up...</p>
                      <Loader />
                    </div>
                  )}
                </div>
                <div className="col-span-12 lg:col-span-6 py-8">
                  <NFTPreview handle={currentIndex === 0 ? handle : currentSession.data.handle} />
                </div>
              </>
            )}
        </div>
      </section>
    </>
  );
}

export default MintPage;
