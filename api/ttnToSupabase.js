export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  const payload = req.body.uplink_message?.decoded_payload;
  if (!payload) return res.status(400).send("Missing payload");

  // Připrav data pro zápis
  const data = {
    iaq: payload.iaq,
    iaq_accuracy: payload.iaq_accuracy,
    temperature: payload.temperature,
    humidity: payload.humidity,
    pressure: payload.pressure,
    bvoc: payload.bvoc,
    co2: payload.co2,
    noise_dbc: payload.noise_dbc,
    pm1_0: payload.pm1_0,
    pm1_0_2_5: payload.pm1_0_2_5,
    pm2_5_4_0: payload.pm2_5_4_0,
    pm4_0_10: payload.pm4_0_10,
    typical_size: payload.typical_size,
    timestamp: new Date().toISOString()
  };

  // Odeslání do Supabase
  const result = await fetch("https://YOUR_PROJECT.supabase.co/rest/v1/measurements", {
    method: "POST",
    headers: {
      "apikey": "YOUR_SERVICE_ROLE_KEY",
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(data)
  });

  if (result.ok) {
    res.status(200).send("Data saved to Supabase.");
  } else {
    const errorText = await result.text();
    res.status(500).send("Supabase error: " + errorText);
  }
}
