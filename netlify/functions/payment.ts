import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import jwt from 'jsonwebtoken';

import { HEADER_IS_SPO } from "../../src/lib/constants";
import { getSecret } from "../helpers";
import { fetchNodeApp, getAccessTokenCookieName, getSessionTokenCookieName } from "../helpers/util";

export interface PaymentAddressResponse {
  address: string;
  summary: {
    assetBalances: {
      quantity: string;
      asset: {
        assetName: string;
      }
    }[]
  }
}

export interface PaymentData {
  address: string;
  amount: number;
};

export interface GraphqlPaymentAddressesResponse {
  error: boolean;
  message?: string;
  addresses?: PaymentData[];
}

export interface PaymentResponseBody {
  error: boolean;
  message?: string;
  data: GraphqlPaymentAddressesResponse;
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  try {
    const { headers, queryStringParameters } = event;

    const addresses = queryStringParameters?.addresses;
    const isSPO = headers[HEADER_IS_SPO] === 'true';

    const accessToken = headers[getAccessTokenCookieName(isSPO)];
    const sessionToken = headers[getSessionTokenCookieName(isSPO)];

    if (!accessToken || !sessionToken || !addresses) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: true,
          message: 'Missing required headers and parameters.'
        } as PaymentResponseBody)
      };
    }

    const accessSecret = await getSecret('access');
    const sessionSecret = await getSecret('session');

    if (!sessionSecret || !accessSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: true,
          message: 'Something went wrong with access secrets.'
        } as PaymentResponseBody)
      }
    }

    // Validate access token.
    const validAccessToken = jwt.verify(accessToken as string, accessSecret);
    if (!validAccessToken) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: true,
          message: 'Provided access token was invalid or expired.'
        } as PaymentResponseBody)
      }
    }

    // Validate session token.
    const sessionData = jwt.verify(sessionToken as string, sessionSecret);
    if (!sessionData) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: true,
          message: 'Provided session token was invalid or expired.'
        } as PaymentResponseBody)
      }
    }

    const res = await fetchNodeApp(`payment?addresses=${addresses}`, {
      headers: {
        [getAccessTokenCookieName(isSPO)]: accessToken,
        [getSessionTokenCookieName(isSPO)]: sessionToken
      }
    }).then(res => res.json())

    if (res.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: true,
          message: res.message || ''
        } as PaymentResponseBody)
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        error: false,
        data: res
      })
    }
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
}

export { handler };
