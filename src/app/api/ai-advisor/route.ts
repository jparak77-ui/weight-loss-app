import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Anthropic API klíč není nastaven. Přidej ANTHROPIC_API_KEY do .env.local souboru.' },
      { status: 500 }
    );
  }

  try {
    const { message, profile, macroTargets, history } = await request.json();

    const systemPrompt = `Jsi přátelský a odborný výživový poradce v české aplikaci pro hubnutí NutriPlan.
Odpovídáš výhradně česky. Jsi stručný, praktický a povzbudivý.

${profile ? `Informace o uživateli:
- Jméno: ${profile.name}
- Věk: ${profile.age} let, pohlaví: ${profile.gender === 'male' ? 'muž' : 'žena'}
- Výška: ${profile.height} cm, váha: ${profile.weight} kg, cílová váha: ${profile.targetWeight} kg
- Aktivita: ${profile.activityLevel}
- Cíl: ${profile.goal}
- Styl stravy: ${profile.dietType}
- Jídel za den: ${profile.mealsPerDay}
- Alergie: ${profile.allergies?.join(', ') || 'žádné'}` : ''}

${macroTargets ? `Denní makra:
- Kalorie: ${macroTargets.calories} kcal
- Bílkoviny: ${macroTargets.protein} g
- Sacharidy: ${macroTargets.carbs} g
- Tuky: ${macroTargets.fat} g
- Voda: ${macroTargets.water} ml` : ''}

Pravidla:
1. Odpovídej konkrétně a prakticky – navrhuj konkrétní jídla s gramy
2. Vždy zdůrazňuj dostatečný příjem bílkovin (min. 1,8–2,2 g/kg váhy)
3. U nízkosacharidových dotazů navrhuj: maso, vejce, zeleninu, zdravé tuky
4. U vysokosacharidových dotazů navrhuj: rýži, brambory, těstoviny, ovoce
5. Upozorňuj na zdravotní rizika jen pokud jsou relevantní
6. Nikdy neslibuj zázračné výsledky
7. Zůstaň přátelský, motivující a realistický
8. Odpovědi formátuj přehledně, krátce – max. 4–6 vět nebo stručný seznam`;

    const messages = [
      ...(history || []).map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: systemPrompt,
      messages,
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('AI Advisor error:', error);
    return NextResponse.json(
      { error: error.message || 'Nastala chyba při zpracování dotazu.' },
      { status: 500 }
    );
  }
}
