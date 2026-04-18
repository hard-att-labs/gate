async function generatePoW() {
  let nonce = 0;

  while (true) {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode("hardatt" + nonce)
    );

    const arr = new Uint8Array(hash);

    if (arr[0] === 0) return nonce;

    nonce++;
  }
}

async function requestToken() {
  const pow = await generatePoW();

  const res = await fetch("http://localhost:3000/issue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pk: "demo-key",
      pow
    })
  });

  return res.json();
}

async function verify(token) {
  const res = await fetch("http://localhost:3000/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });

  return res.json();
}

(async () => {
  const { token } = await requestToken();
  console.log("TOKEN:", token);

  const result = await verify(token);
  console.log("VERIFY:", result);
})();
