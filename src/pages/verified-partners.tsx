import React from "react";

import SEO from "../components/seo";

function VerifiedPartnersPage() {
  return (
    <>
      <SEO title="Verified Partners" />
      <section id="faq" className="my-16 max-w-3xl mx-auto">
        <div className="p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
          <h2 className="inline-block mb-4 text-4xl text-center font-bold leading-none">
            Verified Partners
          </h2>
          <p className="text-lg">
            A "Verified Partner" must follow these Best Practices:
          </p>
          <ul className="list-disc list-inside">
            <li>
              If a $handle is used to resolve an address:
              <ol>
                <li>
                  The $handle NFT image must be displayed to the user to verify
                  it resolved as expected, before a transaction is submitted.
                </li>
                <li>
                  Don't use "autocomplete" to resolve a $handle. This often
                  resolves to incorrect handles if the user doesn't type fast
                  enough. Wait for a user submit action like typing "Enter" or
                  click a submit button.
                </li>
                <li>
                  Perform a double-check before transaction submission, just to
                  ensure the user didn't type something after $handle resolution
                  already took place. Check that the resolution still matches.
                  If not, send an error back to the user.
                </li>
                <li>
                  Disable browser autofill on address input fields. Please see{" "}
                  <a
                    className="text-primary-100 hover:text-primary-200"
                    href="https://stackoverflow.com/questions/64815751/disable-the-browser-autofill-on-input-fields-all-browsers"
                    target="_blank"
                  >
                    this post
                  </a>{" "}
                  for more information.
                </li>
              </ol>
            </li>
            {/* <li>
              If a $handle NFT image is used as a wallet avatar, the partner
              must display the $handle that has the "default" flag in the
              metadata. If more than one $handle has a default flag, the one
              with the most recent timestamp will be used.
            </li> */}
          </ul>
        </div>
      </section>
    </>
  );
}

export default VerifiedPartnersPage;
