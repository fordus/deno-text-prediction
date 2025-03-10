import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts'
import { cors } from 'https://deno.land/x/hono@v4.1.1/middleware.ts'


const app = new Hono()

app.use('/api/*', cors())

app.post('/api/predict', async c => {
  const { text } = await c.req.json()
  if (text == null || text.trim() == '') {
    return c.json({
      text: ''
    })
  }

  let prediction = await fetch(
    'https://text-prediction-nextjs.vercel.app/api',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    }
  )
    .then(res => res.json())
    .then(res => res.text)

  if (prediction.startsWith(text)) {
    prediction = prediction.slice(text.length)
  }

  return c.json({
    text: prediction
  })
})

app.post('/api/completion', async c => {
  const { text } = await c.req.json()
  const { type } = await c.req.json()
  console.log(text)

  //check if text is empty or white spaces
  if (text == null || text.trim() == '') {
    return c.json({
      predictions: [
        {
          text: ' '
        }
      ]
    })
  }

  // const suggestedSentence = await getSuggestion(text);

  //response from cloud function https://worker-floral-silence-5eb8.tres.workers.dev/
  // return new Response(JSON.stringify({
  //   "predictions": [
  //     {
  //       "text": responseText.response,
  //     }
  //   ]
  // }));

  const suggestedSentence = await fetch(
    'https://worker-floral-silence-5eb8.tres.workers.dev/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, type })
    }
  )
    .then(res => res.json())
    .then(res => res.predictions[0].text)

  if (suggestedSentence.response == null || suggestedSentence.response == '') {
    return c.json({
      predictions: [
        {
          text: ' '
        }
      ]
    })
  }

  if (suggestedSentence.response.startsWith(text)) {
    suggestedSentence.response = suggestedSentence.response.slice(text.length)
  }

  return c.json({
    predictions: [
      {
        text: suggestedSentence.response
      }
    ]
  })
})

Deno.serve(app.fetch)
