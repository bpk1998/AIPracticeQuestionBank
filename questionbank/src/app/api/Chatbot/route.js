import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { subject, level, examType, mode } = await req.json();

    if (!subject || !level || !examType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const examsWithDiagrams = ['JEE', 'NEET', 'OtherExam'];

    let diagramInstruction = '';
    if (examsWithDiagrams.includes(examType)) {
      diagramInstruction = `
Include diagrams such as Venn diagrams or other relevant illustrations where appropriate based on the exam requirements.
`;
    }

    const prompt = `
You are a subject matter expert for Indian government exams.

Generate 10 multiple-choice questions for the following:

- Exam: ${examType}
- Subject: ${subject}
- Level: ${level}
${diagramInstruction}
You should first determine the expected **medium of instruction** for this subject in this exam context.

**Examples:**
- If exam is "AP DSC" and subject is "Telugu Methodology", use **Telugu**.
- If exam is "SSC" and subject is "Reasoning" or "Mathematics", use **English**.
- If exam is "TSPSC" and subject is "General Studies", use **English**.
- If exam is "SSC MTS" and subject is "General Hindi", use **Hindi**.

Then generate:
- question
- 4 options
- correct option index (0-based)
- explanation

Format everything in the appropriate language based on subject & exam. Output must be a valid **JSON array** of question objects.

Return only a **valid JSON array** without any markdown formatting, code block, or extra commentary. Do NOT include triple backticks 
`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: 'You are a quiz generator assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const improved = data.choices?.[0]?.message?.content;

    return NextResponse.json({ improvedScript: improved });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
