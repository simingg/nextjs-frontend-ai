export async function POST(request) {
  const apiUrl = process.env.API_BASE_URL || 'http://fastapi-docker-ai-env.eba-e9tnf5p2.ap-southeast-1.elasticbeanstalk.com';

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const forwardedFormData = new FormData();

    for (const [key, value] of formData.entries()) {
      forwardedFormData.append(key, value);
    }

    const backendResponse = await fetch(`${apiUrl}/analyze`, {
      method: 'POST',
      body: forwardedFormData,
    });

    const data = await backendResponse.json();
    return Response.json(data, { status: backendResponse.status });
  } else {
    const jsonBody = await request.json();

    const backendResponse = await fetch(`${apiUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonBody),
    });

    const data = await backendResponse.json();
    return Response.json(data, { status: backendResponse.status });
  }
}