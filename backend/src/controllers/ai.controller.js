const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = async (req, res) => {
  const { messages, systemPrompt } = req.body;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1000,
    });

    res.json({ content: [{ text: completion.choices[0].message.content }] });
  } catch (err) {
    console.error('❌ Error en IA:', err);
    res.status(500).json({ message: err.message });
  }
};