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
    pdf: '1Z5aSkvRMjSGA0jIeFHua726WbyR0oH8e',
    pdfLabel: 'Hannover Messe product signage',
    images: ['1IIj9wvWmJliE1QHh5fDCYw833K8XS2MK', '1HDHVDjGsJWhoZt_VHHssbomklXn1cp7s', '1HFIb04e02njFJjXGaN74U3694fSrhIEO', '1HXGqKa9lszg-lv9snxRE9bt03oRi4fHw',
      '1TaphvB0kALbIiTU0_FZhw8UPkN0tUJkH', '185UCdiq264fO6hqPjwQOdQqwl5O-SDlj', '1C305TmPrZMAAAK7m7a-MKKRqJ4Yp7YgV', '1YGL8D2jGySRFbb83AJ02GbVpnn84m_9E',
      '1DyctFCqkiEx4BHuJOziJxyeLByNRuJdD', '1aq2oxGtCBNQjIm36HN_aLstq5xYVYbHz', '18DpgtKuL73PQpwbRh20G9n6KYWtCgGfr', '13fHQ3Rzybj3XnZVPk7g-QY-23Mn0U2XL',
      '1U4eJvnnVfnWRVsPT93LxnVMJE0cV8kqM', '16OkYHOJQuDajMj_4_kpkTwmfOEniEaM3', '1R8ZdMVpZaeKEG0JukV80z8mmxtEcXEwZ', '1pzDxsQWRAFDnyYsYHeRZkDkDygZN7bVd']
  },
  {
    slug: 'product-brochures',
    title: 'Product Brochures',
    kicker: 'Making 5G, Wi-Fi 7 and FPGA readable for buyers',
    category: 'editorial',
    size: 'lg',
    year: '2023 – 2024',
    client: 'VVDN Technologies',
    role: 'Graphic Designer',
    tools: 'InDesign, Illustrator, Photoshop',
    stat: { value: '7+', label: 'product & service brochures' },
    cover: { bg: '#E9E3D6', ink: '#141210', accent: '#2B4BD8', motif: 'grid' },
    brief: 'Deeply technical products (5G radio units, lab kits, Wi-Fi 7, FPGA, cloud platforms) needed sales collateral that a buyer at a trade show could understand in seconds.',
    approach: [
      'Built a consistent brochure system across product lines: cover, overview, highlights, specs and contact.',
      'Turned spec sheets into diagrams and icon-led feature grids.',
      'Designed print-ready four-pagers and web versions with QR links back to product pages.'
    ],
    outcome: 'A family of brochures used across sales and 100+ exhibitions, recognisably one brand across every product line.',
    pdf: '1vGku3dgiUB81HdYh6fVMrkwVp02vPTTD',
    pdfLabel: 'Corporate brochure',
    docs: [
      { label: '5G Lab Kit', id: '1DUOtMYgWx83aEBy7ieX_0EDBdMDzjYuA' },
      { label: '5G Low Power Radio Unit', id: '1ryYAUBTUfu8MPWXAVtzNOXe68Du-2i6S' },
      { label: 'Wi-Fi 7', id: '17MMEBp7p2dwofTYo3XQELAT6WyvWOrLG' },
      { label: 'SoC / FPGA / ASIC', id: '1-PVGJaYNk88FhP4Pr0cUiMwDSSbQJ-7K' },
      { label: 'Engineering services', id: '1PJG9ZNo0mSzrW9ZbXZZM9-ZDwLq5uNVH' },
      { label: 'Ambarella platforms', id: '1cSQV844QiC6883kChcjg_4flqknECuK4' }
    ],
    images: ['1FZqmjWL5uQWqwueJyOXilMGjlruzx4ng', '1tKFL7MQ44PaGzgdkjZTQIp-hDKrqWTwN', '1QxX6bzA5svDrQZcTrx8Z_7aWgvG8EwWz', '1tW3kJrM3FTSsRv8h11oKn00Wbeosh_Mc']
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
    title: 'Ensemble · Corporate Magazine',
    kicker: 'A 50+ page company magazine, edition after edition',
    category: 'editorial',
    size: 'md',
    year: '2022 – 2024',
    client: 'VVDN Technologies',
    role: 'Editorial Designer',
    tools: 'InDesign, Photoshop, Illustrator',
    stat: { value: '3', label: 'editions · 2022 – 2024' },
    cover: { bg: '#E9E3D6', ink: '#141210', accent: '#D8432B', motif: 'masthead' },
    brief: 'Management messages, business wins, events, awards and people stories for a 10,000+ employee company, in a magazine people actually want to read.',
    approach: [
      'Set the grid, type rules and photography guidelines for the magazine.',
      'Gave each edition its own theme and cover while keeping the system consistent.',
      'Structured 20+ sections per issue with clear hierarchy, pull quotes and room to breathe.'
    ],
    outcome: 'Published and distributed across the organisation, with editions in 2022, 2023 and 2024.',
    pdf: '1jLfSpgh4IetZi35g1-GWZKgghlRFS_30',
    pdfLabel: 'Ensemble 2024',
    docs: [{ label: 'Ensemble 2023', id: '1L7EYYJpi5nPelLRSSo4-EzgSIXCHMHR4' }, { label: 'Ensemble 2022', id: '1fKnxhKQ6IK1YTiVxoVm0543KHoRHpffT' }],
    images: ['1EOpVJNgfmJa9e-fFML42YI_naqmXR45n']
  },
  {
    slug: 'sunkonnect',
    title: 'SunKonnect · Energy Storage NA',
    kicker: 'Social countdown for a US trade show',
    category: 'campaign',
    size: 'md',
    year: '2025',
    client: 'SunKonnect (freelance)',
    role: 'Designer',
    tools: 'Photoshop, Illustrator',
    stat: { value: '4', label: 'post social series' },
    cover: { bg: '#0F1A2A', ink: '#EEF2F6', accent: '#F2B233', motif: 'frame' },
    brief: 'A renewable-energy consultancy exhibiting at Energy Storage North America in San Diego needed a social series to build presence before the show.',
    approach: [
      'Designed a four-post series: arrival announcement, capabilities, services and a final countdown.',
      'Kept one visual system across the set so the posts read as a campaign, not one-offs.'
    ],
    outcome: 'Delivered a ready-to-post series ahead of the February 2025 show.',
    images: ['1TsQrdDmBuMeLCtrJvyevq6s-ODYg_BDg', '1KCLA5G_ccwA-ygWcIO1pvNa_xPxwZ26i', '1CXmWgLYijQwTxlIpF9qPM-99y9XYsMMK', '1htgIBLz4uJvfwXq8cIDIaeK4vWeQYg44']
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
    slug: 'office-branding',
    title: 'Office Branding',
    kicker: 'Wall graphics for a global innovation campus',
    category: 'spatial',
    size: 'md',
    year: '2024',
    client: 'VVDN Technologies',
    role: 'Graphic Designer, Print Production',
    tools: 'Illustrator, Photoshop',
    stat: { value: '28 ft', label: 'widest wall graphic' },
    cover: { bg: '#141210', ink: '#EDE6D6', accent: '#D8432B', motif: 'banners' },
    brief: 'Bring the company\'s story, business units, values and culture onto the walls of its headquarters.',
    approach: [
      'Designed large-format wall graphics, the widest at 336 × 75 inches, mapping business units and capabilities.',
      'Wrote a values and culture wall around the #WeMakeItHappen line.',
      'Prepared production files to exact working-area specs for the print vendor.'
    ],
    outcome: 'Installed across the campus as permanent brand walls for employees and visiting clients.',
    images: ['1Gvu_Fj6vYtQPz9FtXxchwMdchPBdlxGp', '1mWcinkWTgrq1t5DJ6CO-6ZmgD1bseSMa', '1uAe1c4V4UTppaZOhkG9J0Pw5qB01Ph2z']
  },
  {
    slug: 'stratigen',
    title: 'Stratigen',
    kicker: 'Brand identity from a blank page',
    category: 'editorial',
    size: 'md',
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
    size: 'md',
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
    size: 'md',
    year: '2023',
    client: 'Self-initiated',
    role: 'Editorial Designer',
    tools: 'InDesign, Illustrator',
    cover: { bg: '#E9E3D6', ink: '#141210', accent: '#D8432B', motif: 'frame' },
    brief: 'Present complex data and content in an accessible, premium report format.',
    approach: ['Clean page layouts with infographic placement and consistent typography.'],
    outcome: 'A reusable report template for ongoing corporate communications.',
    images: ['1U80yTOtr0jjGAHbCsRtl4V4Cgfx2tcMG']
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
