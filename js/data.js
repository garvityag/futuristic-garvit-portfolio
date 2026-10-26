/* =========================================================
   SITE DATA — single source of truth for Work + Case studies
   ---------------------------------------------------------
   To add images to any project, paste Google Drive FILE IDs
   into `images: []` (the long id from a share link
   drive.google.com/file/d/<ID>/view). First image = cover.
   Projects with no images render a typographic cover instead.
   ========================================================= */

window.CATEGORIES = [
  { id: 'all',       label: 'All' },
  { id: 'editorial', label: 'Editorial & Brand' },
  { id: 'campaign',  label: 'Campaign & Digital' },
  { id: 'spatial',   label: 'Exhibitions & Spatial' },
  { id: 'ai',        label: 'AI & Systems' }
];

window.PROJECTS = [
  {
    slug: 'it-newsletter',
    title: 'The IT Newsletter',
    kicker: 'An internal channel built from zero',
    category: 'editorial',
    size: 'xl',
    year: '2025 – 2026',
    client: 'Publicis Groupe · Internal (NDA-safe)',
    role: 'Art Director, Designer',
    tools: 'Illustrator, ExtendScript (.jsx), InDesign, AI imagery',
    stat: { value: '100,000+', label: 'employees reached' },
    cover: { bg: '#E9E3D6', ink: '#141210', accent: '#D8432B', motif: 'masthead' },
    brief: 'There was no newsletter, no template and no brief. Global IT needed one place to explain AI rollouts, new platforms and governance rules to an audience of 100,000+ people across 126 agencies.',
    approach: [
      'Pitched the format and set an editorial system: masthead, contents band, lead story, stat strips and a closing note.',
      'Locked one signature device, the headline sitting inside a colour block, so every edition is recognisable at a glance.',
      'Turned dense policy into infographics, including a capability matrix that replaced three tables and a page of copy.',
      'Built the A3 layout through scripted Illustrator builds (ExtendScript), so a new edition is a content swap, not a redesign.'
    ],
    outcome: 'The newsletter became the team\'s main communication channel. Leadership now uses it to land global announcements, and editions are hosted on the intranet with a dedicated landing page.',
    images: []
  },
  {
    slug: 'it-support-kit',
    title: 'Employee IT Support Kit',
    kicker: 'A 17-page reference people actually open',
    category: 'editorial',
    size: 'lg',
    year: '2026',
    client: 'Publicis Groupe · Internal (NDA-safe)',
    role: 'Designer',
    tools: 'PowerPoint, Illustrator, Photoshop',
    stat: { value: '~90,000', label: 'employees use it' },
    cover: { bg: '#0F0E0C', ink: '#EDE6D6', accent: '#BDAB78', motif: 'glass' },
    brief: 'A text-heavy IT reference deck covering policies, accounts, VPN, printing, collaboration and support. The rule from stakeholders: redesign everything, lose zero content.',
    approach: [
      'Set a dark, premium direction with frosted cards over soft organic shapes, a serif display face and a bottom navigation row.',
      'Rebuilt every page around one task per page, so employees find the answer before they read the paragraph.',
      'Swapped generic graphics for real app icons and product screenshots after the first feedback round.',
      'Ran five rounds with regional leads through to final sign-off.'
    ],
    outcome: 'Approved by regional leads for global circulation as the reference kit for roughly 90,000 employees across 126 agencies.',
    images: []
  },
  {
    slug: 'launch-campaigns',
    title: 'Enterprise Launch Campaigns',
    kicker: 'Banners, emailers and intranet pages for global rollouts',
    category: 'campaign',
    size: 'md',
    year: '2025 – 2026',
    client: 'Publicis Groupe · Internal (NDA-safe)',
    role: 'Art Director, Designer',
    tools: 'Figma, Photoshop, HTML email, ChatGPT / Firefly / Flow',
    stat: { value: '20', label: 'banner system · 5 sizes · 2 themes' },
    cover: { bg: '#D8432B', ink: '#FFF6EE', accent: '#141210', motif: 'banners' },
    brief: 'Every new platform launch (AI copilots, a chat-tool migration, a security rollout, new support tools) needed its own campaign, fast, for a global audience mostly on classic Outlook.',
    approach: [
      'Built a 20-banner Figma system across five sizes in dark and light themes, with fixed text zones on the left and visuals on the right.',
      'Designed Outlook-safe HTML emailers and intranet article pages so one campaign works across email and the portal.',
      'Directed AI imagery and short video loops for hero visuals and the CEO\'s anniversary and birthday emails.'
    ],
    outcome: 'Launch comms now ship in days instead of being designed from scratch each time, and every rollout looks like it came from one brand.',
    images: []
  },
  {
    slug: 'data-infographics',
    title: 'Data Stories for Leadership',
    kicker: 'Turning a platform\'s numbers into one clear story',
    category: 'editorial',
    size: 'md',
    year: '2026',
    client: 'Publicis Groupe · Internal (NDA-safe)',
    role: 'Information Designer',
    tools: 'Illustrator, ExtendScript (.jsx), PowerPoint',
    stat: { value: '4', label: 'stage story · scale → savings' },
    cover: { bg: '#141210', ink: '#EDE6D6', accent: '#3FD0C9', motif: 'funnel' },
    brief: 'An AI quality-control platform was catching costly media-campaign errors, but its impact lived in spreadsheets. Leadership needed it in one glance.',
    approach: [
      'Wrote the story arc first: scale, processing, detection, money saved.',
      'Designed the four stages as one continuous system, with the savings stage as the only saturated element on the page.',
      'Scripted the build in Illustrator so variations for decks and the newsletter take minutes.'
    ],
    outcome: 'The infographic now anchors the platform\'s leadership updates and was reused in the newsletter.',
    images: []
  },
  {
    slug: 'design-ops-automation',
    title: 'Design Ops Automation',
    kicker: 'Tools that remove the repetitive half of the job',
    category: 'ai',
    size: 'md',
    year: '2026',
    client: 'Publicis Groupe · Internal (NDA-safe)',
    role: 'Designer & Builder',
    tools: 'HTML/CSS/JS, Python, ExtendScript, Claude',
    stat: { value: '3', label: 'tools in daily use' },
    cover: { bg: '#EDE6D6', ink: '#141210', accent: '#2B4BD8', motif: 'grid' },
    brief: 'As the only designer for a global team, most hours went to the same formats again and again: maintenance notices, status emails, weekly reports.',
    approach: [
      'A request form that turns a teammate\'s inputs into a finished, Outlook-ready HTML email in real time.',
      'A weekly leadership dashboard that reads the team task tracker and generates the PowerPoint report automatically.',
      'Scripted Illustrator builds for newsletters and infographics, driven by one config file.'
    ],
    outcome: 'Teammates without design tools can now produce on-brand comms themselves, and design time goes to the work that needs a designer.',
    images: []
  },
  {
    slug: 'isc-west',
    title: 'ISC West Booth',
    kicker: 'Booth design for a major international security expo',
    category: 'spatial',
    size: 'lg',
    year: '2023',
    client: 'VVDN Technologies',
    role: 'Exhibition Designer, Art Director',
    tools: 'Blender, Photoshop, Illustrator',
    stat: { value: '7–8 ft', label: 'minimum panel height' },
    cover: { bg: '#141210', ink: '#EDE6D6', accent: '#D8432B', motif: 'frame' },
    brief: 'Design a booth for ISC West with strict vendor specs and a tight turnaround, readable from across a crowded expo floor.',
    approach: [
      'Visualised the structure in 3D before a single file went to print.',
      'Built modular graphics that adapt to vendor production specs.',
      'Prepared large-format, press-ready artwork and coordinated with the vendor.'
    ],
    outcome: 'Executed on the show floor as designed, and the modular approach was reused for later shows.',
    images: ['1H1gcScgkUEhxmqlj5bM4mKbbyqHeyHM7', '1H-pciOuqOqJ8fU7GAKP5_5i9mu5Kliue', '1Gwhua-3oWgk5lR2dkfqPz3OAguU8Zbb4']
  },
  {
    slug: 'exhibition-graphics',
    title: 'Exhibition & Event Graphics',
    kicker: 'One system across 100+ international shows',
    category: 'spatial',
    size: 'md',
    year: '2022 – 2024',
    client: 'VVDN Technologies',
    role: 'Art Director, Print Production',
    tools: 'Photoshop, Illustrator',
    stat: { value: '100+', label: 'exhibitions incl. CES & MWC' },
    cover: { bg: '#141210', ink: '#EDE6D6', accent: '#D8432B', motif: 'frame' },
    brief: 'CES, MWC, Auto Expo and more, each with different venues, specs and print vendors, sometimes in the same month.',
    approach: [
      'Built a reusable graphics system with locked brand zones and flexible content areas.',
      'Designed 13–14 large-format panels per show: backdrops, standees and booth walls.',
      'Managed press-ready files and colour across vendors in different countries.'
    ],
    outcome: 'Every new show became a configuration rather than a redesign, keeping the brand consistent across 100+ exhibitions.',
    images: ['1IIj9wvWmJliE1QHh5fDCYw833K8XS2MK', '1HDHVDjGsJWhoZt_VHHssbomklXn1cp7s', '1HFIb04e02njFJjXGaN74U3694fSrhIEO', '1HXGqKa9lszg-lv9snxRE9bt03oRi4fHw']
  },
  {
    slug: 'ai-spec-campaign',
    title: 'AI Ad Campaign · Premium Briefcase',
    kicker: 'Spec work: three Instagram ads, AI-first process',
    category: 'campaign',
    size: 'md',
    year: '2026',
    client: 'Spec project',
    role: 'Art Director',
    tools: 'Midjourney, Firefly, Photoshop',
    stat: { value: '3', label: 'ad concepts' },
    cover: { bg: '#2A2420', ink: '#F2E9DC', accent: '#C9A15A', motif: 'frame' },
    brief: 'Create a set of Instagram ads for a premium menswear briefcase, using generative AI for imagery while keeping the product accurate and the brand premium.',
    approach: [
      'Set a single campaign idea and wrote three executions around it.',
      'Generated environments and mood with AI, then composited the real product for accuracy.',
      'Documented the full prompt-to-final process alongside the creatives.'
    ],
    outcome: 'Delivered three finished ads and a process write-up showing how AI speeds up production without losing art direction.',
    images: []
  },
  {
    slug: 'corporate-magazine',
    title: 'Corporate Magazine',
    kicker: 'The company\'s first magazine, pitched and launched',
    category: 'editorial',
    size: 'md',
    year: '2023',
    client: 'VVDN Technologies',
    role: 'Editorial Designer',
    tools: 'InDesign, Photoshop, Illustrator',
    stat: { value: '01', label: 'first edition, pitched by me' },
    cover: { bg: '#E9E3D6', ink: '#141210', accent: '#D8432B', motif: 'masthead' },
    brief: 'Dense corporate content and no in-house publication. The goal was a magazine people would actually read.',
    approach: [
      'Pitched the idea and set the grid, type rules and photography guidelines.',
      'Structured each issue with clear hierarchy, pull quotes and room to breathe.'
    ],
    outcome: 'Published and distributed across the organisation as its first corporate magazine.',
    images: ['1EOpVJNgfmJa9e-fFML42YI_naqmXR45n']
  },
  {
    slug: 'luxora',
    title: 'LUXORA',
    kicker: 'Premium spatial concepts',
    category: 'spatial',
    size: 'xl',
    year: '2024 – 2025',
    client: 'Concept work',
    role: 'Spatial Designer, Art Director',
    tools: 'Blender, Photoshop, Lightroom',
    cover: { bg: '#2A2420', ink: '#F2E9DC', accent: '#C9A15A', motif: 'frame' },
    brief: 'Translate luxury brand values into spatial experiences for retail, workspace and residential settings.',
    approach: ['Mood direction, material selection, lighting atmosphere and cinematic 3D visualisation.'],
    outcome: 'A set of spatial concepts that communicate the brand before construction begins.',
    images: ['12yngtXzKvYkWvL-TODn4eNZ92YFJNLfz', '135SiSH_BnNLmAvTui1NcF503rT2eXnI5']
  },
  {
    slug: 'imc-booth',
    title: 'IMC Booth Design',
    kicker: 'Booth visualisation and branding',
    category: 'spatial',
    size: 'sm',
    year: '2023',
    client: 'VVDN Technologies',
    role: 'Exhibition Designer',
    tools: 'Blender, Photoshop, Illustrator',
    cover: { bg: '#141210', ink: '#EDE6D6', accent: '#D8432B', motif: 'frame' },
    brief: 'A booth presence that communicates technology capability at scale.',
    approach: ['Booth mockups, branding graphics, layout visualisation and production-ready assets.'],
    outcome: 'Delivered and executed at the IMC event.',
    images: ['1I45puK1bQkX8E9rVvH6tsTTOOiUnYTqa']
  },
  {
    slug: 'corporate-booth',
    title: 'Corporate Exhibition Booth',
    kicker: 'Photoreal materials and lighting for a tech showcase',
    category: 'spatial',
    size: 'sm',
    year: '2024',
    client: 'Corporate technology brand',
    role: '3D Visualiser, Spatial Designer',
    tools: 'Blender, Photoshop, Lightroom',
    cover: { bg: '#141210', ink: '#EDE6D6', accent: '#3FD0C9', motif: 'frame' },
    brief: 'Take an existing booth concept to photoreal quality before production.',
    approach: ['Refined LED surfaces, reflective materials, texturing and lighting for a futuristic showcase mood.'],
    outcome: 'Enhanced visualisation approved for production.',
    images: ['16YXaGD8yCLR843_vY8VZgvcv_8_VCarT']
  },
  {
    slug: 'nexa-spaces',
    title: 'NEXA Spaces',
    kicker: 'Immersive brand environments',
    category: 'spatial',
    size: 'sm',
    year: '2024 – 2025',
    client: 'Concept work',
    role: 'Spatial Designer',
    tools: 'Blender, Photoshop',
    cover: { bg: '#141210', ink: '#EDE6D6', accent: '#3FD0C9', motif: 'frame' },
    brief: 'Futuristic, immersive environments for entertainment, hospitality and brand activation that remain buildable.',
    approach: ['Cinematic lighting design with modular environment components that scale to different venues.'],
    outcome: 'A modular concept system adaptable to different venue sizes.',
    images: ['1svIlWdeqcMh9kQ2Owx9fnrp-dmsz96NB', '1xPVT5-YI3jop8mmr1RW_hN8tMbiwb7x5', '1FYhC1mi2zYbh2PH4i4MHBTDLYuI9mNrw', '1tnG9GzrwAUprvmdpfR6DER2Eojww5ziQ']
  },
  {
    slug: 'magazine-ads',
    title: 'Magazine Ads & Print',
    kicker: 'Trade-magazine ads that stand out',
    category: 'campaign',
    size: 'sm',
    year: '2023',
    client: 'VVDN Technologies',
    role: 'Graphic Designer',
    tools: 'Photoshop, Illustrator',
    cover: { bg: '#E9E3D6', ink: '#141210', accent: '#D8432B', motif: 'frame' },
    brief: 'Ads for crowded trade magazines that still follow corporate brand guidelines.',
    approach: ['Typography-led layouts with strong hierarchy and deliberate white space.'],
    outcome: 'Published across multiple industry magazines.',
    images: ['1GrzBSSNWTih8I4Io8Jg7SBsBb0af7GZr', '1v-vD1dR6_hPwG9ys181lAcJzKJugPO5X']
  },
  {
    slug: 'corporate-report',
    title: 'Corporate Report',
    kicker: 'Complex content, premium document',
    category: 'editorial',
    size: 'sm',
    year: '2023',
    client: 'Self-initiated',
    role: 'Editorial Designer',
    tools: 'InDesign, Illustrator',
    cover: { bg: '#E9E3D6', ink: '#141210', accent: '#D8432B', motif: 'frame' },
    brief: 'Present complex data and content in an accessible, premium report format.',
    approach: ['Clean page layouts with infographic placement and consistent typography.'],
    outcome: 'A reusable report template for ongoing corporate communications.',
    images: ['1U80yTOtr0jjGAHbCsRtl4V4Cgfx2tcMG']
  },
  {
    slug: 'stratigen',
    title: 'Stratigen',
    kicker: 'Brand identity from a blank page',
    category: 'editorial',
    size: 'sm',
    year: '2024',
    client: 'Personal project',
    role: 'Brand Identity Designer',
    tools: 'Illustrator, Photoshop',
    cover: { bg: '#2B4BD8', ink: '#F2EEE6', accent: '#F2EEE6', motif: 'mark' },
    brief: 'A full identity with zero constraints, where every decision has to justify itself.',
    approach: ['Logo, colour palette, typography rules, moodboard and application mockups as one system.'],
    outcome: 'A complete, presentation-ready brand system.',
    pdf: '1Bvm1pIP2597MyPOb_aPrkJTxI_jaoEJR',
    images: []
  }
];

window.AI_LAB = [
  {
    name: 'NEXUS AI',
    what: 'A multi-agent creative operations system. Nine AI agents handle ideas, copy, design, motion and social, with a live dashboard and a Discord layer.',
    stack: 'CrewAI · Groq · FastAPI · Vercel',
    link: 'https://agents.garvityagnik.in'
  },
  {
    name: 'Illustrator Whisperer',
    what: 'A web app that turns a plain-language design brief into a working Adobe Illustrator script.',
    stack: 'React · Claude API · ExtendScript',
    link: ''
  },
  {
    name: 'AI Design Portfolio',
    what: 'A separate archive of AI-directed campaign, character and visual work.',
    stack: 'Midjourney · Firefly · Runway · Veo',
    link: 'https://designai.garvityagnik.in'
  },
  {
    name: 'AI Video Studio',
    what: 'A short-form video pipeline that takes a concept to platform-ready cuts on a free stack.',
    stack: 'Gemini · Veo · ElevenLabs',
    link: ''
  }
];

window.driveImg = (id, w = 1600) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;
window.driveFallbacks = (id) => [
  `https://lh3.googleusercontent.com/d/${id}=w1600`,
  `https://drive.google.com/thumbnail?id=${id}&sz=w1600`
];
