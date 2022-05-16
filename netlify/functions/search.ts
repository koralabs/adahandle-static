import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerCallback,
  HandlerResponse,
} from "@netlify/functions";
import {
  HandleResponseBody,
} from "../../src/lib/helpers/search";
import { normalizeNFTHandle } from "../../src/lib/helpers/nfts";
import {
  HEADER_HANDLE,
  HEADER_IS_SPO,
  MAX_SESSION_LENGTH,
  MAX_SESSION_LENGTH_SPO
} from "../../src/lib/constants";
import { ensureHandleAvailable, getAccessTokenCookieName } from "../helpers/util";
import { getSecret } from "../helpers";
import { getCachedState, initFirebase } from "../helpers/firebase";

import jwt, { decode, JwtPayload } from "jsonwebtoken";

// Main handler function for GET requests.
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
  callback: HandlerCallback
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerHandle = headers[HEADER_HANDLE];
  const isSPO = headers[HEADER_IS_SPO] === 'true';
  const headerAccess = headers[getAccessTokenCookieName(isSPO)];

  if (!headerAccess || !headerHandle) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        available: false,
        message: "Unauthorized. Missing request headers.",
      } as HandleResponseBody),
    };
  }

  try {
    const handle = normalizeNFTHandle(headerHandle);
    const result = await ensureHandleAvailable(headerAccess, handle, isSPO);
    const resultData: HandleResponseBody = JSON.parse(result.body);

    if (resultData.tooMany) {
      await initFirebase();
      const sessionSecret = await getSecret('session');
      const data = await getCachedState();
      const expiresIn = isSPO ? MAX_SESSION_LENGTH_SPO : data?.accessWindowTimeoutMinutes * 60 * 1000 ?? MAX_SESSION_LENGTH;
      const tokens = resultData.sessions?.map(session => {
        const jwtToken = jwt.sign(
          {
            iat: Date.now(),
            handle: session.handle,
            // cost is coming in from the session so it will be lovelace
            cost: session.cost / 1000000,
            emailAddress: isSPO ? 'spos@adahandle.com' : session.emailAddress,
            isSPO: isSPO
          },
          sessionSecret,
          {
            expiresIn: (expiresIn * 1000).toString()
          }
        );
        return {
          token: jwtToken,
          data: jwt.decode(jwtToken),
          address: session.paymentAddress,
        }
      });

      return {
        statusCode: result.statusCode,
        body: JSON.stringify({
          ...resultData,
          tokens
        })
      }
    }


    return result;
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        available: false,
        error: true,
        message: 'Unexpected error.',
      }),
    };
  }
};

export { handler };
