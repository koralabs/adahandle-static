import React, { useContext } from "react";

import { HandleMintContext } from "../context/mint";
import { useAccessOpen } from "../lib/hooks/access";

import SEO from "../components/seo";
import { HandleQueue } from "../components/HandleQueue";
import { HowItWorks } from "../components/HowItWorks";
import { RedirectTo } from "../components/RedirectTo";
import { Loader } from "../components/Loader";
import { MintingClosed } from "../components/MintingClosed";

function QueuePage() {
  const { stateLoading, stateData, passwordAllowed } =
    useContext(HandleMintContext);

  const [accessOpen] = useAccessOpen();

  if (accessOpen) {
    return <RedirectTo to={"/mint"} />;
  }

  if (stateLoading || !stateData) {
    return (
      <>
        <SEO title="Mint" />
        <section id="top" className="max-w-5xl mx-auto flex">
          <Loader />
        </section>
      </>
    );
  }

  const { mintingPageEnabled } = stateData;

  if (mintingPageEnabled || passwordAllowed) {
    return (
      <>
        <SEO title="Mint" />
        <section id="top" className="max-w-5xl mx-auto">
          <div
            className="grid grid-cols-12 gap-4 lg:gap-8 bg-dark-200 rounded-lg rounded-tl-none place-content-start p-4 lg:p-8"
            style={{ minHeight: "40vh" }}
          >
            <HowItWorks
              stateLoading={stateLoading}
              dynamicPricingEnabled={stateData?.dynamicPricingEnabled}
            />
            <div className="col-span-12 md:col-span-6 relative z-10">
              <HandleQueue />
            </div>
          </div>
          {accessOpen && stateData && (
            <p className="text-white mt-4 text-center">
              Current Chain Load: {`${(stateData.chainLoad * 100).toFixed(2)}%`}
            </p>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <SEO title="Mint" />
      <MintingClosed />
    </>
  );
}

export default QueuePage;
