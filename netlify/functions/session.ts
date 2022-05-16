import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse
} from "@netlify/functions";
import jwt, { decode, JwtPayload } from "jsonwebtoken";

import {
  HEADER_HANDLE,
  HEADER_RECAPTCHA,
  HEADER_TWITTER_ACCESS_TOKEN,
  MAX_SESSION_LENGTH,
  HEADER_IS_SPO,
  MAX_SESSION_LENGTH_SPO,
  HEADER_ALL_SESSIONS
} from "../../src/lib/constants";
import { ensureHandleAvailable, fetchNodeApp, getAccessTokenCookieName, getSessionTokenCookieName, isNumeric } from '../helpers/util';
import { isValid, normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import { getSecret } from "../helpers";
import { verifyTwitterUser } from "../helpers";
import { responseWithMessage, unauthorizedResponse } from "../helpers/response";
import { AccessTokenPayload } from "../helpers/jwt";
import { HandleResponseBody } from "../../src/lib/helpers/search";
import { getCachedState, initFirebase } from "../helpers/firebase";

export interface NodeSessionResponseBody {
  error: boolean,
  message?: string;
  address?: string;
}

export interface SessionResponseBody {
  error: boolean,
  message?: string;
  address: string;
  token: string;
  data: JwtPayload
  allSessionsToken?: string;
  allSessionsData?: JwtPayload;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  try {
    const { headers } = event;

    const headerHandle = headers[HEADER_HANDLE];
    const headerIsSpo = headers[HEADER_IS_SPO] === 'true';
    const headerRecaptcha = headers[HEADER_RECAPTCHA];
    const headerTwitter = headers[HEADER_TWITTER_ACCESS_TOKEN];
    const accessToken = headers[getAccessTokenCookieName(headerIsSpo)];
    const allSessionsToken = headers[HEADER_ALL_SESSIONS];

    // Normalize and validate handle.
    const handle = headerHandle && normalizeNFTHandle(headerHandle);
    const validHandle = handle && isValid(handle);

    if (!headerRecaptcha || !accessToken) {
      return unauthorizedResponse;
    }

    if (!handle || !validHandle) {
      return responseWithMessage(400, 'Invalid handle format.', true);
    }

    // Ensure no one is trying to force an existing Handle.
    const { body, statusCode } = await ensureHandleAvailable(accessToken, handle, headerIsSpo);
    const data: HandleResponseBody = JSON.parse(body);

    if (!data.cost || !isNumeric(data.cost.toString())) {
      return responseWithMessage(400, 'Invalid handle cost.', true);
    }

    if (!data.available && !data.twitter) {
      return {
        statusCode,
        body
      };
    }

    // Verified Twitter user if needed.
    if (data.available && data.twitter && headerTwitter) {
      const exp = headerTwitter && (await verifyTwitterUser(headerTwitter));
      if (!exp || exp > Date.now()) {
        return unauthorizedResponse;
      }
    }

    const { emailAddress } = decode(accessToken) as AccessTokenPayload;

    /**
     * We sign a session JWT tokent to authorize the purchase,
     * and include the access email address to limit request.
     */
    await initFirebase();
    const stateData = await getCachedState();
    const expiresIn = headerIsSpo ? MAX_SESSION_LENGTH_SPO : stateData?.accessWindowTimeoutMinutes * 60 * 1000 ?? MAX_SESSION_LENGTH;
    const sessionSecret = await getSecret('session');
    const sessionToken = jwt.sign(
      {
        iat: Date.now(),
        handle,
        cost: data.cost,
        emailAddress: headerIsSpo ? 'spos@adahandle.com' : emailAddress,
        isSPO: headerIsSpo
      },
      sessionSecret,
      {
        expiresIn: (expiresIn * 1000).toString()
      }
    );

    // Get payment details from server.
    const res: NodeSessionResponseBody = await fetchNodeApp('session', {
      headers: {
        [getAccessTokenCookieName(headerIsSpo)]: accessToken,
        [getSessionTokenCookieName(headerIsSpo)]: sessionToken,
      }
    }).then(res => res.json());

    const mutatedRes: SessionResponseBody = {
      error: res.error,
      message: res?.message || '',
      address: res?.address || '',
      token: sessionToken,
      data: decode(sessionToken) as JwtPayload,
    }

    if (res.error) {
      return {
        statusCode: 500,
        body: JSON.stringify(mutatedRes),
      }
    }

    const sessions = !allSessionsToken ?
      [{ handle, address: res?.address, dateAdded: Date.now() }] :
      [...(decode(allSessionsToken) as JwtPayload).sessions, { handle, address: res?.address, dateAdded: Date.now() }];

    const updatedAllSessionsToken = jwt.sign(
      { sessions },
      sessionSecret,
      {
        expiresIn: '30 days'
      }
    )

    mutatedRes.allSessionsToken = updatedAllSessionsToken;
    mutatedRes.allSessionsData = decode(updatedAllSessionsToken) as JwtPayload;

    return {
      statusCode: 200,
      body: JSON.stringify(mutatedRes),
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Unexpected error.',
      }),
    };
  }
};

export { handler };
