import React, {
  FormEvent,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { useDebounce } from "use-debounce";

import {
  HEADER_HANDLE,
  HEADER_IS_SPO,
  HEADER_RECAPTCHA,
} from "../../../../src/lib/constants";
import { HandleMintContext } from "../../../context/mint";
import { isValid } from "../../../lib/helpers/nfts";
// @ts-expect-error svg throwing errors for some reason
import LogoMark from "../../../images/logo-single.svg";
import { Loader } from "../../Loader";
import {
  AllSessionsData,
  AllSessionsDataBody,
  getAllCurrentSessionCookie,
  getAllCurrentSPOSessionData,
  getRecaptchaToken,
  setAllSessionsCookie,
  setSPOSessionTokenCookie,
} from "../../../lib/helpers/session";
import { SessionResponseBody } from "../../../../netlify/functions/session";
import { useSyncAvailableStatus } from "../../../lib/hooks/search";
import { fetchAuthenticatedRequest } from "../../../../netlify/helpers/fetchAuthenticatedRequest";

export const HandleSearch = () => {
  const {
    fetching,
    handleResponse,
    setCurrentIndex,
    setHandleResponse,
    handle,
    setHandle,
    setHandleCost,
  } = useContext(HandleMintContext);
  const [fetchingSession, setFetchingSession] = useState<boolean>(false);
  const [debouncedHandle] = useDebounce(handle, 600);
  const handleInputRef = useRef(null);

  const currentSessions = getAllCurrentSPOSessionData();

  const nextIndex =
    currentSessions.findIndex((session) => session === false) + 1;

  useSyncAvailableStatus(debouncedHandle, true);

  // Handles the input validation and updates.
  const onUpdateHandle = async (newHandle: string) => {
    const valid = isValid(newHandle);
    if (!valid && 0 === handle.length) {
      return;
    }

    if (valid) {
      setHandle(newHandle.toLowerCase());
    }
  };

  /**
   * Handles the form submission to start a session.
   *
   * @param {FormEvent} e
   * @returns
   */
  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const recaptchaToken: string = await getRecaptchaToken();
    try {
      setFetchingSession(true);
      const sessionResponse =
        await fetchAuthenticatedRequest<SessionResponseBody>(
          "/.netlify/functions/session",
          {
            headers: {
              [HEADER_HANDLE]: handle,
              [HEADER_RECAPTCHA]: recaptchaToken,
              [HEADER_IS_SPO]: "true",
            },
          },
          true
        );
      if (!sessionResponse.error) {
        setHandle("");
        setHandleCost(null);
        setSPOSessionTokenCookie(
          sessionResponse,
          new Date(sessionResponse.data.exp),
          nextIndex
        );

        setCurrentIndex(nextIndex);

        const newSession: AllSessionsData = {
          handle,
          dateAdded: Date.now(),
          status: "pending",
        };

        const allSessionsCookieData = getAllCurrentSessionCookie();
        const allSessionsData: AllSessionsDataBody = !allSessionsCookieData
          ? {
              token: sessionResponse.allSessionsToken,
              data: {
                ...sessionResponse.allSessionsData,
                sessions: [newSession],
              },
            }
          : {
              ...allSessionsCookieData,
              data: {
                ...allSessionsCookieData.data,
                sessions: [...allSessionsCookieData.data.sessions, newSession],
              },
            };

        setAllSessionsCookie(allSessionsData);

        return;
      }

      setHandleResponse({
        available: false,
        twitter: false,
        message: sessionResponse.message,
      });
      setFetchingSession(false);
    } catch (e) {
      console.log(e);
      setHandle("");
      setHandleCost(null);
      setHandleResponse({
        available: false,
        message: "Something went wrong. Please refresh the page.",
        twitter: false,
      });
      setFetchingSession(false);
    }
  };

  // Autofocus the input field on load.
  useEffect(() => {
    (handleInputRef?.current as HTMLInputElement | null)?.focus();
  }, []);

  if (fetchingSession) {
    return (
      <div className="text-center">
        <p className="text-3xl">Fetching session...</p>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <h2 className="font-bold text-3xl text-primary-100 mb-2">
        Securing Your SPO Handle
      </h2>
      <hr className="w-12 border-dark-300 border-2 block my-8" />
      <form onSubmit={handleOnSubmit}>
        <div className="relative mb-2">
          <img
            src={LogoMark}
            className="absolute h-full left-0 top-0 px-6 py-4 opacity-10"
          />
          <input
            style={{
              borderColor:
                !fetching && false === handleResponse?.available
                  ? "orange"
                  : "",
            }}
            type="text"
            className={`focus:ring-0 focus:ring-opacity-0 border-2 focus:border-white outline-none form-input bg-dark-100 border-dark-300 rounded-lg pr-6 pl-16 py-4 text-3xl w-full`}
            value={handle}
            ref={handleInputRef}
            placeholder="Start typing..."
            onChange={(e) => onUpdateHandle(e.target.value)}
          />
          <p className="my-2 h-4 absolute bottom-0 right-0 transform translate-y-8">
            <small>
              {fetching && (
                <span className="block">
                  Checking the Cardano blockchain...
                </span>
              )}
              {!fetching && handleResponse?.message && (
                <span className="block text-right">
                  {handleResponse?.message && (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: handleResponse.message,
                      }}
                    ></span>
                  )}
                  {!handleResponse?.available && handleResponse?.link && (
                    <a
                      href={handleResponse?.link}
                      className="ml-2 text-primary-100"
                      target="_blank"
                    >
                      View on Cardanoscan &rarr;
                    </a>
                  )}
                </span>
              )}
            </small>
          </p>
        </div>
        <input
          type="submit"
          value={"Reserve a Session"}
          disabled={!handleResponse?.available}
          className={`${
            !fetching && true === handleResponse?.available
              ? `cursor-pointer bg-primary-200 text-dark-100`
              : `cursor-not-allowed bg-dark-300`
          } form-input rounded-lg p-6 w-full mt-12 font-bold text-dark-100`}
        />
      </form>
      <p className="text-sm mt-8">
        Once you start a session,{" "}
        <strong>it will be active for approximately 1 hour</strong>. We use
        several safeguards to ensure this is hard to get around.{" "}
        <a
          className="text-primary-100"
          href="https://discord.gg/cWYA7xwmMp"
          target="_blank"
        >
          ask in our Discord
        </a>
        .
      </p>
    </>
  );
};
