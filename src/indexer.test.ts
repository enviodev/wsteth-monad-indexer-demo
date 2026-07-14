import { describe, it, expect } from "vitest";
import { createTestIndexer } from "envio";
import "./handlers/ERC20.ts";

describe("wsteth-monad-indexer-demo", () => {
  it("indexes Transfer balances", async () => {
    const indexer = createTestIndexer();
    const from = "0x0000000000000000000000000000000000000001";
    const to = "0x0000000000000000000000000000000000000002";

    await indexer.process({
      chains: {
        143: {
          simulate: [
            {
              contract: "ERC20",
              event: "Transfer",
              params: { from, to, value: 1000n },
            },
          ],
        },
      },
    });

    const sender = await indexer.Account.getOrThrow(from);
    const receiver = await indexer.Account.getOrThrow(to);
    expect(sender.balance).toBe(-1000n);
    expect(receiver.balance).toBe(1000n);
  }, 30_000);
});
