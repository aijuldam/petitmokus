export type EmailLanguage = "EN" | "FR" | "HU" | "DE";

interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

const APP_URL = "https://petitmokus.com";

const UNSUBSCRIBE_PLACEHOLDER = "{UNSUBSCRIBE_URL}";

const UNSUBSCRIBE_LABELS: Record<EmailLanguage, string> = {
  EN: "Unsubscribe",
  FR: "Se désabonner",
  HU: "Leiratkozás",
  DE: "Abmelden",
};

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
This is a marketing email. You can unsubscribe at any time:
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
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E8DDD3;font-size:11px;color:#B8A898;text-align:center;">This is a marketing email. <a href="${UNSUBSCRIBE_PLACEHOLDER}" style="color:#9C8878;text-decoration:underline;">Unsubscribe</a> at any time.</p>`),
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
Ceci est un e-mail marketing. Vous pouvez vous désabonner à tout moment :
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
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E8DDD3;font-size:11px;color:#B8A898;text-align:center;">Ceci est un e-mail marketing. <a href="${UNSUBSCRIBE_PLACEHOLDER}" style="color:#9C8878;text-decoration:underline;">Se désabonner</a> à tout moment.</p>`),
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
Ez egy marketing e-mail. Bármikor leiratkozhatsz:
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
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E8DDD3;font-size:11px;color:#B8A898;text-align:center;">Ez egy marketing e-mail. Bármikor <a href="${UNSUBSCRIBE_PLACEHOLDER}" style="color:#9C8878;text-decoration:underline;">leiratkozhatsz</a>.</p>`),
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
Dies ist eine Marketing-E-Mail. Du kannst dich jederzeit abmelden:
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
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #E8DDD3;font-size:11px;color:#B8A898;text-align:center;">Dies ist eine Marketing-E-Mail. Du kannst dich jederzeit <a href="${UNSUBSCRIBE_PLACEHOLDER}" style="color:#9C8878;text-decoration:underline;">abmelden</a>.</p>`),
  },
};

export function getEmailTemplate(language: EmailLanguage): EmailContent {
  return TEMPLATES[language] ?? TEMPLATES.EN;
}

export function renderTemplateWithUnsubscribe(
  language: EmailLanguage,
  unsubscribeUrl: string,
): EmailContent {
  const tpl = getEmailTemplate(language);
  const replaceAll = (s: string) =>
    s.split(UNSUBSCRIBE_PLACEHOLDER).join(unsubscribeUrl);
  return {
    subject: tpl.subject,
    text: replaceAll(tpl.text),
    html: replaceAll(tpl.html),
  };
}

export function resolveLanguage(raw: string | undefined | null): EmailLanguage {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "FR") return "FR";
  if (upper === "HU") return "HU";
  if (upper === "DE") return "DE";
  return "EN";
}

interface UnsubPageContent {
  title: string;
  body: string;
  back: string;
  errorTitle: string;
  errorBody: string;
}

const UNSUB_PAGES: Record<EmailLanguage, UnsubPageContent> = {
  EN: {
    title: "You're unsubscribed 🐿",
    body: "We've removed your email from the Petit Mokus newsletter. Sorry to see you go — you can sign up again anytime from the website.",
    back: "← Back to petitmokus.com",
    errorTitle: "Link not valid",
    errorBody: "This unsubscribe link is invalid or has expired. Please contact us at hello@petitmokus.com if you'd like to be removed from our newsletter.",
  },
  FR: {
    title: "Vous êtes désabonné 🐿",
    body: "Nous avons supprimé votre adresse de la newsletter Petit Mokus. Désolé de vous voir partir — vous pouvez vous réinscrire à tout moment depuis le site.",
    back: "← Retour à petitmokus.com",
    errorTitle: "Lien invalide",
    errorBody: "Ce lien de désabonnement est invalide ou a expiré. Veuillez nous contacter à hello@petitmokus.com si vous souhaitez être retiré de notre newsletter.",
  },
  HU: {
    title: "Sikeresen leiratkoztál 🐿",
    body: "Töröltük az e-mail címed a Petit Mókus hírlevelünkből. Sajnáljuk, hogy elmész — bármikor újra feliratkozhatsz a weboldalon.",
    back: "← Vissza a petitmokus.com oldalra",
    errorTitle: "Érvénytelen link",
    errorBody: "Ez a leiratkozási link érvénytelen vagy lejárt. Kérlek, írj nekünk a hello@petitmokus.com címre, ha el szeretnéd távolítani magad a hírlevelünkből.",
  },
  DE: {
    title: "Du bist abgemeldet 🐿",
    body: "Wir haben deine E-Mail-Adresse aus dem Petit Mokus Newsletter entfernt. Schade, dass du gehst — du kannst dich jederzeit wieder auf der Website anmelden.",
    back: "← Zurück zu petitmokus.com",
    errorTitle: "Ungültiger Link",
    errorBody: "Dieser Abmeldelink ist ungültig oder abgelaufen. Bitte kontaktiere uns unter hello@petitmokus.com, wenn du aus unserem Newsletter entfernt werden möchtest.",
  },
};

function unsubPage(title: string, body: string, back: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F9F6F1;font-family:Georgia,serif;min-height:100vh;">
  <div style="max-width:520px;margin:0 auto;padding:64px 24px;text-align:center;">
    <div style="background:#FDFDFC;border:1px solid #E8DDD3;border-radius:20px;padding:48px 32px;">
      <p style="font-size:48px;margin:0 0 8px;">🐿</p>
      <h1 style="color:#5C4A3D;font-size:24px;margin:0 0 16px;">${title}</h1>
      <p style="color:#5C4A3D;font-size:15px;line-height:1.7;margin:0 0 32px;">${body}</p>
      <a href="${APP_URL}" style="display:inline-block;color:#D897A8;font-size:14px;text-decoration:none;font-weight:bold;">${back}</a>
    </div>
  </div>
</body>
</html>`;
}

export function renderUnsubscribeSuccessPage(language: EmailLanguage): string {
  const c = UNSUB_PAGES[language] ?? UNSUB_PAGES.EN;
  return unsubPage(c.title, c.body, c.back);
}

export function renderUnsubscribeErrorPage(language: EmailLanguage): string {
  const c = UNSUB_PAGES[language] ?? UNSUB_PAGES.EN;
  return unsubPage(c.errorTitle, c.errorBody, c.back);
}
