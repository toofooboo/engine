import { type Static, Type } from "@sinclair/typebox";
import type { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import { deleteKeypair } from "../../../../shared/db/keypair/delete";
import { keypairCache } from "../../../../shared/utils/cache/keypair";
import { standardResponseSchema } from "../../../schemas/shared-api-schemas";

const requestBodySchema = Type.Object({
  hash: Type.String(),
});

const responseBodySchema = Type.Object({
  result: Type.Object({
    success: Type.Boolean(),
  }),
});

export async function removePublicKey(fastify: FastifyInstance) {
  fastify.route<{
    Body: Static<typeof requestBodySchema>;
    Reply: Static<typeof responseBodySchema>;
  }>({
    method: "POST",
    url: "/auth/keypair/remove",
    schema: {
      summary: "Remove public key",
      description: "Remove the public key for a keypair",
      tags: ["Keypair"],
      operationId: "remove",
      body: requestBodySchema,
      response: {
        ...standardResponseSchema,
        [StatusCodes.OK]: responseBodySchema,
      },
    },
    handler: async (req, res) => {
      const { hash } = req.body;

      await deleteKeypair({ hash });
      keypairCache.clear();

      res.status(StatusCodes.OK).send({
        result: { success: true },
      });
    },
  });
}
