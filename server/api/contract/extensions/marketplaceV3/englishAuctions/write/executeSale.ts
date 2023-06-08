import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { getContractInstance } from "../../../../../../../core";
import { Static, Type } from "@sinclair/typebox";
import {
  contractParamSchema,
  standardResponseSchema,
  transactionWritesResponseSchema,
} from "../../../../../../helpers/sharedApiSchemas";
import { queueTransaction } from "../../../../../../helpers";

// INPUT
const requestSchema = contractParamSchema;
const requestBodySchema = Type.Object({
  listing_id: Type.String({
    description: "The ID of the listing to execute the sale for.",
  }),
});

requestBodySchema.examples = [
  {
    assetContractAddress: "0x19411143085F1ec7D21a7cc07000CBA5188C5e8e",
    tokenId: "0",
    pricePerToken: "0.00000001",
    isReservedListing: false,
    quantity: "1",
    startTimestamp: 1686006043038,
    endTimestamp: 1686610889058,
  },
];

// LOGIC
export async function englishAuctionsExecuteSale(fastify: FastifyInstance) {
  fastify.route<{
    Params: Static<typeof requestSchema>;
    Reply: Static<typeof transactionWritesResponseSchema>;
    Body: Static<typeof requestBodySchema>;
  }>({
    method: "POST",
    url: "/marketplace/v3/:chain_name_or_id/:contract_address/englishauctions/executeSale",
    schema: {
      description: `Close the auction for both buyer and seller.
      This means the NFT(s) will be transferred to the buyer and the seller will receive the funds.
      This function can only be called after the auction has ended.
      `,
      tags: ["MarketplaceV3-EnglishAuctions"],
      operationId: "mktpv3_englishAuctions_executeSale",
      params: requestSchema,
      body: requestBodySchema,
      response: {
        ...standardResponseSchema,
        [StatusCodes.OK]: transactionWritesResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const { chain_name_or_id, contract_address } = request.params;
      const { listing_id } = request.body;

      const contract = await getContractInstance(
        chain_name_or_id,
        contract_address,
      );
      const tx = await contract.englishAuctions.executeSale.prepare(listing_id);

      const queuedId = await queueTransaction(
        request,
        tx,
        chain_name_or_id,
        "V3-englishAuctions",
      );
      reply.status(StatusCodes.OK).send({
        result: queuedId,
      });
    },
  });
}