// app/api/analyze/route.js
export async function POST(request) {
  // These both work in API routes:
  const apiUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${apiUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}