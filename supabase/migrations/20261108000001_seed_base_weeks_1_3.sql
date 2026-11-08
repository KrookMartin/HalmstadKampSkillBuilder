-- Migration: seed_base_weeks_1_3
-- Weeks 1–3 of the base program (Grundprogram), in the line format parsed by
-- src/features/strength/parseWeek.ts. Coaches can edit them in /traning/styrka
-- afterwards; `on conflict do nothing` means re-running this never overwrites
-- those edits.

insert into strength_weeks (program_id, week_number, title, content)
select p.id, w.week_number, w.title, trim(both E'\n' from w.content)
from strength_programs p
cross join (values
  (1, 'Vecka 1', $w$
## Dag 1 – Ben
A. Barbell box squat | 6-8 x 3-4 set | https://youtu.be/7iw2gLZKZ0w
B1. RNT reverse lunge | 6-8/ben x 3-4 set | https://youtu.be/wDoNvVG7PjU
B2. DB lateral raise | 8-12 x 3-4 set | https://youtu.be/XPPfnSEATJA
C1. Barbell hip thrust | 8-10 x 3-4 set | https://youtu.be/5S8SApGU_Lk
C2. DB reverse fly | 8-12 x 3-4 set | https://youtu.be/d_feFQGGVh4

## Dag 2 – Push / Pull / Biceps
A1. Incline DB bench press | 8-10 x 3-4 set | https://youtu.be/jMQA3XtJSgo
A2. Pull up | 6-10 x 3-4 set | https://youtu.be/jgFel4wZl3I
B1. Barbell bench press | 8-10 x 3-4 set | https://youtu.be/ejI1Nlsul9k
B2. DB hammer curl | 8-10 x 3-4 set | https://youtu.be/RIEMoYL_h1Y
C1. DB fly | 8-10 x 3-4 set | https://youtu.be/AVIBmE5iQrQ
C2. Barbell drag curl | 8-10 x 3-4 set | https://youtu.be/ZHa0OAcn7Bc

## Dag 3 – Hinge / Ben / Triceps
A. RDL | 6-8 x 3-4 set | https://youtu.be/bT5OOBgY4bc
B1. Zercher landmine split squat | 6-8/ben x 3-4 set | https://youtu.be/eQCm5rnMZ_g
B2. Strict dips | 8-10 x 3-4 set | https://youtu.be/_YAwqEDgURk
C1. Single leg hip thrust | 6-8/ben x 3-4 set | https://youtu.be/fMgiSC0eHzc
C2. Triceps pushdown | 8-10 x 3-4 set | https://youtu.be/_TJEo13dNi8
D. Toes to bar | 6-10 x 3-4 set | https://youtu.be/UdJYY1Ilk_o

## Dag 4 – Löpning
4-6 km flow tempo
$w$),
  (2, 'Vecka 2', $w$
## Dag 1 – Ben
A. Barbell box squat | 6-8 x 4-5 set | https://youtu.be/7iw2gLZKZ0w
B1. RNT reverse lunge | 6-8/ben x 4-5 set | https://youtu.be/wDoNvVG7PjU
B2. DB lateral raise | 8-12 x 4-5 set | https://youtu.be/XPPfnSEATJA
C1. Barbell hip thrust | 8-10 x 4-5 set | https://youtu.be/5S8SApGU_Lk
C2. DB reverse fly | 8-12 x 4-5 set | https://youtu.be/d_feFQGGVh4

## Dag 2 – Push / Pull / Biceps
A1. Incline DB bench press | 8-10 x 4-5 set | https://youtu.be/jMQA3XtJSgo
A2. Pull up | 6-10 x 4-5 set | https://youtu.be/jgFel4wZl3I
B1. Barbell bench press | 8-10 x 4-5 set | https://youtu.be/ejI1Nlsul9k
B2. DB hammer curl | 8-10 x 4-5 set | https://youtu.be/RIEMoYL_h1Y
C1. DB fly | 8-10 x 4-5 set | https://youtu.be/AVIBmE5iQrQ
C2. Barbell drag curl | 8-10 x 4-5 set | https://youtu.be/ZHa0OAcn7Bc

## Dag 3 – Hinge / Ben / Triceps
A. RDL | 6-8 x 4-5 set | https://youtu.be/bT5OOBgY4bc
B1. Zercher landmine split squat | 6-8/ben x 4-5 set | https://youtu.be/eQCm5rnMZ_g
B2. Strict dips | 8-10 x 4-5 set | https://youtu.be/_YAwqEDgURk
C1. Single leg hip thrust | 6-8/ben x 4-5 set | https://youtu.be/fMgiSC0eHzc
C2. Triceps pushdown | 8-10 x 4-5 set | https://youtu.be/_TJEo13dNi8
D. Toes to bar | 6-10 x 4-5 set | https://youtu.be/UdJYY1Ilk_o

## Dag 4 – Löpning
4-6 km flow tempo
$w$),
  (3, 'Vecka 3', $w$
## Dag 1 – Ben
A. Barbell box squat | 4-6 x 4-5 set | https://youtu.be/7iw2gLZKZ0w
B1. RNT reverse lunge | 4-6/ben x 4-5 set | https://youtu.be/wDoNvVG7PjU
B2. DB lateral raise | 8-10 x 4-5 set | https://youtu.be/XPPfnSEATJA
C1. Barbell hip thrust | 8-10 x 4-5 set | https://youtu.be/5S8SApGU_Lk
C2. DB reverse fly | 8-12 x 4-5 set | https://youtu.be/d_feFQGGVh4

## Dag 2 – Push / Pull / Biceps
A1. Incline DB bench press | 6-8 x 4-5 set | https://youtu.be/jMQA3XtJSgo
A2. Pull up | 6-10 x 4-5 set | https://youtu.be/jgFel4wZl3I
B1. Barbell bench press | 6-8 x 4-5 set | https://youtu.be/ejI1Nlsul9k
B2. DB hammer curl | 8-10 x 4-5 set | https://youtu.be/RIEMoYL_h1Y
C1. DB fly | 6-8 x 4-5 set | https://youtu.be/AVIBmE5iQrQ
C2. Barbell drag curl | 8-10 x 4-5 set | https://youtu.be/ZHa0OAcn7Bc

## Dag 3 – Hinge / Ben / Triceps
A. RDL | 4-6 x 4-5 set | https://youtu.be/bT5OOBgY4bc
B1. Zercher landmine split squat | 6-8/ben x 4-5 set | https://youtu.be/eQCm5rnMZ_g
B2. Strict dips | 8-10 x 4-5 set | https://youtu.be/_YAwqEDgURk
C1. Single leg hip thrust | 6-8/ben x 4-5 set | https://youtu.be/fMgiSC0eHzc
C2. Triceps pushdown | 8-10 x 4-5 set | https://youtu.be/_TJEo13dNi8
D. Toes to bar | 6-10 x 4-5 set | https://youtu.be/UdJYY1Ilk_o

## Dag 4 – Löpning
4-6 km flow tempo
$w$)
) as w (week_number, title, content)
where p.type = 'base'
on conflict (program_id, week_number) do nothing;
