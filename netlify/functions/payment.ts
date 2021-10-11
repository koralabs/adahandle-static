import {
  Handler,
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";
import jwt from 'jsonwebtoken';
import { fetch } from 'cross-fetch';

import { HEADER_APPCHECK, HEADER_JWT_ACCESS_TOKEN, HEADER_JWT_SESSION_TOKEN, HEADER_PHONE } from "../../src/lib/constants";
import { getSecret, verifyAppCheck } from "../helpers";

export interface PaymentAddressResponse {
  address: string;
  summary: {
    assetBalances: {
      quantity: number;
      asset: {
        assetName: string;
      }
    }[]
  }
}

export interface PaymentAddressBody {
  address: string;
  paid: boolean;
}

export interface PaymentResponseBody {
  error: boolean;
  message?: string;
  addresses: PaymentAddressBody[]
}

export interface GraphqlPaymentAddressesResponse {
  data: {
    paymentAddresses: PaymentAddressResponse[]
  }
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> => {
  const { headers, queryStringParameters } = event;

  const addresses = queryStringParameters?.addresses;
  const appCheck = headers[HEADER_APPCHECK];
  const accessToken = headers[HEADER_JWT_ACCESS_TOKEN];
  const sessionToken = headers[HEADER_JWT_SESSION_TOKEN];

  if (!accessToken || !sessionToken || !appCheck || !addresses) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: true,
        message: 'Must provide a valid access and session token.'
      } as PaymentResponseBody)
    };
  }

  const verified = await verifyAppCheck(appCheck as string);
  if (!verified) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: true,
        message: `Unauthorized. Invalid AppCheck token: ${appCheck}.`
      } as PaymentResponseBody)
    }
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

  const url = process.env.NODE_ENV === 'development'
    ? process.env.GRAPHQL_TESTNET_URL
    : process.env.GRAPHQL_MAINNET_URL

  const res: GraphqlPaymentAddressesResponse = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variables: {
        addresses: addresses.split(','),
      },
      query: `
        query ($addresses: [String!]!) {
          paymentAddresses(
            addresses: $addresses
          ) {
            address
            summary{
              assetBalances {
                quantity
                asset {
                  assetName
                }
              }
            }
          }
        }
      `,
    })
  }).then(res => res.json())

  if (!res?.data) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: true,
        message: 'Could not query payment address.'
      } as PaymentResponseBody)
    }
  }

  const {
    data: {
      paymentAddresses
    },
  } = res;

  const data: PaymentResponseBody = {
    error: false,
    addresses: paymentAddresses.map((paymentAddress) => {
      const utxos = paymentAddress?.summary?.assetBalances || null;
      if (!utxos || !utxos.find(
        ({ quantity, asset }) => asset.assetName === "ada" && quantity > 0
      )) {
        return {
          address: paymentAddress.address,
          paid: false
        };
      }

      return {
        address: paymentAddress.address,
        paid: true
      };
    })
  };

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}

export { handler };
