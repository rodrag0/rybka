# Matrix Rybka Reveal — Working Plan

## Goal

Turn the original LoveProject concept into a short, funny, affectionate website for Lisa.

The joke is simple:

**I miss you.  
Yes, I know you're literally in the building next to me.  
I still miss you.**

The presentation should be unnecessarily dramatic and technical compared with how stupidly small the actual problem is.

The emotional tone should match our texts:

- affectionate;
- slightly stupid;
- teasing;
- not polished or poetic;
- “baby / amor / rybka” energy;
- sudden sincere “I love you” between jokes;
- something that feels like I made it while sitting one building away instead of just walking over.

The binary portrait remains the main visual moment.

---

# Experience

## Scene 1 — Boot / extremely serious investigation

Start on a completely dark screen.

A terminal cursor appears.

Instead of a generic “loading memories” message, the website begins investigating the extremely important problem.

Example sequence:

```text
> locating rybka...
> found.
> calculating distance...
> ...
> one building away.
```

Pause.

Then:

```text
> acceptable distance?
> no.
```

Then:

```text
> problem detected.
> i miss you.
```

Keep the typography lowercase and informal rather than making it look like a real hacker interface.

The humor comes from treating “Lisa is in the next building” like a catastrophic system error.

---

# Scene 2 — Binary starts rising

After:

```text
> i miss you.
```

the first `0` and `1` particles begin rising from the bottom.

At first there should only be a few.

Then more streams appear and the movement becomes more coordinated.

The effect should feel like the computer is trying to reconstruct something rather than generic Matrix rain.

Possible tiny terminal line while this happens:

```text
> attempting fix...
```

Then:

```text
> retrieving lisa...
```

or:

```text
> loading rybka...
```

Prefer **“loading rybka...”** because it sounds more like something I would actually make as a stupid joke for her.

---

# Scene 3 — Binary portrait resolves

The upward wave begins revealing the supplied binary portrait from bottom to top.

The moving canvas digits and the static portrait should visually merge so that it looks like the random binary streams are slowly assembling into her.

Use the supplied colored binary portrait exactly as the final visual.

Do not animate thousands of individual `<b>` elements.

Instead:

1. keep the entire portrait static;
2. reveal it with a bottom-to-top mask;
3. synchronize the mask with the moving binary wave;
4. add a subtle glow/shimmer at the reveal boundary.

Once the face becomes recognizable, gradually reduce the random surrounding code.

The portrait should become the clear focus.

---

# Scene 4 — The actual reason this ridiculous website exists

Once the portrait has fully resolved, wait approximately 500–800 ms.

Then show:

```text
baby
```

Small pause.

```text
I miss you
```

Then:

```text
yes I know you're literally
in the building next to me
```

Pause.

Then:

```text
shut up
```

And finally:

```text
I still miss you 😭
```

This should feel like individual WhatsApp messages appearing rather than one professionally written paragraph.

Do not capitalize everything perfectly.

Do not make the text sound like a Valentine's card.

---

# Scene 5 — Explanation

After another short pause:

```text
like actually what did you do to me hahaha
```

Then:

```text
I see you all the fucking time
and somehow I'm here missing you again
```

Then:

```text
so yeah
```

Pause.

```text
I made you a whole fucking website
instead of walking to the next building
```

Then perhaps:

```text
very normal 👍🏽
```

That should be the main punchline of the page.

---

# Scene 6 — Choice

Two buttons appear underneath.

```text
I miss you too
```

and

```text
sounds like a you problem
```

### If she clicks “I miss you too”

Change the message to:

```text
hehe
```

Then:

```text
knew it
```

Then:

```text
come say hi then 😌
```

Optional tiny line:

```text
distance: still unacceptable
```

---

### If she tries “sounds like a you problem”

The button should escape.

Do not immediately explain anything.

First hover:

- button moves somewhere nearby.

Second attempt:

- moves again.

Third attempt:

change its text to:

```text
bitch 😒
```

Then if she somehow manages to click it:

```text
wow
```

Pause.

```text
fuck you too then
```

Pause.

```text
I still love you tho
```

Then replace both buttons with:

```text
try again
```

which returns to the original choice.

This fits our actual way of talking much better than fake romantic rejection buttons.

---

# Scene 7 — Small sincere ending

After she chooses **“I miss you too”**, let the joke calm down.

The portrait stays visible.

Ambient digits continue moving very subtly.

Then show:

```text
also
```

Pause.

```text
I love you
```

Then:

```text
a lot
```

And finally:

```text
come here 🫶🏽
```

Keep this part simple.

The sincere ending works better because the rest of the page was stupid.

---

# Optional final easter egg

After a few seconds, add a tiny secondary button:

```text
important
```

Clicking it reveals:

```text
send selfie please?
```

then:

```text
I miss you thanks
```

This directly references the way I actually texted her and makes the page feel much more specifically ours.

---

# Overall copy hierarchy

The main sequence should effectively be:

```text
> locating rybka...
> found.

> calculating distance...
> one building away.

> acceptable?
> no.

> problem detected.
> i miss you.

[portrait begins forming]

baby

I miss you

yes I know you're literally
in the building next to me

shut up

I still miss you 😭

like actually what did you do to me hahaha

I see you all the fucking time
and somehow I'm here missing you again

so yeah

I made you a whole fucking website
instead of walking to the next building

very normal 👍🏽

[I miss you too]
[sounds like a you problem]
```

Successful ending:

```text
hehe

knew it

come say hi then 😌

also

I love you

a lot

come here 🫶🏽
```

---

# Visual direction

## Palette

Keep the environment almost completely black.

The binary portrait should preserve its original colors.

Ambient Matrix code can primarily use muted green/white so it doesn't fight with the portrait.

Do not turn the whole website neon-green.

The portrait should be the colorful element.

---

# Typography

Use a monospace font for:

- terminal messages;
- Matrix code;
- technical UI.

For the actual personal messages, either:

1. keep monospace for consistency; or
2. switch subtly to a clean sans-serif once the portrait resolves.

I prefer option 1.

The contrast between an extremely computer-looking interface and:

```text
shut up
I still miss you 😭
```

is part of the joke.

---

# Motion

## Intro

Slow and deliberate.

The computer should appear to be doing something ridiculously important.

## Portrait reveal

Approximately 3–4 seconds.

This is the visual centerpiece.

## Personal messages

Much faster.

Approximately 300–700 ms between short lines so it resembles me sending multiple WhatsApp messages instead of writing an essay.

For example:

```text
baby
```

300 ms

```text
I miss you
```

600 ms

```text
yes I know you're literally in the building next to me
```

700 ms

```text
shut up
```

300 ms

```text
I still miss you 😭
```

---

# Technical structure

Use two main layers.

### Portrait layer

Static supplied `<pre>` containing the colored `0` and `1` portrait.

Reveal the entire element with:

- `clip-path`;
- CSS mask;
- or an overflow-hidden wrapper.

Do not individually animate the thousands of `<b>` elements.

### Effects canvas

A `<canvas>` above or behind the portrait responsible for:

- upward-moving binary streams;
- glow around the reveal line;
- ambient binary after completion;
- optional small particle bursts when buttons are clicked.

Use `requestAnimationFrame`.

---

# Proposed structure

```text
index.html

css/
  default.css

js/
  matrix-reveal.js
  interactions.js

assets/
  binary-portrait.html
```

Remove the legacy dependencies from the original project:

- flower renderer;
- heart path;
- timer;
- anniversary copy;
- old names;
- original image link;
- jQuery if it is no longer necessary.

---

# Responsive layout

The portrait remains the center of the composition.

Desktop:

```text
        terminal/message
              ↓

       [binary portrait]

          interaction
```

Do not recreate the original left-text/right-heart layout.

Mobile should simply stack everything vertically.

Scale the binary portrait uniformly and never allow its character grid to wrap.

Test at:

- 360 px;
- 768 px;
- 1440 px;
- short landscape screens.

---

# Replay

After completing the interaction, a tiny unobtrusive control can appear:

```text
again?
```

Clicking it reruns:

```text
> locating rybka...
```

Do not automatically loop the entire sequence.

The first reveal should happen only once unless she deliberately replays it.

---

# Reduced motion

Under:

```css
prefers-reduced-motion: reduce
```

skip the streaming sequence.

Instead:

1. fade in the portrait;
2. immediately show the first message;
3. retain the button interaction without moving buttons rapidly around the screen.

---

# First prototype acceptance criteria

- The old flower-heart animation is completely gone.
- The binary portrait resolves from bottom to top.
- Random rising binary appears to assemble into the portrait.
- The opening joke establishes that Lisa is literally one building away.
- The writing sounds like my texts rather than romantic website copy.
- “I miss you” is the main idea.
- “I love you” appears only toward the end and lands sincerely.
- The wrong button behaves annoyingly.
- The page is funny before it is sentimental.
- The portrait is the visual centerpiece.
- The experience works on desktop and mobile.
- It remains a static site suitable for GitHub Pages.

---

# Core rule for the whole project

Do **not** make this:

> “Here is my grand declaration of love to you.”

Make it:

> “Baby I miss you so much that instead of walking 30 seconds to your building I apparently made software about it.”

That is the website.