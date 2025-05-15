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
    pm1: payload.pm1_0,
    pm2_5: payload.pm1_0_2_5,
    pm4: payload.pm2_5_4_0,
    pm10: payload.pm4_0_10,
    typical_size: payload.typical_size,
    baterry_percent: payload.battery_percent,
    timestamp: new Date().toISOString()
  };

  // Odeslání do Supabase
  const result = await fetch("https://odteybpzzqgvjcezvnhh.supabase.co/rest/v1/measurements", {
    method: "POST",
    headers: {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdGV5YnB6enFndmpjZXp2bmhoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI0NzA5OSwiZXhwIjoyMDYyODIzMDk5fQ.fRKmF6Dcr5YOxZn0svgJk9V4YMWkxL1qVt0ciLycLS4",
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
