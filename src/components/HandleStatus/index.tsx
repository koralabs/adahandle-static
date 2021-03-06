import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

import {
  BASIC_ERROR_TEXT,
  HEADER_IS_SPO,
  HEADER_JWT_ALL_SESSIONS_TOKEN,
} from "../../lib/constants";
import { getAllCurrentSessionCookie } from "../../lib/helpers/session";
import {
  SessionStatus,
  SessionStatusType,
  TypeAccordion,
} from "./TypeAccordion";

export const HandleStatus = () => {
  const [mintingQueuePositionResponse, setMintingQueuePositionResponse] =
    useState(null);
  const [fetchingMintingQueuePosition, setFetchingMintingQueuePosition] =
    useState(false);
  const [error, setError] = useState<boolean>(false);

  const fetchMintingQueuePosition = async () => {
    const allSessionsCookie = getAllCurrentSessionCookie();
    if (!allSessionsCookie?.token) {
      return;
    }

    setFetchingMintingQueuePosition(true);

    try {
      const result = await fetch(`/.netlify/functions/mintingQueuePosition`, {
        headers: {
          [HEADER_IS_SPO]: "false",
          [HEADER_JWT_ALL_SESSIONS_TOKEN]: allSessionsCookie.token,
        },
      });
      const response = await result.json();
      if (!response.error) {
        setMintingQueuePositionResponse(response);
        setFetchingMintingQueuePosition(false);
        return;
      }

      setError(true);
      setFetchingMintingQueuePosition(false);
    } catch (error) {
      setError(true);
      setFetchingMintingQueuePosition(false);
    }
  };

  useEffect(() => {
    fetchMintingQueuePosition();
  }, []);

  const renderSessions = () => {
    if (!mintingQueuePositionResponse?.sessions) {
      return null;
    }

    const sessions = mintingQueuePositionResponse.sessions as SessionStatus[];

    if (sessions.length === 0) {
      return <p>No sessions found</p>;
    }

    const items = sessions.reduce<Record<SessionStatusType, SessionStatus[]>>(
      (r, v, _i, _a, k = v.type) => ((r[k] || (r[k] = [])).push(v), r),
      {} as Record<SessionStatusType, SessionStatus[]>
    );

    const confirmedItems = items[SessionStatusType.CONFIRMED];
    const waitingForConfirmationItems =
      items[SessionStatusType.WAITING_FOR_CONFIRMATION];
    const waitingForMiningItems = items[SessionStatusType.WAITING_FOR_MINTING];
    const waitingForPaymentItems = items[SessionStatusType.WAITING_FOR_PAYMENT];
    const refundedItems = items[SessionStatusType.REFUNDED];

    return (
      <>
        {confirmedItems?.length > 0 && (
          <TypeAccordion
            items={confirmedItems}
            type={SessionStatusType.CONFIRMED}
          />
        )}
        {waitingForConfirmationItems?.length > 0 && (
          <TypeAccordion
            items={waitingForConfirmationItems}
            type={SessionStatusType.WAITING_FOR_CONFIRMATION}
          />
        )}
        {waitingForMiningItems?.length > 0 && (
          <TypeAccordion
            items={waitingForMiningItems}
            type={SessionStatusType.WAITING_FOR_MINTING}
          />
        )}
        {waitingForPaymentItems?.length > 0 && (
          <TypeAccordion
            items={waitingForPaymentItems}
            type={SessionStatusType.WAITING_FOR_PAYMENT}
          />
        )}
        {refundedItems?.length > 0 && (
          <TypeAccordion
            items={refundedItems}
            type={SessionStatusType.INVALID_OR_NO_PAYMENTS}
          />
        )}
      </>
    );
  };

  return (
    <>
      <h1 className="m-0 text-center inline-block mb-4 text-4xl font-bold leading-none">
        Check your Handle status
      </h1>
      {error && <p>{BASIC_ERROR_TEXT}</p>}
      {fetchingMintingQueuePosition ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        renderSessions()
      )}
    </>
  );
};
