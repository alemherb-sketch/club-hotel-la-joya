// Proxy server-side para consulta de DNI/RUC.
// apis.net.pe no envia cabeceras CORS, por lo que el navegador bloquea la
// llamada directa. Al ejecutarse en el servidor (Edge Function), esta
// restriccion no aplica, y aqui agregamos CORS para que el frontend pueda
// consumir esta funcion sin problemas.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const tipo = (url.searchParams.get("tipo") || "").toLowerCase();
  const numero = (url.searchParams.get("numero") || "").trim();

  if (tipo !== "dni" && tipo !== "ruc") {
    return new Response(JSON.stringify({ error: "Parametro 'tipo' debe ser 'dni' o 'ruc'" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const isValidNumero = tipo === "dni" ? /^\d{8}$/.test(numero) : /^\d{11}$/.test(numero);
  if (!isValidNumero) {
    return new Response(JSON.stringify({ error: `Numero de ${tipo.toUpperCase()} invalido` }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const upstream = await fetch(`https://api.apis.net.pe/v1/${tipo}?numero=${numero}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: "El servicio de consulta no respondio correctamente" }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "No se pudo consultar el documento", detail: String(err) }), {
      status: 504,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
