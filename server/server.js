import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const SECRET = "HARDATT_V7_FINAL_SECRET";

function sign(data) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

function verify(data, sig) {
  return sign(data) === sig;
}

function powThreshold(pow) {
  return 500 + Math.min(pow * 5, 5000);
}

app.post("/issue", (req, res) => {
  const { pk, pow } = req.body;

  if (!pk || typeof pow !== "number") {
    return res.json({ error: "invalid_request" });
  }

  const required = powThreshold(pow);

  if (pow < required) {
    return res.json({ error: "insufficient_pow", required });
  }

  const payload = {
    pk,
    pow,
    ts: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 600
  };

  const data = JSON.stringify(payload);
  const signature = sign(data);

  const token = Buffer.from(data).toString("base64") + "." + signature;

  res.json({ token });
});

app.post("/verify", (req, res) => {
  const { token } = req.body;

  try {
    const [body, sig] = token.split(".");
    const data = Buffer.from(body, "base64").toString();

    const payload = JSON.parse(data);

    const validSig = verify(data, sig);
    const notExpired = payload.exp > Math.floor(Date.now() / 1000);

    res.json({ valid: validSig && notExpired });

  } catch {
    res.json({ valid: false });
  }
});

app.listen(3000, () => {
  console.log("HARD-ATT V7 LIVE");
});
