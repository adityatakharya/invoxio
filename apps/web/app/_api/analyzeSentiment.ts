export async function analyzeSentiment(text: string){
  try {
    const response = await fetch('http://127.0.0.1:8001/analyze_sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.log(`HTTP error! status: ${response.status}`);
      return("Error fetching sentiment!")
    }

    const data = await response.json();
    const result = data.sentiment;
    return result;
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    return("Error fetching sentiment!")
  }
}
