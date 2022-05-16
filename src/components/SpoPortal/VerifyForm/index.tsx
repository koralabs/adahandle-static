import React, { useContext, useRef, useState } from "react";
import { SpoVerifyResponseBody } from "../../../../netlify/functions/spoVerify";
import { getAccessTokenCookieName } from "../../../../netlify/helpers/util";
import { HandleMintContext } from "../../../context/mint";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";

import {
  getAccessTokenFromCookie,
  setSPOSessionTokenCookie,
} from "../../../lib/helpers/session";
import Button from "../../button";
import { Alert, styled, Tooltip, tooltipClasses } from "@mui/material";
import { SpoChallengeResponseBody } from "../../../../netlify/functions/spoChallenge";
import { Link } from "gatsby";

export const VerifyForm = (): JSX.Element => {
  const { setCurrentIndex, setHandle, handle } = useContext(HandleMintContext);
  const [verifyResponseMessage, setVerifyResponseMessage] =
    useState<string>(null);
  const [challengeResponseMessage, setChallengeResponseMessage] =
    useState<string>(null);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState<string | null>(null);
  const [domain, setDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [poolId, setPoolId] = useState("");
  const [vrfKey, setVrfKey] = useState("");
  const [vKHash, setVKHash] = useState("");
  const [signature, setSignature] = useState("");
  const [copying, setCopying] = useState(false);

  const form = useRef(null);

  const performChallenge = async (): Promise<void> => {
    setLoading(true);
    const headers = new Headers();
    const accessToken = getAccessTokenFromCookie(true);

    if (accessToken) {
      headers.append(getAccessTokenCookieName(true), accessToken.token);
    }

    try {
      const res: SpoChallengeResponseBody = await fetch(
        "/.netlify/functions/spoChallenge",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            bech32PoolId: poolId,
            cborHexEncodedVRFKey: vrfKey,
            hexEncodedVKeyHash: vKHash,
          }),
        }
      ).then((res) => res.json());

      const { error, message, nonce, domain, handle: handleName } = res;
      if (!error && nonce) {
        setHandle(handleName);
        setNonce(nonce);
        setDomain(domain);
      }

      setError(true);
      setChallengeResponseMessage(message);
    } catch (e) {
      setChallengeResponseMessage("Hmm, try that again. Something went wrong.");
      setTimeout(() => {
        setChallengeResponseMessage(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const performVerify = async (): Promise<void> => {
    setLoading(true);
    const headers = new Headers();
    const accessToken = getAccessTokenFromCookie(true);

    if (accessToken) {
      headers.append(getAccessTokenCookieName(true), accessToken.token);
    }

    try {
      const res: SpoVerifyResponseBody = await fetch(
        "/.netlify/functions/spoVerify",
        {
          method: "POST",
          headers,
          body: JSON.stringify({ signature, poolId }),
        }
      ).then((res) => res.json());

      const { error, message, token, data, address } = res;
      if (!error) {
        setSPOSessionTokenCookie(
          { error, token, data, address },
          new Date(data.exp),
          1
        );
        setCurrentIndex(1);
      }

      setError(true);
      setVerifyResponseMessage(message);
    } catch (e) {
      setVerifyResponseMessage("Hmm, try that again. Something went wrong.");
      setTimeout(() => {
        setVerifyResponseMessage(null);
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChallengeForm = async (e: Event | null): Promise<void> => {
    e && e.preventDefault();
    performChallenge();
  };

  const handleSubmitVerifyForm = async (e: Event | null): Promise<void> => {
    e && e.preventDefault();
    performVerify();
  };

  const handleCopy = async () => {
    const copyText = `$ cncli sign --domain ${domain} --nonce ${nonce} --pool-vrf-skey /path/to/my/pool.vrf.skey`;
    navigator.clipboard.writeText(copyText);
    setCopying(true);
    setTimeout(() => {
      setCopying(false);
    }, 1000);
  };

  const restartProcess = () => {
    setNonce(null);
    setDomain(null);
    setChallengeResponseMessage(null);
    setVerifyResponseMessage(null);
  };

  const HtmlTooltip = styled(
    ({
      className,
      ...props
    }: {
      className: string;
      title: any;
      children: any;
    }) => <Tooltip {...props} classes={{ popper: className }} />
  )(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#0B132B",
      border: "1px solid #999",
    },
  }));

  return (
    <>
      <div className="col-span-12">
        <div className="shadow-lg rounded-lg border-2 border-primary-100 p-4 md:p-8 mb-8">
          <h3 className="text-white text-3xl font-bold text-center mb-4">
            Verify SPO Pool
          </h3>
          {!nonce || !domain ? (
            <form onSubmit={(e) => e.preventDefault()} ref={form}>
              <p>
                We need you to prove that you own the pool you registered with.
              </p>
              <p>
                We will do so using{" "}
                <a href="https://cips.cardano.org/cips/cip22/" target="_blank">
                  CIP-0022
                </a>
                . Please add the following details below:
              </p>
              <p>
                <label
                  htmlFor="poolId"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  Bech32 Pool ID{" "}
                  <HtmlTooltip
                    arrow
                    placement="top"
                    title={
                      <>
                        <p className="text-sm">
                          Bech32 Pool ID can be found on Cardanoscan. It is the
                          ID that begins with "poolxxxxx".
                        </p>
                      </>
                    }
                  >
                    <span>
                      <HelpOutlinedIcon sx={{ fontSize: 15 }} />
                    </span>
                  </HtmlTooltip>
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-6 py-2 text-2xl w-full`}
                  id="poolId"
                  value={poolId}
                  onChange={(e) => setPoolId(e.target.value)}
                />
              </p>
              <p>
                <label
                  htmlFor="vrfKey"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  cborHex-encoded VRF Key{" "}
                  <HtmlTooltip
                    arrow
                    placement="top"
                    title={
                      <>
                        <p className="text-sm">
                          cborHex-encoded VRF Key can be found in your public
                          vrf.vkey file.
                        </p>
                      </>
                    }
                  >
                    <span>
                      <HelpOutlinedIcon sx={{ fontSize: 15 }} />
                    </span>
                  </HtmlTooltip>
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-6 py-2 text-2xl w-full`}
                  id="vrfKey"
                  value={vrfKey}
                  onChange={(e) => setVrfKey(e.target.value)}
                />
              </p>
              <p>
                <label
                  htmlFor="vKHash"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  Hex-encoded VKey Hash{" "}
                  <HtmlTooltip
                    arrow
                    placement="top"
                    title={
                      <>
                        <p className="text-sm">
                          Hex-encoded VKey Hash can be found buy running the
                          following command in your terminal window:
                          <br />$ cardano-cli shelley node key-hash-VRF
                          --verification-key-file vrf.vkey --out-file
                          vkeyhash.out
                        </p>
                      </>
                    }
                  >
                    <span>
                      <HelpOutlinedIcon sx={{ fontSize: 15 }} />
                    </span>
                  </HtmlTooltip>
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-6 py-2 text-2xl w-full`}
                  id="vKHash"
                  value={vKHash}
                  onChange={(e) => setVKHash(e.target.value)}
                />
              </p>
              <Button
                className={`w-full`}
                buttonStyle={"primary"}
                type="submit"
                disabled={
                  poolId === "" || vrfKey === "" || vKHash === "" || loading
                }
                onClick={handleSubmitChallengeForm}
              >
                {loading && "Waiting..."}
                {!loading && "Start Challenge"}
              </Button>

              {challengeResponseMessage && error && (
                <p className="my-2 text-center">
                  <Alert severity="error">{challengeResponseMessage}</Alert>
                </p>
              )}
            </form>
          ) : null}
          {nonce && domain ? (
            <form onSubmit={(e) => e.preventDefault()} ref={form}>
              <h3 className="text-white text-2xl font-bold text-center mb-4">
                Ticker: {handle}
                <HtmlTooltip
                  arrow
                  placement="top"
                  title={
                    <>
                      <p className="text-sm">
                        Ticker name is based on Pool ID. If this is the
                        incorrect ticker, please contact support via discord:{" "}
                        <a
                          href="https://discord.gg/SKBhBx7qtg"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://discord.gg/SKBhBx7qtg
                        </a>
                      </p>
                    </>
                  }
                >
                  <span>
                    <HelpOutlinedIcon sx={{ fontSize: 15, marginLeft: 1 }} />
                  </span>
                </HtmlTooltip>
              </h3>
              <p>Run cncli sign using the following command:</p>
              <div className="mb-4">
                <div className="relative" style={{ paddingRight: "64px" }}>
                  <div className="overflow-hidden overflow-x-auto p-4 rounded-none rounded-tl-lg shadow-inner shadow-lg bg-dark-300 overflow-hidden pr-24 border-2 border-b-0 border-primary-100">
                    cncli sign --domain {domain} --nonce {nonce} --pool-vrf-skey
                    /path/to/my/pool.vrf.skey
                  </div>
                  <button
                    onClick={handleCopy}
                    className="absolute top-0 right-0 h-full w-16 bg-primary-100 rounded-tr-lg"
                  >
                    <svg
                      className={`w-full height-full p-5 ${
                        copying ? "hidden" : "block"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#fff"
                        d="M18.783 13.198H15.73a.78.78 0 010-1.559h2.273V3.652H7.852v.922c0 .433-.349.78-.78.78a.778.778 0 01-.78-.78V2.872c0-.43.349-.78.78-.78h11.711c.431 0 .78.35.78.78v9.546a.781.781 0 01-.78.78z"
                      />
                      <path
                        fill="#fff"
                        d="M12.927 17.908H1.217a.781.781 0 01-.78-.78V7.581c0-.43.349-.78.78-.78h11.709c.431 0 .78.35.78.78v9.546c0 .43-.349.781-.779.781zm-10.93-1.56h10.15V8.361H1.997v7.987z"
                      />
                    </svg>

                    <svg
                      className={`w-full height-full p-5 ${
                        copying ? "block" : "hidden"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#fff"
                        d="M7.197 16.963h-.002a.773.773 0 01-.544-.227L.612 10.654a.769.769 0 011.09-1.084l5.495 5.536L18.221 4.083a.767.767 0 011.087 0c.301.3.301.787 0 1.087L7.741 16.738a.772.772 0 01-.544.225z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <p>This will produce a signature. Add signature below.</p>
              <p>
                <label
                  htmlFor="signature"
                  className="block text-gray-700 text-med font-bold mb-2"
                >
                  Signature
                </label>
                <input
                  type="text"
                  className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-6 py-2 text-2xl w-full`}
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />
              </p>
              <Button
                className={`w-full`}
                buttonStyle={"primary"}
                type="submit"
                disabled={signature === "" || loading}
                onClick={handleSubmitVerifyForm}
              >
                {loading && "Waiting..."}
                {!loading && "Verify"}
              </Button>

              {verifyResponseMessage && error && (
                <p className="my-2 text-center">
                  <Alert severity="error">
                    {verifyResponseMessage}{" "}
                    {verifyResponseMessage === "Verification timeout." && (
                      <span>
                        Not submitted within 5 minute tme window.
                        <Link to="" onClick={restartProcess}>
                          Restart
                        </Link>
                      </span>
                    )}
                  </Alert>
                </p>
              )}
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
};
