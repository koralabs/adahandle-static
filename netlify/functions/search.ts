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
  HEADER_JWT_ACCESS_TOKEN,
} from "../../src/lib/constants";
import { ensureHandleAvailable } from "../helpers/util";

// Main handler function for GET requests.
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
  callback: HandlerCallback
): Promise<HandlerResponse> => {
  const { headers } = event;

  const headerHandle = headers[HEADER_HANDLE];
  const headerAccess = headers[HEADER_JWT_ACCESS_TOKEN];
  const isSPO = headers[HEADER_IS_SPO] === 'true';

  if (!headerAccess || !headerHandle) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        available: false,
        message: "Unauthorized. Missing request headers.",
      } as HandleResponseBody),
    };
  }

  const handle = normalizeNFTHandle(headerHandle);
  return ensureHandleAvailable(headerAccess, handle, isSPO);
};

export { handler };
