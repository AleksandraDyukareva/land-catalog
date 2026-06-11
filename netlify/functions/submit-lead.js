exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const WEBHOOK = process.env.BITRIX_WEBHOOK;
  if (!WEBHOOK) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Not configured' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const params = new URLSearchParams();
  params.append('fields[TITLE]', data.title || 'Заявка с сайта');
  params.append('fields[NAME]', data.name || '');
  params.append('fields[PHONE][0][VALUE]', data.phone || '');
  params.append('fields[PHONE][0][VALUE_TYPE]', 'WORK');
  params.append('fields[COMMENTS]', data.comment || '');
  params.append('fields[SOURCE_ID]', 'WEB');
  params.append('fields[ASSIGNED_BY_ID]', '15');

  try {
    const res = await fetch(WEBHOOK + 'crm.lead.add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (!res.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'CRM error' }) };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
