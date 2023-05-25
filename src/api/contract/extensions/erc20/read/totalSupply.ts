import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { getSDK } from "../../../../../helpers/index";
import {
  baseReplyErrorSchema,
  contractParamSchema,
} from "../../../../../helpers/sharedApiSchemas";
import { Static, Type } from "@sinclair/typebox";
import { currencyValueSchema } from "../../../../../schemas/erc20/standard/currencyValue";

// INPUT
const requestSchema = contractParamSchema;

// OUPUT
const responseSchema = Type.Object({
  result: Type.Optional(currencyValueSchema),
  error: Type.Optional(baseReplyErrorSchema),
});

// LOGIC
export async function erc20TotalSupply(fastify: FastifyInstance) {
  fastify.route<{
    Params: Static<typeof requestSchema>;
    Reply: Static<typeof responseSchema>;
  }>({
    method: "GET",
    url: "/contract/:chain_name_or_id/:contract_address/erc20/totalSupply",
    schema: {
      description: "Get the number of tokens in circulation for the contract.",
      tags: ["ERC20"],
      operationId: "erc20_totalSupply",
      params: requestSchema,
      response: {
        [StatusCodes.OK]: responseSchema,
      },
    },
    handler: async (request, reply) => {
      const { chain_name_or_id, contract_address } = request.params;
      const sdk = await getSDK(chain_name_or_id);
      const contract = await sdk.getContract(contract_address);
      const returnData = await contract.erc20.totalSupply();
      reply.status(StatusCodes.OK).send({
        result: {
          value: returnData.value.toString(),
          symbol: returnData.symbol,
          name: returnData.name,
          decimals: returnData.decimals.toString(),
          displayValue: returnData.displayValue,
        },
      });
    },
  });
}