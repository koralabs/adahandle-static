import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { SessionResponseBody } from "../../netlify/functions/session";
import { StateResponseBody } from "../../netlify/functions/state";
import { VerifyResponseBody } from "../../netlify/functions/verify";
import { Status, WorkflowStatus } from "../../netlify/helpers/util";
import { HandleResponseBody } from "../lib/helpers/search";
import {
  getAccessTokenFromCookie,
  getSPOAccessTokenCookie,
} from "../lib/helpers/session";

export interface ReservedHandlesType {
  blacklist: string[];
  twitter: string[];
  manual: string[];
  spos: string[];
}

export enum CreatedBySystem {
  UI = "UI",
  CLI = "CLI",
  SPO = "SPO",
}

export interface ActiveSessionType {
  emailAddress: string;
  cost: number;
  refundAmount?: number;
  handle: string;
  paymentAddress: string;
  returnAddress?: string;
  start: number;
  id?: string;
  txId?: string;
  createdBySystem: CreatedBySystem;
  status?: Status;
  workflowStatus?: WorkflowStatus;
  attempts?: number;
  dateAdded?: number;
}

interface PaymentSession {
  sessionResponse: SessionResponseBody;
}

export interface HandleMintContextType {
  handle: string;
  handleCost: number | null;
  handleResponse: HandleResponseBody;
  fetching: boolean;
  setFetching: Dispatch<SetStateAction<boolean>>;
  twitterToken: string;
  setHandle: Dispatch<SetStateAction<string>>;
  setHandleCost: Dispatch<SetStateAction<number | null>>;
  reservedHandles: ReservedHandlesType;
  pendingSessions: string[];
  paymentSessions: PaymentSession[];
  currentIndex: number;
  stateData: StateResponseBody;
  primed: boolean;
  isPurchasing: boolean;
  stateLoading: boolean;
  currentAccess: false | VerifyResponseBody;
  currentSPOAccess: false | VerifyResponseBody;
  passwordAllowed: boolean;
  poolVerified: boolean;
  poolChallenged: boolean;
  setPasswordAllowed: Dispatch<SetStateAction<boolean>>;
  setReservedHandles: Dispatch<SetStateAction<ReservedHandlesType>>;
  setHandleResponse: Dispatch<SetStateAction<HandleResponseBody>>;
  setTwitterToken: Dispatch<SetStateAction<string>>;
  setIsPurchasing: Dispatch<SetStateAction<boolean>>;
  setPendingSessions: Dispatch<SetStateAction<string[]>>;
  setPaymentSessions: Dispatch<SetStateAction<PaymentSession[]>>;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  setStateData: Dispatch<SetStateAction<StateResponseBody>>;
  setCurrentAccess: React.Dispatch<
    React.SetStateAction<false | VerifyResponseBody>
  >;
  setCurrentSPOAccess: React.Dispatch<
    React.SetStateAction<false | VerifyResponseBody>
  >;
}

export const defaultState: HandleMintContextType = {
  handle: "",
  handleCost: null,
  fetching: false,
  handleResponse: null,
  isPurchasing: false,
  reservedHandles: null,
  pendingSessions: [],
  paymentSessions: [],
  twitterToken: null,
  primed: false,
  currentIndex: 0,
  stateData: null,
  stateLoading: false,
  currentAccess: false,
  currentSPOAccess: false,
  passwordAllowed: false,
  poolVerified: false,
  poolChallenged: false,
  setPasswordAllowed: () => {},
  setHandleResponse: () => {},
  setFetching: () => {},
  setHandle: () => {},
  setHandleCost: () => {},
  setIsPurchasing: () => {},
  setReservedHandles: () => {},
  setTwitterToken: () => {},
  setPendingSessions: () => {},
  setPaymentSessions: () => {},
  setCurrentIndex: () => {},
  setStateData: () => {},
  setCurrentAccess: () => {},
  setCurrentSPOAccess: () => {},
};

export const HandleMintContext =
  createContext<HandleMintContextType>(defaultState);

export const HandleMintContextProvider = ({ children, ...rest }) => {
  const [handle, setHandle] = useState<string>("");
  const [handleCost, setHandleCost] = useState<number | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [handleResponse, setHandleResponse] =
    useState<HandleResponseBody | null>(null);
  const [twitterToken, setTwitterToken] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [reservedHandles, setReservedHandles] =
    useState<ReservedHandlesType | null>(null);
  const [pendingSessions, setPendingSessions] = useState<string[]>(null);
  const [paymentSessions, setPaymentSessions] = useState<PaymentSession[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentAccess, setCurrentAccess] = useState<
    false | VerifyResponseBody
  >(false);
  const [currentSPOAccess, setCurrentSPOAccess] = useState<
    false | VerifyResponseBody
  >(false);
  const [stateData, setStateData] = useState<StateResponseBody>(null);
  const [stateLoading, setStateLoading] = useState<boolean>(true);
  const [passwordAllowed, setPasswordAllowed] = useState(false);

  const [poolVerified, setPoolVerified] = useState(false);
  const [poolChallenged, setPoolChallenged] = useState(false);

  useEffect(() => {
    const updateStateData = async () => {
      await fetch("/.netlify/functions/state")
        .then(async (res) => {
          const data: StateResponseBody = await res.json();
          setStateData(data);
        })
        .catch((e) => {
          setStateData(null);
        })
        .finally(() => {
          setStateLoading(false);
        });
    };

    setCurrentAccess(getAccessTokenFromCookie());
    setCurrentSPOAccess(getSPOAccessTokenCookie());
    setStateLoading(true);
    updateStateData();
  }, []);

  return (
    <HandleMintContext.Provider
      value={{
        ...defaultState,
        fetching,
        handle,
        handleCost,
        handleResponse,
        twitterToken,
        isPurchasing,
        reservedHandles,
        pendingSessions,
        paymentSessions,
        currentIndex,
        stateData,
        passwordAllowed,
        setPasswordAllowed,
        setFetching,
        setHandle,
        setHandleCost,
        setHandleResponse,
        setTwitterToken,
        setIsPurchasing,
        setReservedHandles,
        setPendingSessions,
        setPaymentSessions,
        setCurrentIndex,
        setStateData,
        stateLoading,
        currentAccess,
        setCurrentAccess,
        currentSPOAccess,
        setCurrentSPOAccess,
        poolVerified,
        poolChallenged,
      }}
    >
      {children}
    </HandleMintContext.Provider>
  );
};
