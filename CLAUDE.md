# Halmstad Kampsport – klubbapp

PWA för en kampsportsklubb (BJJ, Wrestling/SW, MMA) med ca 300 medlemmar.
Appen är på **svenska**. Allt användarvännt (UI, felmeddelanden, mejl) skrivs på svenska.
Kod, variabelnamn, tabeller och kommentarer skrivs på engelska.

## Vad appen gör (MVP-scope)

1. **Teknikarkiv** – tränare lägger in tekniker med YouTube-länk, position, typ, nivå.
2. **Passbyggare** – tränare sätter ihop dagens pass från arkivet och publicerar.
3. **Dagens pass** – medlemmar ser publicerat pass med videos i den ordning tränaren valt.
4. **Strength & Conditioning** – ett grundprogram för alla medlemmar, samt ett valbart
   6–8 veckors toppningsprogram inför tävling.

## Utanför scope (bygg INTE detta utan att jag ber om det)

- Bokning av klasser
- Betalning / medlemsavgifter (klubben använder Svenskalag.se tills vidare)
- Loggning av vikter/reps (S&C är bara läsbart)
- Personliga S&C-program per medlem
- Egen videohosting – videos hämtas alltid från YouTube via embed
- Native-appar (iOS/Android). Vi bygger en PWA.

## Stack

- Next.js (App Router) + TypeScript (strict)
- Supabase: Postgres, Auth (magic link), Row Level Security
- Tailwind CSS
- Hosting: Vercel
- Tester: Vitest för logik, Playwright för 2–3 kritiska flöden

## Mappstruktur

```
src/
  app/
    (auth)/login/          # magic link-inloggning
    (app)/                 # inloggade vyer; layout = skal (header + bottom nav)
      idag/                # dagens pass
      tekniker/            # sök/bläddra i arkivet (läsa), [id] = teknik + video
      styrka/              # S&C-program
      traning/             # tränarvyer, kräver roll coach/admin (layout + sida)
        arkiv/             # skapa/redigera tekniker  → /traning/arkiv
        pass/              # bygg och publicera pass  → /traning/pass
        styrka/            # redigera S&C-program     → /traning/styrka
      admin/medlemmar/     # godkänn/inaktivera medlemmar
  components/              # delade UI-komponenter (ui.ts = knapp/input-klasser)
  lib/
    supabase/              # klienter (server/browser), genererade typer
    youtube.ts             # parse av länk -> video-ID + starttid
    auth.ts                # hjälpare för roll/status
  features/
    techniques/            # queries, actions, komponenter per feature
    sessions/
    strength/
supabase/
  migrations/              # all schemaändring sker här, aldrig via dashboarden
```

Håll feature-logik i `src/features/<namn>/`. Sidor i `app/` ska vara tunna.

## Konventioner

- Databasnamn: `snake_case`, engelska. UI-text: svenska.
- Alla skrivningar går via Server Actions och valideras med Zod.
- Förlita dig på RLS för behörighet, men kontrollera även roll i Server Actions.
- Generera databastyper med `supabase gen types typescript` efter varje migration.
- Små commits, en feature per branch. Skriv commit-meddelanden på engelska.
- Mobil först. Tränare bygger pass från telefon, så tryckytor ≥ 44px.

## Regler för Claude

- Förklara kort *varför* du väljer en lösning, jag är junior och ska kunna underhålla koden.
- Lägg inte till beroenden utan att fråga.
- Ändra aldrig en gammal migration. Skapa en ny.
- Spara aldrig hemligheter i repot. Använd `.env.local` och uppdatera `.env.example`.
- Spara så lite persondata som möjligt (namn + e-post). Inga hälsouppgifter.
- Skriv tester för `youtube.ts` och för logiken som räknar ut aktuell vecka i toppningsprogram.

## Domänregler

- Roller: `member`, `coach`, `admin`. Nya användare får status `pending` och ser inget
  innehåll förrän en admin sätter `active`. Användare registrerar sig själva via magic link.
- Medlemmar ser bara **publicerade** pass.
- Ett pass har ett datum, ett tidsslag (t.ex. "18:00") och en typtext (t.ex. "BJJ Advanced").
  Flera pass kan finnas samma dag. Varje pass har ett fritextfält för tränarens anteckningar
  samt en ordnad lista med YouTube-klipp hämtade från teknikarkivet.
- Teknikarkivet kategoriseras med dessa fasta kategorier (ingen disciplin-tagg):
  Guards, Passing, Takedowns, Upper Body Submissions, Lower Body Submissions, Sweeps.
- S&C: ett `base`-program (6–8 veckor, loopar om) visas för alla aktiva medlemmar.
  Ett `peak`-program (tävlingsförberedelse) kan hoppas på oavsett var i grundprogrammet
  man befinner sig. Peak ersätter inte base-visningen — de visas separat.
- YouTube-länkar kan dö. Visa en tydlig reservvy om en video inte går att spela.
