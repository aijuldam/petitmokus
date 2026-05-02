export type EmailLanguage = "EN" | "FR" | "HU" | "DE";

interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

const APP_URL = "https://petitmokus.com";

const UNSUBSCRIBE_PLACEHOLDER = "{UNSUBSCRIBE_URL}";

function buildHtml(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Petit Mokus</title>
</head>
<body style="margin:0;padding:0;background:#F9F6F1;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F6F1;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#FDFDFC;border-radius:20px;border:1px solid #E8DDD3;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#D897A8 0%,#c47d93 100%);padding:28px 32px;text-align:center;">
            <p style="margin:0;font-size:28px;">🐿</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:bold;letter-spacing:0.5px;">Petit Mokus</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px;font-style:italic;">Little Moments Matter</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 24px;color:#5C4A3D;font-size:15px;line-height:1.7;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px 28px;border-top:1px solid #E8DDD3;">
            <p style="margin:0;font-size:10px;color:#9C8878;text-align:center;line-height:1.6;">
              ${UNSUBSCRIBE_PLACEHOLDER}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const TEMPLATES: Record<EmailLanguage, EmailContent> = {
  EN: {
    subject: "Welcome to Petit Mokus 🐿",
    text: `Welcome to Petit Mokus!

Hi there,

Welcome to Petit Mokus — your gentle digital companion for families.

We're a French-Hungarian family from Amsterdam, and we built Petit Mokus to help children grow through calming routines, soothing sounds, and simple learning. Like a little squirrel gathering precious moments, we're here to help your family feel more connected, one small interaction at a time.

Whenever you're ready, open the app and start your first routine with your little one.

👉 ${APP_URL}

With warmth,
The Petit Mokus team 🐿

---
This is a marketing email. You can unsubscribe at any time.
${UNSUBSCRIBE_PLACEHOLDER}`,
    html: buildHtml(`
      <p style="margin:0 0 16px;">Hi there,</p>
      <p style="margin:0 0 16px;">Welcome to <strong>Petit Mokus</strong> — your gentle digital companion for families.</p>
      <p style="margin:0 0 16px;">We're a French-Hungarian family from Amsterdam, and we built Petit Mokus to help children grow through <strong>calming routines, soothing sounds, and simple learning</strong>. Like a little squirrel gathering precious moments, we're here to help your family feel more connected, one small interaction at a time.</p>
      <p style="margin:0 0 24px;">Whenever you're ready, open the app and start your first routine with your little one.</p>
      <p style="margin:0 0 24px;text-align:center;">
        <a href="${APP_URL}" style="display:inline-block;background:#D897A8;color:#fff;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:50px;text-decoration:none;">Open Petit Mokus →</a>
      </p>
      <p style="margin:0;color:#9C8878;font-size:13px;">With warmth,<br/>The Petit Mokus team 🐿</p>
      <p style="margin:16px 0 0;font-size:10px;color:#B8A898;">This is a marketing email. You can unsubscribe at any time.<br/>${UNSUBSCRIBE_PLACEHOLDER}</p>`),
  },

  FR: {
    subject: "Bienvenue chez Petit Mokus 🐿",
    text: `Bienvenue chez Petit Mokus !

Bonjour,

Bienvenue chez Petit Mokus — votre compagnon numérique bienveillant pour les familles.

Nous sommes une famille franco-hongroise d'Amsterdam, et nous avons créé Petit Mokus pour accompagner la croissance des enfants à travers des routines apaisantes, des sons doux et un apprentissage simple. Comme un petit écureuil qui rassemble de précieux instants, nous sommes là pour aider votre famille à se sentir plus connectée, un moment à la fois.

Quand vous serez prêt, ouvrez l'application et commencez votre première routine avec votre enfant.

👉 ${APP_URL}

Avec toute notre chaleur,
L'équipe Petit Mokus 🐿

---
Ceci est un e-mail marketing. Vous pouvez vous désabonner à tout moment.
${UNSUBSCRIBE_PLACEHOLDER}`,
    html: buildHtml(`
      <p style="margin:0 0 16px;">Bonjour,</p>
      <p style="margin:0 0 16px;">Bienvenue chez <strong>Petit Mokus</strong> — votre compagnon numérique bienveillant pour les familles.</p>
      <p style="margin:0 0 16px;">Nous sommes une famille franco-hongroise d'Amsterdam, et nous avons créé Petit Mokus pour accompagner la croissance des enfants à travers des <strong>routines apaisantes, des sons doux et un apprentissage simple</strong>. Comme un petit écureuil qui rassemble de précieux instants, nous sommes là pour aider votre famille à se sentir plus connectée, un moment à la fois.</p>
      <p style="margin:0 0 24px;">Quand vous serez prêt, ouvrez l'application et commencez votre première routine avec votre enfant.</p>
      <p style="margin:0 0 24px;text-align:center;">
        <a href="${APP_URL}" style="display:inline-block;background:#D897A8;color:#fff;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:50px;text-decoration:none;">Ouvrir Petit Mokus →</a>
      </p>
      <p style="margin:0;color:#9C8878;font-size:13px;">Avec toute notre chaleur,<br/>L'équipe Petit Mokus 🐿</p>
      <p style="margin:16px 0 0;font-size:10px;color:#B8A898;">Ceci est un e-mail marketing. Vous pouvez vous désabonner à tout moment.<br/>${UNSUBSCRIBE_PLACEHOLDER}</p>`),
  },

  HU: {
    subject: "Üdvözlünk a Petit Mókusnál 🐿",
    text: `Üdvözlünk a Petit Mókusnál!

Szia,

Üdvözlünk a Petit Mókusnál — a te kedves digitális társadnál, amely a családokért van.

Egy amszterdami francia-magyar családból születtünk, és azért hoztuk létre a Petit Mókust, hogy nyugtató rutinok, lágy hangok és egyszerű tanulás révén segítsük a gyermekek fejlődését. Mint egy kis mókus, aki értékes pillanatokat gyűjt, mi is ott vagyunk, hogy közelebb hozzuk egymáshoz a családokat, egy apró gesztussal egyszerre.

Ha készen állsz, nyisd meg az alkalmazást, és kezdd el az első rutint a kicsiddel.

👉 ${APP_URL}

Szeretettel,
A Petit Mókus csapata 🐿

---
Ez egy marketing e-mail. Bármikor leiratkozhatsz.
${UNSUBSCRIBE_PLACEHOLDER}`,
    html: buildHtml(`
      <p style="margin:0 0 16px;">Szia,</p>
      <p style="margin:0 0 16px;">Üdvözlünk a <strong>Petit Mókusnál</strong> — a te kedves digitális társadnál, amely a családokért van.</p>
      <p style="margin:0 0 16px;">Egy amszterdami francia-magyar családból születtünk, és azért hoztuk létre a Petit Mókust, hogy <strong>nyugtató rutinok, lágy hangok és egyszerű tanulás</strong> révén segítsük a gyermekek fejlődését. Mint egy kis mókus, aki értékes pillanatokat gyűjt, mi is ott vagyunk, hogy közelebb hozzuk egymáshoz a családokat, egy apró gesztussal egyszerre.</p>
      <p style="margin:0 0 24px;">Ha készen állsz, nyisd meg az alkalmazást, és kezdd el az első rutint a kicsiddel.</p>
      <p style="margin:0 0 24px;text-align:center;">
        <a href="${APP_URL}" style="display:inline-block;background:#D897A8;color:#fff;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:50px;text-decoration:none;">Petit Mókus megnyitása →</a>
      </p>
      <p style="margin:0;color:#9C8878;font-size:13px;">Szeretettel,<br/>A Petit Mókus csapata 🐿</p>
      <p style="margin:16px 0 0;font-size:10px;color:#B8A898;">Ez egy marketing e-mail. Bármikor leiratkozhatsz.<br/>${UNSUBSCRIBE_PLACEHOLDER}</p>`),
  },

  DE: {
    subject: "Willkommen bei Petit Mokus 🐿",
    text: `Willkommen bei Petit Mokus!

Hallo,

Willkommen bei Petit Mokus — deinem sanften digitalen Begleiter für Familien.

Wir sind eine französisch-ungarische Familie aus Amsterdam und haben Petit Mokus entwickelt, um Kinder durch beruhigende Routinen, sanfte Klänge und einfaches Lernen zu fördern. Wie ein kleines Eichhörnchen, das kostbare Momente sammelt, sind wir da, um Familien einander näher zu bringen — einen kleinen Schritt nach dem anderen.

Wenn du bereit bist, öffne die App und beginne deine erste Routine mit deinem Kind.

👉 ${APP_URL}

Mit herzlichen Grüßen,
Das Petit Mokus Team 🐿

---
Dies ist eine Marketing-E-Mail. Du kannst dich jederzeit abmelden.
${UNSUBSCRIBE_PLACEHOLDER}`,
    html: buildHtml(`
      <p style="margin:0 0 16px;">Hallo,</p>
      <p style="margin:0 0 16px;">Willkommen bei <strong>Petit Mokus</strong> — deinem sanften digitalen Begleiter für Familien.</p>
      <p style="margin:0 0 16px;">Wir sind eine französisch-ungarische Familie aus Amsterdam und haben Petit Mokus entwickelt, um Kinder durch <strong>beruhigende Routinen, sanfte Klänge und einfaches Lernen</strong> zu fördern. Wie ein kleines Eichhörnchen, das kostbare Momente sammelt, sind wir da, um Familien einander näher zu bringen — einen kleinen Schritt nach dem anderen.</p>
      <p style="margin:0 0 24px;">Wenn du bereit bist, öffne die App und beginne deine erste Routine mit deinem Kind.</p>
      <p style="margin:0 0 24px;text-align:center;">
        <a href="${APP_URL}" style="display:inline-block;background:#D897A8;color:#fff;font-weight:bold;font-size:14px;padding:12px 28px;border-radius:50px;text-decoration:none;">Petit Mokus öffnen →</a>
      </p>
      <p style="margin:0;color:#9C8878;font-size:13px;">Mit herzlichen Grüßen,<br/>Das Petit Mokus Team 🐿</p>
      <p style="margin:16px 0 0;font-size:10px;color:#B8A898;">Dies ist eine Marketing-E-Mail. Du kannst dich jederzeit abmelden.<br/>${UNSUBSCRIBE_PLACEHOLDER}</p>`),
  },
};

export function getEmailTemplate(language: EmailLanguage): EmailContent {
  return TEMPLATES[language] ?? TEMPLATES.EN;
}

export function resolveLanguage(raw: string | undefined | null): EmailLanguage {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "FR") return "FR";
  if (upper === "HU") return "HU";
  if (upper === "DE") return "DE";
  return "EN";
}
