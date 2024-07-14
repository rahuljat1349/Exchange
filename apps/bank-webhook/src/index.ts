import express from "express";
import db from "@repo/db/client";

const app = express();

app.post("/", async (req, res) => {
  // TODO : add zod validation
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  try {
    await db.$transaction([
      // update balance in db
      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),
      // update transaction
      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.json({
      message: "Captured",
    });
  } catch (error) {
    console.log(error);
    res.status(411).json({
        message:"error while processing webhook"
    })
  }
});
