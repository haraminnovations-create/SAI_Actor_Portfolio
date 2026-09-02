========================================================================
  YORVIK SHARJITH SHAANK
  ACTOR · DANCER · CHOREOGRAPHER — HYDERABAD, INDIA
  Cinematic portfolio website.  HTML5 + CSS3 + JavaScript only.
========================================================================

OPEN IT
-------
Double-click index.html. No install, no build, no server, no dependencies.


FILES
-----
index.html          All content. Editable spots marked  <!-- EDIT -->
css/style.css       All styling + the A4 print stylesheet
js/script.js        All behaviour, in 12 numbered + commented blocks
images/             the photographs the page uses
video/              the clips the players open
audio/              optional room tone and intro voice (not supplied yet)
reference/          the light palette, and palette.html - open in a browser


WHAT IS ALREADY DONE
--------------------
Every piece of supplied information is in place and accurate:

  Name, profession, tagline, Hyderabad base
  Age 22 · DOB 2 Oct 2003 · 5'8" / 173 cm · 70 kg
  Brown eyes · black silky hair · olive complexion · Indian passport
  Acting training — Samhara Theatre, 6 months, Sandeep Sahoo
  Theatre — Daryaptu Adhikari, 2026, 1 performance,
            roles: Postmaster / Businessman / Waiter
  Screen — Priya Nee Premalo Part 2, Second Lead, 7 Oct 2020,
            Lakshmi Narayana & Sravani, Bhavani, Karthik,
            Geetha Savithri Devi — WATCH FILM links to the real YouTube URL
  Dance 9 years · Choreography 6 years · 5 styles
  Special skills, languages, education
  Email sharjithshank@gmail.com · Phone +91 63050 68693

Nothing was invented. There is exactly ONE screen credit and no second
film is implied anywhere. No awards, agencies, festivals, OTT credits or
international work are claimed. The Acting section is the Navarasa —
the nine rasas of the Natyashastra, four frames each. They are a range
of performance, never claimed as credits.


PHOTOGRAPHS — 21 ARE IN AND WIRED UP
------------------------------------
Your 21 photographs are placed by CONTENT, not at random. They were
copied to clean names (p01..p21); the WhatsApp originals are still in
images/ untouched, so nothing was lost.

  p01  dark moody portrait      HERO + NAVARASA 01 - Shringara (love)
  p02  smiling blazer headshot  casting headshot, audition frame
  p03  denim, bokeh lights      portrait
  p04  monochrome               NAVARASA 08 - Adbhuta (wonder)
  p05  warehouse, intense       gallery 05
  p06  net wall, brooding       NAVARASA 03 - Karuna (compassion)
  p07  black tee, net           Behind the Frame poster
  p08  blazer, arms out         SHOWREEL poster + NAVARASA 05 - Veera
  p09  scene still (landscape)  gallery 09
  p10  stage, arms crossed      Theatre portrait
  p11  postmaster seated        Theatre - Postmaster
  p12  postmaster + letter      Theatre - the letter (best acting still)
  p13  ensemble (landscape)     Theatre - Ensemble scene
  p14  maroon + white dhoti     Editorial - burgundy
  p15  ivory tee                Editorial - ivory
  p16  blue tee, tree           Editorial - green
  p17  night, railing           NAVARASA 06 - Bhayanaka (fear)
  p18  colour block             Editorial
  p19  print shirt              Editorial
  p20  coastal evening          Editorial
  p21  outdoor, cycling         Editorial + Movement


NAVARASA — THREE RASA CARDS TO A ROW, FOUR FRAMES IN EACH
---------------------------------------------------------
The Acting section is nine cards — three to a row, three rows deep. Each
card carries its own rasa name and, inside it, FOUR small sub-frames in a
two-by-two, one photograph each. Bring the mouse to any of the four and
that frame pops out of the card, large, while the other three step back
so the one you are looking at stands alone. Keyboard works the same way:
tab to a frame and it pops. On a phone there is no pointer, so the cards
simply stay cards, and they fall to two across and then one.

The frames are kept small on purpose — the whole Navarasa now runs about
a third of the length it did as nine full-width rows.

To change a picture, edit only the src in index.html — the frame, its
number and the pop-up all follow whatever picture you put there.

  01  Shringara   love          p01   p22   p34   p45
  02  Hasya       laughter      p33   p13   p42   p44
  03  Karuna      compassion    p06   p10   p31   p27
  04  Raudra      fury          p26   p07   p21   p37
  05  Veera       valour        p08   p16   p20   p41
  06  Bhayanaka   fear          p17   p30   p32   p36
  07  Bibhatsa    aversion      p24   p12   p29   p46
  08  Adbhuta     wonder        p04   p14   p19   p35
  09  Shanta      peace         p23   p03   p15   p25

The first picture in every row is the frame that rasa already had, so
nothing you approved has moved; the other three are new to that rasa and
no photograph is used twice across the thirty-six.

The nine names also run as chips above the grid, each with its meaning.

The gallery and the 3D coverflow both read from ONE list in index.html,
so the counter says 01 / 21 today and updates itself if you add more.

LIGHT / DARK THEME
------------------
There is a round button at the right of the navbar, beside the sound
button. A SUN means "switch to light"; a MOON means "switch to dark".
The site opens dark, as before. The choice is remembered in the browser,
so a visitor who picks light gets light the next time too, and it is
written onto the page before the first paint, so there is no flash of
the wrong colours.

The light colours are the palette you sent in
reference/light_color_palett.png:

  SILVER  #E5E7EB   neutral, dividers, input fields
  GOLD    #F4C542   primary accent - rules, badges, the gold button
  R.BLUE  #1E3A8A   secondary accent - headings, type, the blue button
  PURPLE  #7C3AED   tertiary accent - the blue-to-purple wash, hero plates
  ORANGE  #FF7A59   the CTA button, with RED
  WHITE   #FFFFFF   cards and surfaces
  RED     #E63946   highlight, CTA, anything wrong in the form

Two places the palette is used with a deliberate adjustment, both noted
in the stylesheet:

  - Body type is the royal blue taken down to #16224D. The blue at full
    strength is an accent; a whole paragraph set in it shouts.
  - Small gold TYPE is stepped down to #C1901C. #F4C542 on white is
    about 1.7:1 - it cannot be read at caption size. The gold itself is
    kept exactly as given for fills, rules, badges and buttons.

It all lives in ONE block at the bottom of css/style.css, section 11,
"LIGHT THEME - FILM ACTOR PROFILE PALETTE". Group 1 is the palette
itself, which is what the whole stylesheet reads; group 2 is the list of
surfaces that name a colour of their own - section grounds, header, the
extruded heading, buttons, chips, the hero plates, the contact card, the
theatre billboard, the gallery slogans, the form and the shadows. Change
a value in group 1 and it moves everywhere at once.

WHAT WAS RE-CUT FOR THE LIGHT GROUND (css/style.css, section 11b)
-----------------------------------------------------------------
The palette on its own was not enough - three things were still built for
a dark room and looked wrong on paper:

  TYPE   300 weight is elegant as white on black and goes grey and thin as
         ink on cream, so body copy is 400 in the light theme. Section
         labels take the royal blue with a gold rule beside them; gold on
         gold-tinted cream had nothing to push against. The big extruded
         heading drops from seven gold layers to three and loses its glow -
         on white, depth reads as mud long before it reads as depth.

  PHOTO  Every picture carried a filter that dimmed and desaturated it for
         a dark ground - brightness .70 to .94. That is what made them look
         muddy. They are handed back their own light, with a whisper of
         contrast instead, and the blurred surround behind a contained
         picture is now pale rather than a dark vignette.

  GROUND Five sections were five near-identical creams, so the page had no
         rhythm. They alternate white, cream and a tinted band now, which
         is what the palette sheet does with its own panels.

THE POINTER
-----------
Two different pointers, one per theme.

DARK: a gold bloom in SCREEN blending - light added to a dark room - with
a tail of seven gold beads chasing the cursor. Unchanged.

LIGHT: no bloom at all. The circle behind the cursor is gone, so nothing
sits under the pointer while it is still. What is left is the trail
alone, seven royal blue beads that appear only while the pointer is
MOVING and fade away as it comes to rest - the faster the sweep, the
brighter the trail. It is driven frame by frame in js/script.js, in
initAura, and switches over the instant you press the theme button.


The four text tiles between the frames are no longer notes about how to
use the page - they are slogans, set large in the display face on a soft
cloud of light with no border or plate around them. To change one, edit
the <aside class="gnote"> lines in index.html: the small gold word is the
<b>, the slogan is the <p>.

STILL NEEDED FROM YOU
---------------------
1. DANCE + CHOREOGRAPHY PHOTOS. None of the photographs so far show
   dancing. The five stand-in cards that used to sit under the two dance
   reels ("Outdoor", "Motion", "Colour", "Evening", "Daylight") have been
   removed at your request, so Movement is now the counters, the styles
   and the two reels. Choreography still uses ordinary portraits with
   honest captions. Nothing is mislabelled as Bollywood or Salsa - send
   real dance photographs and I will slot them in with the right
   captions.
2. FOUR CLIPS IN H.264. video/Audition.MP4, BTS.MP4, BTS2.MP4 and
   Media1.MP4 are H.265 (HEVC). Chrome and Firefox cannot decode HEVC:
   the file opens, the duration is read, and the picture comes back 0x0 -
   a black window. They must be re-exported as H.264 ("MP4 H.264" in any
   editor, or HandBrake / CloudConvert with the H.264 preset). The five
   dance and showreel clips are already H.264 and play.
   While you are at it, the sizes need to come down: Audition.MP4 is
   1.34 GB and Media1.MP4 872 MB. Nobody on a phone will wait for that -
   1080p at 4-6 Mbps puts a three-minute clip near 100 MB, and 720p about
   half of that.
3. THE VOICE RECORDING  -> audio/intro-voice.mp3   (optional)
4. THE REMAINING SOCIAL URLS -> index.html, the .socs list. Four are now
   wired and open in a new tab:

     Instagram  https://www.instagram.com/yorviksharjithshaank
     Facebook   https://www.facebook.com/share/1GoBXoXxq3/
     X/Twitter  https://x.com/Yorviksharxud2
     WhatsApp   https://wa.me/916305068693

   LinkedIn, Snapchat and Telegram still have no address, so they still
   say "LINK NOT SET" when clicked. Send a URL and each joins the others.
   The same four are also written into the saved .vcf, so anyone who taps
   SAVE CONTACT gets the profiles in their phone. They live in one place
   in js/script.js - the CONTACT.social list.


THE 3D DESIGN
-------------
Completely rebuilt. Nothing is borrowed from the earlier reference deck —
the layout, components and motion are all new. Depth is real CSS 3D
(perspective + preserve-3d + translateZ), not drop-shadow fakery.

WHAT IS ACTUALLY 3D
  Intro          a rotating six-face YS cube, 14s loop
  Hero portrait  three planes stacked at -70px / -36px / +30px in Z,
                 with the gold "01 / ACTOR" tag floating at +56px
  Headings       extruded: eight stacked gold shadow layers (.h3d)
  25 FRAMES      a true 3D coverflow - cards fan away on both sides with
                 rotateY and depth falloff; the ring wraps, so frame 01
                 still shows neighbours on its left
  Casting cards  13 flip cards, rotateY(180deg), label front / value back
  Every card     leans toward your pointer (.tilt, JS writes --rx / --ry)
  Buttons/chips  extruded tiles with a hard bottom edge that compresses
                 when pressed

CONTROLS
  .tilt          data-tilt="9" sets the maximum lean in degrees
  --persp        the global perspective distance, in :root
  Tilt, the cube and the orbs all switch OFF for touch devices and for
  prefers-reduced-motion. The print stylesheet flattens everything.

THE PALETTE IS UNCHANGED - the same six values you supplied.


THE PALETTE  (css/style.css, :root at the very top)
---------------------------------------------------
From the supplied swatch sheet. Open reference/palette.html to see it live.

  --silver  #c0c0c0    text / icons
  --gold    #d4af37    PRIMARY accent   - hairlines, micro-type, star dividers
  --green   #0b1f1a    BLACK GREEN      - the background of the whole site
  --navy    #0d1b3d    SECONDARY accent - screen, international, 2nd buttons
  --white   #ffffff    neutral / light  - body text, casting profile section
  --red     #b71c1c    HIGHLIGHT / CTA  - casting contact + enquiry submit only

  --black   #04100c    the black end of the green->black ramp
  --char    #0e2620    card / raised surface
  --surface #081814    recessed surface, form inputs

BUTTON HIERARCHY
  btn--gold   primary    Watch Showreel, Watch Film, Save Contact
  btn--navy   secondary  View Casting Profile, Showreel
  btn--red    highlight  Contact For Casting, Send Enquiry, Hire Me
  btn--ghost  quiet      Play With Sound

Red is deliberately rare - it only ever means "get in touch", so it never
competes with itself.

GRADIENTS  (all four from the sheet, all in use)
  black green -> black      long dark sections
  navy -> black green       screen credit, international
  gold -> black green       metal fill on primary buttons
  red -> black              acting and theatre

DIVIDERS
  Every section is separated by a 1px gold rule broken in the middle by a
  small gold star, drawn in CSS - no image file.

SECTION GROUNDS - where you actually SEE each colour
  Hero / Showreel / Frame   black green   #0b1f1a
  Acting / Theatre          deep red      #21090a ground, red rail
  Screen / International    navy          #101f45 ground, navy rail
  Movement / Choreography   green         #14332c ground, green rail
  Casting Profile           white         #ffffff ground, gold rail
  Every section also carries a 3px identity rail down its left edge in its
  own colour, so the palette is legible at a glance, not only in accents.

Each section uses one dominant, one supporting and one accent colour -
never all six at once.


THE YS LOGO
-----------
An original monogram: the Y's vertex becomes the spine of the S.
It lives as an inline <symbol id="ys"> at the top of index.html, so it is
resolution-free and recolours by CSS. Three treatments are built in:

  <svg class="ys ys--gold"> <use href="#ys"/></svg>    gold      #D4AF37
  <svg class="ys ys--ivory"><use href="#ys"/></svg>    white     #FFFFFF
  <svg class="ys ys--multi"><use href="#ys"/></svg>    multicolour gradient
        (gold → red → black green → navy → black; controlled, not rainbow)

To export it as a standalone file for social/watermark use, copy the
<symbol> contents into a new .svg with the same viewBox "0 0 48 48".


SOUND — how it actually works
-----------------------------
The site is SILENT until the visitor chooses sound. This respects every
browser and mobile autoplay policy; nothing is ever forced.

  Opening screen  → "PLAY WITH SOUND" enables audio AND counts as the
                    user gesture browsers require, then plays the voice.
  "ENTER PORTFOLIO" → goes straight in, silent.
  Header speaker icon → toggles sound at any time. Choice is remembered.

The short interaction signatures (0.12-0.45s) are SYNTHESISED live by the
Web Audio API — there are no click-sound files to supply. Four related
voices keep one coherent audio brand: tap, enter, move, deep.
Ambience plays at 12% volume so the voice always dominates.


THE 3D COVERFLOW
----------------
Photographs fan away through real 3D space on both sides of the front one.
It supports:

  drag · swipe · mouse wheel · <- -> arrow keys · prev/next buttons
  click a side card to bring it forward, click the front one to enlarge

The ring wraps, so frame 01 still shows neighbours on its left. It is
built automatically from the gallery, so both always show the same
photographs in the same order - there is no second list to maintain, and
the counter follows the real number.

THE CURSOR
----------
Desktop only. An exact gold dot plus a ring that trails behind it - the
gap between them is what makes it feel weighted rather than glued on.
Over anything interactive the ring blooms to 88px and shows a word:
VIEW on photographs, PLAY on video, TURN on the flip cards, CONNECT in
the contact section. Buttons are magnetic: the ring is pulled toward the
button's centre and the button itself leans toward the pointer.
Switches off entirely on touch devices and under reduced-motion.


THE A4 PDF PORTFOLIO
--------------------
Click "DOWNLOAD A4 PDF PORTFOLIO" in the Casting section (or press Ctrl+P).
In the browser dialog choose:

    Destination:  Save as PDF
    Paper size:   A4                       (210 x 297 mm)
    Margins:      Default
    Options:      TICK "Background graphics"      <-- important

The print stylesheet rebuilds the whole page for paper: dark sections turn
white, navigation and forms drop out, each section starts a new page, the
gold micro-type survives, and every external link prints its URL.

QR CODES: not included, but now possible. Generating one needs a real
destination URL; the four social addresses are in hand, so a QR to any of
them can be added on request. A QR to the showreel or the reels still
waits on those being online somewhere.


CONTACT FORM — WHERE AN ENQUIRY GOES
------------------------------------
The form now delivers. Everything a casting director types is sent to

    yorviksharjithshaank@gmail.com

Plain HTML/CSS/JS cannot put mail on the wire - that always needs a
server - so the enquiry is handed to FormSubmit (formsubmit.co), a free
relay that forwards it to that address. There is no account and no key;
the address in js/script.js IS the endpoint.

  >>> ONE-TIME STEP, AND ONLY YOU CAN DO IT <<<

  The FIRST enquiry ever sent makes FormSubmit email
  yorviksharjithshaank@gmail.com a confirmation link. Until somebody
  opens that mail and clicks the link, nothing is forwarded. So: put the
  site online, send yourself one test enquiry through the form, open the
  gmail inbox, click the link. After that every enquiry arrives as a
  tidy table - name, email, phone, enquiry type, audition date and the
  project details - with the subject "Casting enquiry - <their name>".

To change the address later, change ONE line, js/script.js:

    const ADDRESS = 'yorviksharjithshaank@gmail.com';

IF THE RELAY CANNOT BE REACHED - the visitor is offline, a firewall
blocks it, the service is down - the form does not silently fail. It
opens the visitor's own mail app with the whole enquiry already written
out and addressed, and it does NOT clear the form, so nothing anybody
typed is ever lost.

SPAM NOTE. The address sits in the page source, where scrapers can read
it. After you have activated the form, FormSubmit gives you a random
string that stands in for the address. Swap it in on that same line and
the address disappears from the source:

    const RELAY = 'https://formsubmit.co/ajax/YOUR_RANDOM_STRING';
    (keep ADDRESS as it is - the mail-app fallback still needs it)

A honeypot field is already sent with every enquiry, so the simplest
spam bots are dropped before they reach the inbox.

IF YOU WOULD RATHER NOT USE A THIRD PARTY, the alternatives are your own
small backend, Formspree or Web3Forms (both need an account), or a
WhatsApp link built from the field values - https://wa.me/91NUMBER?text=
- which is often the better route in India and needs nothing at all.

The SAVE CONTACT (.VCF) button already works with no server - it builds
a real vCard in the browser and downloads it.


ACCESSIBILITY & PERFORMANCE
---------------------------
  Full keyboard navigation, visible gold focus rings
  Esc closes the lightbox, video player and mobile menu
  ← → browse the frame and the lightbox
  Alt text on every photograph; ARIA labels on all controls
  prefers-reduced-motion fully respected — animation, grain, parallax off
  Touch targets never below 44 x 44 px
  Custom cursor disabled on touch devices
  Lazy loading on every below-fold image; hero video only loads on desktop
    and is skipped entirely when the browser reports Save-Data
  Information is never carried by colour alone


TESTED LAYOUTS
--------------
  Desktop  1440x900 (primary) · 1920x1080 · 1280x800
  Mobile   390x844 (primary) · 393x852 · 375x812 · 360x800
  No horizontal overflow at any width.


BROWSER SUPPORT
---------------
Chrome, Edge, Firefox, Safari — current and one or two versions back.
Uses CSS Grid, custom properties, aspect-ratio, IntersectionObserver and
the Web Audio API. Everything degrades gracefully.

========================================================================
