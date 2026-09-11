export interface WireItem {
  id: string;
  title: string;
  blurb: string;
  date: string;
  outlet: string;
  url: string;
  beat: "release" | "ranking" | "policy" | "rumor" | "labs";
  models: string[];
}

export const WIRE: WireItem[] = [
  {
    id: "aa-devin-fusion",
    title: "AA: Devin Fusion first multi-model on Coding Agent Index",
    blurb:
      "11 September. Independent AA bench for Cognition release. Frontier lead + SWE-2 medium sidekick; Fable 5.1 (xhigh) + SWE-2 scores 62 on Coding Agent Index v1.5; Astra (xhigh) + SWE-2 scores 59, ~43% cheaper and ~31% faster.",
    date: "2026-09-11",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2098504936984293447",
    beat: "labs",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "grok-47-cook",
    title: "Musk: Grok 4.7 needs a few more days to cook",
    blurb:
      "11 September ~17:22 UTC. Reply to @farzyness. Suspected RL length penalty; early give-up on hard tasks; weak self-check. Not a ship date. Live xAI row stays 4.6.",
    date: "2026-09-11",
    outlet: "Elon Musk / X",
    url: "https://x.com/elonmusk/status/2098462085973741960",
    beat: "rumor",
    models: ["grok-4.6"],
  },
  {
    id: "ds-v41-flash-launch",
    title: "DeepSeek launches V4.1-Flash — API id deepseek-flash",
    blurb:
      "10 September. Smallest model in the new arch family; native vision; 552B MoE with 8B/16B active. V4-Flash and Vision-Exp retired into compat aliases.",
    date: "2026-09-10",
    outlet: "DeepSeek",
    url: "https://www.deepseek.com/en/news/deepseek-v4-1-flash/",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "ds-v41-flash-api-pricing",
    title: "Flash pricing live; Pro routes to Flash after 14 Sept",
    blurb:
      "Peak cache-miss $0.30 / output $1.20 per 1M; off-peak half; cache-hit $0.006/$0.003. From 04:00 UTC 14 Sept, deepseek-v4-pro → V4.1-Flash at Flash rates until V4.1-Pro.",
    date: "2026-09-10",
    outlet: "DeepSeek API Docs",
    url: "https://api-docs.deepseek.com/quick_start/pricing",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "ds-v41-flash-hf",
    title: "DeepSeek-V4.1-Flash weights on Hugging Face (MIT)",
    blurb:
      "Open-weight multimodal MoE, 1M context, Causal Encoder–Decoder + CSA2 KV compression. Lab exploring broader inference/deploy options.",
    date: "2026-09-10",
    outlet: "Hugging Face",
    url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash",
    beat: "release",
    models: ["deepseek-v4.1-flash"],
  },
  {
    id: "ds-v41-flash-partners",
    title: "WorkBuddy / CodeBuddy and OpenCode support V4.1-Flash",
    blurb:
      "Launch note names Tencent WorkBuddy (including CodeBuddy) and OpenCode as official partners with full support on day one.",
    date: "2026-09-10",
    outlet: "DeepSeek",
    url: "https://www.deepseek.com/en/news/deepseek-v4-1-flash/",
    beat: "labs",
    models: ["deepseek-v4.1-flash"],
  },
  {
    id: "ds-v41-flash-api-news",
    title: "API docs: V4.1-Flash release note and routing FAQ",
    blurb:
      "deepseek-flash is the live name. Legacy deepseek-v4-flash and deepseek-v4-flash-vision-exp temporarily served by V4.1-Flash. Same Pro→Flash cutover dated 14 Sept.",
    date: "2026-09-10",
    outlet: "DeepSeek API Docs",
    url: "https://api-docs.deepseek.com/news/news260910",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "aa-v43",
    title: "AA Index v4.3: Terminal-Bench 4.0 in, AutomationBench-AA in",
    blurb:
      "7 September. TB 2.1 → 4.0; τ³-Banking replaced by AutomationBench-AA. Live board still shows Fable 5.1 and Astra tied at 53 — same headline, harder agent suite. Private-eval weight 45%.",
    date: "2026-09-07",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra", "grok-4.6", "muse-spark-1.3", "gemini-3.8-flash"],
  },
  {
    id: "nvidia-hf",
    title: "NVIDIA agrees to buy Hugging Face for $12.93B",
    blurb:
      "Definitive agreement disclosed 2–3 September. ~$11.9B to stockholders plus up to $1B retention equity. Close targeted 1H 2027 pending HSR/EU review. Platform to stay open.",
    date: "2026-09-03",
    outlet: "NVIDIA",
    url: "https://blogs.nvidia.com/blog/nvidia-to-acquire-hugging-face/",
    beat: "labs",
    models: [],
  },
  {
    id: "jensen-agi-astra",
    title: "Jensen Huang: ‘AGI has arrived’ — congratulates OpenAI on Astra",
    blurb:
      "6 September X post. Credits Astra’s GB200 training run. Public chatter already split between the demos and quota burn.",
    date: "2026-09-06",
    outlet: "Business Insider",
    url: "https://www.businessinsider.com/nvidia-jensen-huang-agi-openai-astra-ai-2026-9",
    beat: "labs",
    models: ["gpt-6-astra"],
  },
  {
    id: "register-mythos-cwi",
    title: "Booz Allen CWI: Mythos only model to finish a full cyber kill chain",
    blurb:
      "Register on the Cyber Weapon Index. Mythos CWI 80; next cluster in the 40s. Trusted-access sibling to Fable 5.1 — not a public GA row.",
    date: "2026-09-02",
    outlet: "The Register",
    url: "https://www.theregister.com/security/2026/09/02/claude-mythos-only-model-to-complete-full-cyber-kill-chain-experts-say/5294071",
    beat: "policy",
    models: ["claude-fable-5.1"],
  },
  {
    id: "vellum-38-tb4",
    title: "Vellum: 3.8 Flash leads TB 2.1, collapses on Terminal-Bench 4.0",
    blurb:
      "89.4% on TB 2.1 vs 19.1% on TB 4.0 (Opus 5 at 51.8%). Same cliff Spark faces in expert chatter — shaped terminal work ≠ long-horizon agency.",
    date: "2026-09-02",
    outlet: "Vellum",
    url: "https://www.vellum.ai/blog/gemini-3-8-flash-benchmarks-explained",
    beat: "ranking",
    models: ["gemini-3.8-flash", "muse-spark-1.3", "claude-opus-5"],
  },
  {
    id: "aa-v42-sept8",
    title: "AA Index v4.2 refresh: Fable 5.1 and Astra both 53",
    blurb:
      "8 September scrape. Opus 51, Fable 5 50, Spark max 48. OpenLM AAII can still read ~57 — Ridge cites AA.",
    date: "2026-09-08",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/leaderboards/models",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "aa-v42-board",
    title: "AA Index v4.2: Fable 5.1 57, Astra 55, Opus 54",
    blurb:
      "Rebased 4 September. Briefcase and GDP.pdf in, GPQA Diamond out. Live table as of 7 September.",
    date: "2026-09-07",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/leaderboards/models",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "aa-v42-article",
    title: "What changed in Intelligence Index v4.2",
    blurb:
      "AA-Briefcase, GDP.pdf, more private holdout, GPQA Diamond retired. Scores are not 1:1 with the August 60s scale.",
    date: "2026-09-04",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-2",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "oai-astra",
    title: "OpenAI ships GPT-6 Astra",
    blurb:
      "3 September. $10 / $50, Plus/Pro/API rollout over days. Daybreak still gates the cyber seat.",
    date: "2026-09-03",
    outlet: "OpenAI",
    url: "https://openai.com/index/gpt-6-astra/",
    beat: "release",
    models: ["gpt-6-astra"],
  },
  {
    id: "aa-astra",
    title: "AA on Astra: behind Fable on intelligence, sharp on coding-agent cost",
    blurb:
      "Equals Fable 5 on the Coding Agent Index at less than half the cost. Intelligence still trails 5.1.",
    date: "2026-09-03",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra",
    beat: "ranking",
    models: ["gpt-6-astra", "claude-fable-5.1"],
  },
  {
    id: "aa-muse-13",
    title: "AA: Muse Spark 1.3 max is 62 in partner preview",
    blurb:
      "Fourth Spark in five months. Public xhigh is 61. Max sits behind only Fable 5.1 and Opus 5 — and is not a general API row.",
    date: "2026-09-02",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/models/muse-spark-1-3",
    beat: "release",
    models: ["muse-spark-1.3"],
  },
  {
    id: "sa-meta-caught-up",
    title: "Meta says Spark 1.3 has caught the closed frontier",
    blurb:
      "SiliconANGLE on the Superintelligence Labs cadence and the $14B Scale bet. Independent board: 61 public, 62 preview.",
    date: "2026-09-02",
    outlet: "SiliconANGLE",
    url: "https://siliconangle.com/2026/09/02/meta-says-it-has-caught-up-with-anthropic-and-openai-after-releasing-muse-spark-1-3-its-most-powerful-llm-so-far/",
    beat: "labs",
    models: ["muse-spark-1.3"],
  },
  {
    id: "aa-gemini-38",
    title: "Gemini 3.8 Flash scores 59 and hits the cost Pareto",
    blurb:
      "Fourth Flash in four months. High is 59 (+3 vs 3.7). Same $0.75 / $3.75 intro price. Cost per task still rose because it talks more.",
    date: "2026-09-02",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/gemini-3-8-flash",
    beat: "release",
    models: ["gemini-3.8-flash"],
  },
  {
    id: "vb-fable-51",
    title: "VentureBeat: Fable 5.1 ships with a 75% cache-read cut",
    blurb:
      "Public Fable, trusted-access Mythos. AA already had max at 66 — highest Index they have printed.",
    date: "2026-09-01",
    outlet: "VentureBeat",
    url: "https://venturebeat.com/technology/anthropics-claude-fable-5-1-and-mythos-5-1-arrive-with-a-75-cost-reduction-for-fable-cache-reads",
    beat: "release",
    models: ["claude-fable-5.1"],
  },
  {
    id: "anth-fable-post",
    title: "Anthropic introduces Fable 5.1 and Mythos 5.1",
    blurb:
      "Same model, two safeguard stacks. Terminal-Bench-Science 52.6% vs 24.7% on Fable 5. List price unchanged at $10 / $50.",
    date: "2026-09-01",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
    beat: "release",
    models: ["claude-fable-5.1"],
  },
  {
    id: "rd-science-double",
    title: "Fable 5.1 doubles a science bench — and spends more tokens",
    blurb:
      "R&D World on Terminal-Bench-Science and AA’s note that max-effort 5.1 costs ~20% more per task than Fable 5.",
    date: "2026-09-01",
    outlet: "R&D World",
    url: "https://www.rdworldonline.com/anthropic-doubles-a-science-benchmark-score-with-fable-5-1-while-openai-says-its-astra-models-crosses-critical-cyber-threshold/",
    beat: "ranking",
    models: ["claude-fable-5.1"],
  },
  {
    id: "aa-fable-x",
    title: "AA pre-release: Fable 5.1 max is 66 with Opus fallback",
    blurb:
      "Fallback served ~4% of output tokens. Cite that if you cite the 66. Next is Opus 5 at 63.",
    date: "2026-09-01",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2094881171066978525",
    beat: "ranking",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "yotta-astra",
    title: "GPT-6 has not been announced. Astra is the named next model.",
    blurb:
      "Yotta Labs recap: GPT-5.6 family is what you can call. Astra is confirmed as upcoming; the GPT-6 label is still rumor.",
    date: "2026-09-03",
    outlet: "Yotta Labs",
    url: "https://www.yottalabs.ai/post/gpt-6-release-date-rumors-what-is-known-2026",
    beat: "rumor",
    models: ["gpt-5.6-sol"],
  },
  {
    id: "oai-cyber",
    title: "OpenAI cannot rule out critical cyber capability on Astra",
    blurb:
      "7 August preparedness note. Training and tool-using inference on Astra were tightened. No ship date attached.",
    date: "2026-08-07",
    outlet: "OpenAI",
    url: "https://openai.com/index/responding-next-frontier-critical-cyber-capabilities/",
    beat: "policy",
    models: ["gpt-5.6-sol"],
  },
  {
    id: "yahoo-polymarket",
    title: "Prediction markets still lean September for Astra",
    blurb:
      "Yahoo on Polymarket: about 59% by 15 September, higher by month-end. Resolves on OpenAI’s own announcement.",
    date: "2026-08-18",
    outlet: "Yahoo Finance",
    url: "https://finance.yahoo.com/technology/ai/articles/markets-confident-openai-releases-next-191526916.html",
    beat: "rumor",
    models: ["gpt-5.6-sol"],
  },
  {
    id: "forbes-35",
    title: "Gemini 3.5 Pro delay continues — then 3.8 Flash ships instead",
    blurb:
      "I/O ‘next month’ and a leaked July window both passed. 2 September brought another Flash, not Pro.",
    date: "2026-08-13",
    outlet: "Forbes",
    url: "https://www.forbes.com/sites/johnwerner/2026/08/13/gemini-35-pro-delay-continues/",
    beat: "rumor",
    models: ["gemini-3.8-flash", "gemini-3.1-pro"],
  },
  {
    id: "rohit-aug14",
    title: "August 14 field guide: Sol, Fable 5, Grok 4.6, 3.7 Flash, V4 Pro",
    blurb:
      "What a normal customer could actually call mid-August — before 5.1, 3.8, and Spark 1.3 landed.",
    date: "2026-08-14",
    outlet: "Rohit AI",
    url: "https://rohitai.com/blog/best-ai-models-2026-openai-anthropic-google-xai-deepseek",
    beat: "ranking",
    models: ["gpt-5.6-sol", "claude-fable-5", "grok-4.6"],
  },
];
