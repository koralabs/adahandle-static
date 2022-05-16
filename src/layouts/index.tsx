import { Link } from "gatsby";
import React, { FC, useEffect, useState } from "react";
import { useLocation } from "@reach/router";

import Header from "../components/header";
import Form from "../components/mailchimp";
import { HandleMintContextProvider } from "../context/mint";
import { useCardanoscanDomain, usePolicyID } from "../lib/helpers/env";

const Layout: FC = ({ children }): JSX.Element => {
  const [mintPage, setMintPage] = useState<boolean>(false);
  const { hostname, pathname } = useLocation();
  const policyID = usePolicyID();
  const cardanoscanDomain = useCardanoscanDomain();

  useEffect(() => {
    setMintPage(
      window.location.pathname.includes("mint") ||
        window.location.pathname.includes("queue")
    );
  }, [hostname, pathname]);

  return (
    <HandleMintContextProvider>
      <Header
        showMint={!mintPage}
        className="bg-dark-100 text-dark-400 text-gray-900"
      />
      <div className="flex flex-col min-h-screen font-sans bg-dark-100 text-dark-400 text-gray-900 overflow-hidden">
        <main className="w-full px-4 pt-8 mx-auto md:px-8 md:pt-16 mb-8 md:mb-16">
          {children}
        </main>

        {"undefined" !== typeof window && window.location.pathname !== "/mint" && (
          <div className="bg-dark-200 py-16">
            <div className="max-w-5xl mx-auto text-center">
              <h4 className="mb-8 text-white font-bold text-3xl">
                Never Miss an Update
              </h4>
              <Form />
            </div>
          </div>
        )}

        <footer className="bg-dark-100 pt-16">
          <p className="text-center text-dark-350">
            &copy; {new Date().getFullYear()} ADA Handle •{" "}
            <Link className="text-primary-100" to="/tou">
              Terms of Use
            </Link>{" "}
            •{" "}
            <Link className="text-primary-100" to="/verified-partners">
              Verified Partners
            </Link>{" "}
            • PolicyID:{" "}
            <a
              className="text-primary-100"
              href={`https://${cardanoscanDomain}/tokenPolicy/${policyID}`}
              target="_blank"
              rel="noopener nofollow"
            >
              {policyID}
            </a>{" "}
            • Version: 1.3.0
          </p>
        </footer>
      </div>
    </HandleMintContextProvider>
  );
};

export default Layout;
