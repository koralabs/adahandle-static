import React, { useContext } from "react";

import SEO from "../components/seo";
import FAQ from "../components/faq";
import { Link } from "gatsby";
import { DynamicPricing } from "../components/FAQ/DynamicPricing";
import { HandleMintContext } from "../context/mint";

function FAQPage() {
  const { stateData } = useContext(HandleMintContext);

  return (
    <>
      <SEO title="FAQ" />
      <section id="faq" className="lg:my-8 lg:my-16 max-w-3xl mx-auto">
        <section className="mb-8 lg:mt-16 lg:mb-32 max-w-xl mx-auto">
          <h2 className="inline-block mb-4 text-4xl text-center font-bold leading-none">
            FAQ
          </h2>
          <p className="text-lg">
            Most questions can be answered by browsing the FAQ's below. If your
            question is not answered, you can reach out in{" "}
            <a
              href="https://discord.gg/SKBhBx7qtg"
              target="_blank"
              className="text-primary-100"
            >
              our Discord
            </a>
            , or{" "}
            <Link to={"/contact"} className="text-primary-100">
              send us a Message
            </Link>
          </p>
        </section>
        <div className="my-16 max-w-3xl mx-auto">
          <div className="p-4 lg:p-8 bg-dark-200 rounded-lg shadow-lg">
            <FAQ
              faqs={[
                {
                  title: "What is this project?",
                  description: () => (
                    <p>
                      It's a standardized NFT that developers and users can use
                      to associate an address with a custom and human-readable
                      address.
                    </p>
                  ),
                },
                {
                  title: "How does it work in simple terms?",
                  description: () => (
                    <p>
                      Each Handle you purchase will be delivered to you as an
                      NFT. Whatever wallet holds that NFT is where payments will
                      be routed.
                    </p>
                  ),
                },
                {
                  title:
                    "What does an example Handle address look like compared to a standard wallet one.",
                  description: () => (
                    <>
                      <p>
                        Handle address: <code>$custom_name</code>
                      </p>
                      <p>Cardano native address:</p>
                      <pre className="pre">
                        addr1qxx00r962ku8dl7wekn67kxxxjpcyfyul4dtgkkwzu3nqs5dsnkrcr6p03zvxn2k4vh5scr0hf9nc072lwr4fgs4k43qjswugd
                      </pre>
                    </>
                  ),
                },
                {
                  title: "Can I Still Reserve a Handle?",
                  description: () => (
                    <p>
                      No, reservations have ended. You can still purchase a
                      Handle, though, during{" "}
                      <Link to="/mint" className="text-primary-100">
                        open sales
                      </Link>
                      .
                    </p>
                  ),
                },
                {
                  title: "What kind of characters can I use?",
                  description: () => (
                    <>
                      <p>
                        Handles are limited to the following UTF-8 characters:
                      </p>
                      <ul>
                        <li>
                          Alphanumeric: <code>[a-z][A-Z][0-9]</code>
                        </li>
                        <li>
                          Dash: <code>-</code>
                        </li>
                        <li>
                          Underscore: <code>_</code>
                        </li>
                        <li>
                          Period: <code>.</code>
                        </li>
                      </ul>
                    </>
                  ),
                },
                {
                  title: "Are Handles case-sensitive?",
                  description: () => (
                    <p>No, every Handle is converted to lowercase.</p>
                  ),
                },
                {
                  title: "How much does a Handle cost?",
                  description: () =>
                    stateData?.dynamicPricingEnabled ? (
                      <>
                        <p>
                          There are 5 tiers of rarity that define a Handle’s
                          price. After 15,000 sales we’ve defined a fair value
                          model called Stable Pricing.
                        </p>
                        <p>
                          Stable Pricing is an algorithm-based pricing model
                          that protects users from market volatility and will
                          dynamically adjust as the value of ADA moves either
                          higher or lower.
                        </p>
                        <p>Current Prices:</p>
                        <DynamicPricing />
                      </>
                    ) : (
                      <>
                        <p>
                          While we are continuing to fine-tune our rarity
                          attributes to better help the secondary market
                          accurately value their Handles, we settled on 5 tiers
                          of pricing and rarity, determined simply by character
                          length:
                        </p>
                        <ul>
                          <li>
                            Legendary (1 character):{" "}
                            <strong>Auction Only</strong>
                          </li>
                          <li>
                            Ultra Rare (2 characters): <strong>500 $ADA</strong>
                          </li>
                          <li>
                            Rare (3 characters): <strong>100 $ADA</strong>
                          </li>
                          <li>
                            Common (4–7): <strong>50 $ADA</strong>
                          </li>
                          <li>
                            Basic (8–15): <strong>10 $ADA</strong>
                          </li>
                        </ul>
                      </>
                    ),
                },
                {
                  title: "What is the max supply?",
                  description: () => (
                    <>
                      <p>
                        For now, the UTF-8 series is maxed at 15 characters in
                        length. Taking into consideration the previously
                        mentioned tiers:
                      </p>
                      <ul>
                        <li>
                          Legendary: <strong>39</strong>
                        </li>
                        <li>
                          Ultra Rare: <strong>1,521</strong>
                        </li>
                        <li>
                          Rare: <strong>59,319</strong>
                        </li>
                        <li>
                          Common: <strong>140,842,288,080</strong>
                        </li>
                        <li>
                          Basic:{" "}
                          <strong>753,789,555,901,817,000,000,000</strong>
                        </li>
                      </ul>
                    </>
                  ),
                },
                {
                  title: "Once purchased, do I have to pay renewal fees?",
                  description: () => (
                    <p>
                      No! Each Handle is a one-time sale. You buy it, you own it
                      — forever.
                    </p>
                  ),
                },
                {
                  title: "Can I sell it?",
                  description: () => (
                    <p>
                      Yes! You can sell your Handle on any Cardano NFT
                      marketplace.
                    </p>
                  ),
                },
                {
                  title: "Do you charge royalties on sales?",
                  description: () => (
                    <p>
                      We do suggest a 2% royalty fee on secondary sales,
                      according to
                      <a
                        href="https://github.com/cardano-foundation/CIPs/pull/116/files"
                        className="text-primary-100"
                      >
                        CIP-0027
                      </a>
                      , of which marketplaces have the option to honor.
                    </p>
                  ),
                },
                {
                  title: "Can I use or buy them from an exchange?",
                  description: () => (
                    <p>
                      NO. If you try to use a Handle from an exchange it might
                      be lost forever! Only use it with light wallets and full
                      nodes, such as Daedalus, Nami, and Yoroi.
                    </p>
                  ),
                },
                {
                  title: "Why are some Handles not allowed?",
                  description: () => (
                    <p>
                      We believe the community should decide what words should
                      or shouldn't be censored, and we have plans to move this
                      decision to a DAO. In the meantime, however, our lawyers
                      have strongly advised us to filter out hate or predatory
                      speech and obscene phrases. As such we have written an
                      algorithm that tries to filter some of these phrases, but
                      it isn't perfect. Some will get through, and some may get
                      blocked that shouldn't. Please contact us if we have
                      blocked a Handle that is critical to your brand, or
                      otherwise a mistake.
                    </p>
                  ),
                },
                {
                  title: "How long before we can start using the Handle?",
                  description: () => (
                    <>
                      <p>
                        On launch day, you can search for an address at{" "}
                        <a
                          href="https://Handle.me"
                          target="_blank"
                          rel="noreferrer noopen"
                        >
                          Handle.me
                        </a>
                        , or share your custom link that corresponds to your
                        Handle, like this:{" "}
                        <code>
                          https://Handle.me/<strong>my_new_Handle</strong>
                        </code>
                      </p>
                      <p>
                        dApps will integrate the Handle Standard as they choose.
                        You can already see a list of{" "}
                        <Link to="/#partners" className="text-primary-100">
                          our current Partners here
                        </Link>
                        !
                      </p>
                    </>
                  ),
                },
                {
                  title: "What are the future plans of ADA Handle?",
                  description: () => (
                    <ul>
                      <li>Moving to smart contract minting.</li>
                      <li>
                        Burner/recycling pot for privacy and/or temporary Handle
                        usage.
                      </li>
                      <li>An official Handle marketplace.</li>
                      <li>DAO governance.</li>
                    </ul>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default FAQPage;
