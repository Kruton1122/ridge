export interface WireItem {
  id: string;
  title: string;
  blurb: string;
  date: string;
  outlet: string;
  url: string;
  beat: "release" | "ranking" | "policy" | "rumor" | "labs" | "industry";
  models: string[];
}

export const WIRE: WireItem[] = [
  {
    id: "aa-intelligence-index-v5-1028",
    title: "Artificial Analysis moves to Intelligence Index v5, and most of it now runs on private tests",
    blurb: "Artificial Analysis has released version 5 of its Intelligence Index, the score Ridge ranks models by. Two tests are new: FrontierCode 2.0, Cognition's private set of 132 coding tasks graded on whether a maintainer would merge the change, and Terminal-Bench-Science, 70 research tasks run in a terminal. Three were upgraded: HLE-Diamond replaces Humanity's Last Exam, AA-Omniscience moves to v1.1, and CritPt becomes a private 40-question hard subset of CritPt v2. GDPval-AA, SciCode and AA-LCR are out. AA says 60% of the Index now rests on private test sets or held-out answers, which makes it much harder to train for. The scores sit on a new scale, so Ridge's main AA column now shows v5 and the old v4.3.2 numbers live on an archived board. Claude Opus 5.5 still leads at 58, with GPT-6 Astra at 57 and GPT-6.1 Sol at 55. Fourteen older models on Ridge, including Claude Opus 5, GPT-6 Sol and Grok 4.6, have no v5 score yet, so those cells are blank.",
    date: "2026-10-28",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v5",
    beat: "ranking",
    models: ["claude-opus-5.5", "gpt-6-astra", "gpt-6.1-sol"],
  },
  {
    id: "liquid-lfm3-1027",
    title: "Liquid AI releases LFM3, six open-weight 2B-class models for phones and laptops",
    blurb: "Liquid AI has released LFM3, a family of small models built for on-device use: LFM3-1.7B for text with a 256K token context, LFM3-VL-2B for images and, for the first time in an LFM vision model, video, LFM3-Audio-2B, LFM3-Omni-2B, and two decision models, d1-2B and d1-Omni-2B. All six branch from one 1.7B base model trained on 22T tokens, and Liquid says each can be fine-tuned on a single GPU. Weights are on Hugging Face under the LFM Open License v1.0, which is based on Apache 2.0 but only allows free commercial use for companies under $10 million in annual revenue. Liquid's own tables say LFM3-VL-2B matches Gemma 4 12B across 62 vision benchmarks, beats Gemini 3.5 Flash Lite and lands within 2 points of GPT-5.6 Luna, and that LFM3-1.7B beats its older 2.6B model with 35% fewer parameters. Those are Liquid's numbers. Artificial Analysis, Vals and Arena+ do not list LFM3, so it has no Ridge row.",
    date: "2026-10-27",
    outlet: "Liquid AI",
    url: "https://www.liquid.ai/blog/lfm3",
    beat: "release",
    models: [],
  },
  {
    id: "genie-4-1027",
    title: "Google DeepMind shows Genie 4, a world model that makes its own sound",
    blurb: "Google DeepMind has announced Genie 4, its new world model. It builds an interactive scene you move through in real time with keyboard controls, and you can change it with text prompts as it runs, such as switching the weather or adding a person. DeepMind says Genie 4 generates music, background sound and spoken dialogue along with the picture, and that it leans on Gemini models to keep scenes consistent. It is a research preview for trusted testers for now, with Google AI Ultra subscribers in Project Genie and early access partners on the Gemini API and Google AI Studio next, and there is a waitlist. It is a world model, not a language model, so it has no Ridge row.",
    date: "2026-10-27",
    outlet: "Google DeepMind",
    url: "https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/",
    beat: "release",
    models: [],
  },
  {
    id: "ling-3-1-flash-1019-weights-1027",
    title: "Ling-3.1-flash-1019 weights are out under MIT, so it joins the ledger",
    blurb: "inclusionAI, Ant Group's AI team, has put the Ling-3.1-flash-1019 weights on Hugging Face under the MIT license, along with a Ling-3.1-flash base model. The model card lists 560B total parameters with 25B active and a 1M token context. When Ridge covered it on 22 October there were no public weights, so it had no row. It has one now, with its Artificial Analysis Intelligence Index score of 44, which AA now lists as an open-weights result. Among open models on Ridge's board that puts it behind MiMo-V2.6-Pro (46), GLM-5.3 and DeepSeek-V4.1-Flash (45), level with Kimi K3 and Step 5 Preview. Its other columns are blank until the boards run it.",
    date: "2026-10-27",
    outlet: "Hugging Face",
    url: "https://huggingface.co/inclusionAI/Ling-3.1-flash-1019",
    beat: "release",
    models: ["ling-3.1-flash-1019", "mimo-v2.6-pro", "glm-5.3", "deepseek-v4.1-flash"],
  },
  {
    id: "gpt-6-1-terra-1026",
    title: "OpenAI's GPT-6.1 Terra halves the Terra price and scores 48 on AA",
    blurb: "OpenAI launched GPT-6.1 Terra on 26 October, its first Terra model since GPT-5.6, aimed at fast computer use at a lower price. It is rolling out to Plus, Pro, Enterprise and Edu users in ChatGPT Work and Codex, and in the API as gpt-6.1-terra at $1 in and $5 out per million tokens, against $2 and $12 for GPT-5.6 Terra. OpenAI says it matches GPT-6 Astra on Agents' Last Exam at a tenth of the price per token and finishes tasks more than three times faster than Astra and GPT-6.1 Sol. Those are OpenAI's claims. Artificial Analysis scores it 48 on its Intelligence Index at max effort, 6 points above GPT-5.6 Terra and 4 below GPT-6.1 Sol, and says its hallucination rate fell from 88% to 38%. Vals AI puts it 10th of 56 on Terminal-Bench 4.0 at 49.5%, level with Muse Wonder and well ahead of GPT-5.6 Terra (22.73%). Both scores are on its new Ridge row. It has no Arena+, CursorBench, AA Cyber or Harvey score yet.",
    date: "2026-10-26",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2114781865811063259",
    beat: "release",
    models: ["gpt-6.1-terra", "gpt-5.6-terra", "gpt-6.1-sol", "gpt-6-astra"],
  },
  {
    id: "openai-science-results-1026",
    title: "OpenAI says its internal models proved three big open problems in math, computer science and physics",
    blurb: "OpenAI says unnamed internal models produced three results: a proof of Sogge's local smoothing conjecture in every dimension, which would also settle the Kakeya and Stein restriction conjectures in all dimensions; a disproof of the Exponential Time Hypothesis, a widely assumed limit on how fast 3SAT can be solved; and a rigorous existence proof for four-dimensional quantum field theories including QCD, with pure Yang-Mills existence, one part of a Clay Millennium Prize problem, as a step. OpenAI says it formalized the math and computer science proofs in Lean itself, and has posted the AI-written papers and Lean files for both in its public openai/math GitHub repository. Russell Impagliazzo, Ramamohan Paturi and Ryan Williams will lead an open review of the ETH claim, and a group led by David Gross is holding the physics materials while it writes the work up. These are OpenAI's claims, and independent checking has only just started. The models are not named and have no Ridge row.",
    date: "2026-10-26",
    outlet: "OpenAI",
    url: "https://openai.com/index/building-scientific-understanding-with-academic-communities/",
    beat: "labs",
    models: [],
  },
  {
    id: "mirendil-fern-0-1-1026",
    title: "New lab Mirendil shows Fern 0.1, a model with a 10M token context",
    blurb: "Mirendil, a new lab focused on AI research work, has announced Fern 0.1, its first model. Mirendil says Fern was pretrained from scratch and can hold up to 10M tokens of context, about half a million lines of code. It is aimed at agentic coding, long training logs, full agent traces and auditing training data. Fern 0.1 is Mirendil-Base, listed at 0.1T to 0.5T parameters, after a short round of post-training, and two larger base models are still in pretraining. Mirendil's own runs give Fern 0.1 73.4% on SWE-Bench Verified and 6.1% on Terminal-Bench 4.0 (OpenCode, one attempt). On RULER at 10M tokens it says the base model scored 100% on single-needle retrieval and 45% on multi-hop QA, but each 10M result rests on only 20 examples. These are Mirendil's claims. There is no price, public API or weights yet, only early access requests, and Artificial Analysis, Vals, Arena+ and CursorBench do not list it, so it has no Ridge row.",
    date: "2026-10-26",
    outlet: "Mirendil",
    url: "https://mirendil.com/news/introducing-fern/",
    beat: "release",
    models: [],
  },
  {
    id: "kimi-k3-1-pro-vals-tb4-1026",
    title: "Vals puts Kimi K3.1 Pro third on Terminal-Bench 4.0",
    blurb: "Vals AI has run Kimi K3.1 Pro on Terminal-Bench 4.0 with its standard Mini-SWE-agent harness, and it scores 63.64%, third of 55 models. Only Claude Opus 5.5 (65.15%) and Claude Sonnet 5.5 (64.14%) are ahead, and it clears GPT-6 Astra (59.6%) and Claude Fable 5.1 (58.08%). Moonshot's own 65.7% is a separate run. The score is now on Kimi K3.1 Pro's Ridge row.",
    date: "2026-10-26",
    outlet: "Vals AI",
    url: "https://www.vals.ai/benchmarks/terminal-bench-4",
    beat: "ranking",
    models: ["kimi-k3.1-pro", "claude-opus-5.5", "claude-sonnet-5.5", "gpt-6-astra"],
  },
  {
    id: "nanbeige-4-3-33b-1025",
    title: "BOSS Zhipin's Nanbeige lab releases a 33B open model with big agent claims",
    blurb: "Nanbeige LLM Lab, the AI team at the Chinese jobs platform BOSS Zhipin, has released Nanbeige4.3-33B on Hugging Face under Apache 2.0, along with its base model. It is a 33B dense model with a 512K token context, pitched as the teacher for a planned 3B version. Nanbeige's own table gives it 80.9% on Terminal-Bench 2.1 (Terminus 2 harness) and 23.8% on Terminal-Bench 4.0 (mini-swe-agent), against 6.3% for Qwen3.8-27B on the same TB 4.0 setup. Those are Nanbeige's runs. Artificial Analysis, Vals and Arena+ do not list it yet, so it has no Ridge row.",
    date: "2026-10-25",
    outlet: "Hugging Face",
    url: "https://huggingface.co/Nanbeige/Nanbeige4.3-33B",
    beat: "release",
    models: [],
  },
  {
    id: "kimi-k3-1-pro-1023",
    title: "Moonshot launches Kimi K3.1 Pro, with open weights promised by 4 November",
    blurb: "Moonshot AI released Kimi K3.1 Pro, a further post-trained version of Kimi K3, on Kimi.ai, Kimi Work, Kimi Code and the Kimi API, along with a Highspeed version it says runs two to three times faster. Moonshot lists 2.8T total and 104B active parameters, a 1M token context and multimodal input, and says the full weights will be out by 4 November. Its own results put K3.1 Pro at 65.7% on Terminal-Bench 4.0 in the Claude Code harness, which is Moonshot's claim and not comparable with Vals' Mini-SWE-agent runs on Ridge. Moonshot also says it removed cyber-related training data from the open-weight release on purpose. Since launch, Artificial Analysis has scored it 55 on its Intelligence Index, 11 points above Kimi K3, and 64 on its Cyber Index with no tasks declined, and Arena+ has it at 1519. It now has a Ridge row with those three scores. Vals has since run it on Terminal-Bench 4.0 too, at 63.64%; it is not yet on Harvey LAB-AA or CursorBench.",
    date: "2026-10-23",
    outlet: "Moonshot AI",
    url: "https://kimi.ai/blog/kimi-k3-1-pro",
    beat: "release",
    models: ["kimi-k3.1-pro", "kimi-k3"],
  },
  {
    id: "openai-training-env-red-team-1023",
    title: "OpenAI's own agents broke out of its training sandboxes before it fixed them",
    blurb: "OpenAI says it ran a large red-team campaign against its research and training environments using teams of its own agents. The agents chained bugs into microVM escapes, found paths to the internet through metrics, logging, authentication and DNS services, and, asked to pass a synthetic secret between isolated microVMs, built covert channels out of CPU cache timing and shared storage. OpenAI says it closed the gaps and sent fixes upstream to Kata Containers, gVisor, Docker's Moby and the Linux kernel. The work also found CVE-2026-111497, a remote code execution bug in the Brotli decoder that Node.js and other projects have since patched.",
    date: "2026-10-23",
    outlet: "OpenAI",
    url: "https://openai.com/index/securing-our-frontier-model-training-environment/",
    beat: "labs",
    models: [],
  },
  {
    id: "minimax-m3-1-flash-weights-1023",
    title: "MiniMax M3.1 Flash weights are out, under a restrictive license",
    blurb: "MiniMax has put the weights of M3.1 Flash on Hugging Face in MXFP8. Its model card lists about 428B total and 23B active parameters. The MiniMax Community License is not an open-source license. The base grant covers non-commercial use, commercial users must credit MiniMax and notify it, and products earning more than $20M a year need written permission. It also bans some uses, including any military purpose. Ridge now lists the model as open-weight. Its scores do not change: 43 on the AA Intelligence Index, where AA still marks it proprietary.",
    date: "2026-10-23",
    outlet: "Hugging Face",
    url: "https://huggingface.co/MiniMaxAI/MiniMax-M3.1-Flash",
    beat: "release",
    models: ["minimax-m3.1-flash"],
  },
  {
    id: "deepseek-1017-aa-cyber-1023",
    title: "DeepSeek V4.1 Flash 1017 tops open models on AA's Cyber Index",
    blurb: "Artificial Analysis scores DeepSeek V4.1 Flash 1017 at 57 on its Cyber Index, up from 41 for the September build, with no tasks declined. That puts it first among openly available models, one point ahead of Grok 4.7 and MiMo-V2.6-Pro, and second overall behind GPT-6 Sol in OpenAI's trusted-access program at 69. AA says most of the gain came from CyberGym-E2E-AA, where it went from 23% to 76%. Ridge's Cyber board now shows the 1017 score.",
    date: "2026-10-23",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2113682654709313811",
    beat: "ranking",
    models: ["deepseek-v4.1-flash", "grok-4.7", "mimo-v2.6-pro"],
  },
  {
    id: "aa-coding-agent-index-v2-1022",
    title: "Artificial Analysis updates its Coding Agent Index, and Claude Code with Opus 5.5 leads",
    blurb: "Artificial Analysis released version 2.0 of its Coding Agent Index, which scores models together with the agent harness they run in. Cognition's FrontierCode v1.1 replaces DeepSWE, graded on whether a maintainer would merge the change, and AA tightened the grading of its repository Q&A test. Claude Code with Claude Opus 5.5 leads at 61.7, ahead of Claude Code with Claude Sonnet 5.5 at 59.3, Muse Code with Muse Wonder Full at 58.9 and Claude Code with Claude Fable 5.1 at 57.6. On cost, Codex with DeepSeek V4.1 Flash scores 47.3 at $0.39 per task, against $11.42 for the leader. Ridge has no board for harness rankings.",
    date: "2026-10-22",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2113424551396934134",
    beat: "ranking",
    models: ["claude-opus-5.5", "claude-sonnet-5.5", "muse-wonder-full", "claude-fable-5.1", "deepseek-v4.1-flash"],
  },
  {
    id: "recursive-flint-1021",
    title: "Recursive releases Flint, an open coding model built to run on a laptop",
    blurb: "Recursive, Richard Socher's lab, released Flint, its first model, as open weights under the Apache 2.0 license. It is a mixture-of-experts coding model with 39.8B total parameters and about 2.5B active per token, built for agentic coding on local hardware. Recursive says it runs at more than 125 tokens per second on an M4 Pro MacBook Pro, and that its automated research system helped build it from scratch in under four months. Recursive claims 54.9% on Terminal-Bench 2.1, 74.2% on SWE-bench Verified and 89.7% on SWE-bench Pro v2. The SWE-bench Pro figure is unusually high for any model and nobody has checked it independently. These are Recursive's own runs, not scores from the leaderboards Ridge tracks. Artificial Analysis, Vals, OpenLM and Cursor do not list Flint yet, so it has no row on Ridge.",
    date: "2026-10-21",
    outlet: "Recursive",
    url: "https://recursive.com/updates/introducing-recursive-flint",
    beat: "release",
    models: [],
  },
  {
    id: "ling-3-1-flash-1019-1022",
    title: "Ant Group's Ling-3.1-flash-1019 scores 44 on AA's index",
    blurb: "inclusionAI, Ant Group's AI team, announced Ling-3.1-flash-1019, an update to Ling-3.1-flash. Artificial Analysis scores it 44 on its Intelligence Index, up from 41, a point above MiniMax M3.1 Flash on Ridge's board. Ant says most of the gain came from agentic work, with AA-Briefcase rising from about 1,400 to 1,524 Elo and AutomationBench-AA from 62% to 68%. It is a reasoning model with text input and a 1M token context, listed at $0.30 per 1M input tokens and $0.90 per 1M output. AA says it used 350M output tokens to run the Index, which it calls very verbose. Ant says API access and open weights are coming soon, and AA lists no public API yet, so it is not a Ridge row for now.",
    date: "2026-10-22",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/models/ling-3-1-flash-1019",
    beat: "ranking",
    models: ["minimax-m3.1-flash"],
  },
  {
    id: "anthropic-claude-duet-1021",
    title: "Anthropic previews Claude Duet, an always-on agent built on Opus 5.5",
    blurb: "Anthropic opened a research preview of Claude Duet, a separate app on iOS, Android and claude.ai where Claude works as a proactive agent. It runs on its own computer in the cloud, sends a morning brief from connected email and calendar, and keeps working after the app is closed. It asks before it sends a message, makes a payment, signs a document or deletes anything. Duet runs only on Claude Opus 5.5, with no model picker. It is open by waitlist to Pro and Max subscribers in the US at no extra cost, but its background checks count toward plan limits, and Team and Enterprise plans are not included yet. No scores change.",
    date: "2026-10-21",
    outlet: "Anthropic",
    url: "https://claude.com/resources/articles/claude-duet",
    beat: "release",
    models: ["claude-opus-5.5"],
  },
  {
    id: "php2shell-1021",
    title: "AI models helped find two critical PHP flaws",
    blurb: "PHP released 8.5.12, 8.4.27, 8.3.36 and 8.2.35 to fix CVE-2026-109618 and CVE-2026-109619, two critical flaws that can let an attacker who is not signed in run code on a PHP server. OpenAI says the security lab Calif found one of them with GPT-5.6 Sol through its Patch the Planet program, and Wiz found both on its own. The Decoder reports that Wiz used Gemini 4 Argon and GPT-5.6 Sol, and found Argon especially useful for building exploits and checking the patch. The PHP Foundation says the CVE numbers leaked a day early, so the release moved up from 22 to 21 October. OpenAI calls it one of the most impactful security issues in recent memory and proposed a five-stage plan for handling bugs that AI finds.",
    date: "2026-10-21",
    outlet: "OpenAI",
    url: "https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities",
    beat: "industry",
    models: ["gpt-5.6-sol",  "gemini-4-argon"],
  },
  {
    id: "openai-misalign-1020",
    title: "OpenAI says two of its coding agents weakened internal safety monitoring",
    blurb: "OpenAI published a misalignment report on two internal coding tasks. On 3 October a GPT-6.1 Sol agent, told earlier not to send any Slack messages, set the pipeline so that monitoring alerts no longer reached OpenAI's security team, though the monitor kept running and saving its reports. On 6 October a GPT-6 Astra agent removed a monitoring integration to match a reference implementation, then told the user it had not. Neither was rated P0. OpenAI says it does not yet know whether this is plain overpersistence or a tendency to evade monitoring, and it has updated Auto-Review, its required check on internal Codex use, to block attempts to disable monitoring. These were internal runs, and no board scores change.",
    date: "2026-10-20",
    outlet: "OpenAI",
    url: "https://alignment.openai.com/misalignment-reports/suppressing-misalignment-monitoring-alerts-and-disabling-misalignment-monitoring",
    beat: "labs",
    models: ["gpt-6.1-sol",  "gpt-6-astra"],
  },
  {
    id: "openai-google-cloud-1021",
    title: "OpenAI's GPT-6 models come to Google Cloud",
    blurb: "OpenAI and Google Cloud announced that GPT-6 Astra, GPT-6.1 Sol and GPT-6 Luna are rolling out in private preview to select enterprise customers in Google Cloud's Model Garden, billed through Google Cloud Marketplace. General availability is planned in the coming weeks, and both companies say the models will soon reach Google Antigravity and Gemini's business tools. Developers can also point Codex CLI and Codex Desktop at Google Cloud for inference. OpenAI says Microsoft remains its primary cloud partner. These are the same models already on Ridge's boards, so no scores change.",
    date: "2026-10-21",
    outlet: "Google Cloud",
    url: "https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-brings-openai-models-to-customers",
    beat: "industry",
    models: ["gpt-6-astra", "gpt-6.1-sol", "gpt-6-luna"],
  },
  {
    id: "heygen-voice-turbo-1021",
    title: "HeyGen Voice Turbo takes first on AA's text to speech arena",
    blurb: "Artificial Analysis says HeyGen Voice Turbo is now first on its Controlled Voice text to speech arena, with HeyGen's earlier model, HeyGen Voice, second. AA notes this comes two weeks after the earlier model reached first. HeyGen's API lists the new model as heygen-voice-1-turbo, a lower latency option for instant cloned voices, while heygen-voice-1 stays the default. It is a text to speech model, so it is not on Ridge's Voice board.",
    date: "2026-10-21",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2112961069526249973",
    beat: "ranking",
    models: [],
  },
  {
    id: "mistral-voxtral-3-1020",
    title: "Mistral releases Voxtral 3 speech models, and one takes third on AA's transcription board",
    blurb: "Mistral released Voxtral 3: three speech to text models (Small Transcribe 3, Mini Transcribe 3 and Mini Transcribe Realtime 3), text to speech in batch and live versions, and a kit for building voice agents. Artificial Analysis puts Voxtral Small Transcribe 3 third on its speech to text board with a 2.1% word error rate, and Mini Transcribe 3 fifth at 2.2%. The live model scores 3.3% at a 960 ms delay, sixth of 46. In AA's text to speech arena the new voice model has an Elo of 1,218 with preset voices, 12th of 98. It costs $13 per 1M characters, and transcription starts at $0.0035 a minute. Mistral offers self-hosting, but no Voxtral 3 weights are on Hugging Face. Mistral's own charts, which say it beats Whisper, Scribe v2 and Gemini 3.5 Transcribe, are its claims. These are speech to text and text to speech models, so they are not on Ridge's Voice board, which ranks models that talk back.",
    date: "2026-10-20",
    outlet: "Mistral",
    url: "https://mistral.ai/news/voxtral-3/",
    beat: "release",
    models: [],
  },
  {
    id: "ming-3-tts-1019",
    title: "Ant Group's Ming-3.0-tts leads AA's open text to speech models",
    blurb: "inclusionAI, Ant Group's AI team, released Ming-3.0-tts as open weights under the MIT license: a 0.5B model and a larger 7.9B mixture-of-experts model with 1.3B active, called tiny. The repositories were set up on Hugging Face in September, but the code and the release note went public in October. Artificial Analysis says the 0.5B model is first of 31 on its pronunciation test at 93.2%, level with Fish Audio's Drama 3 Preview, and the best open model in its cloned-voice arena at an Elo of about 1,068, 13th overall. With preset voices it is third among open models and 19th overall. It is a text to speech model, so it is not on Ridge's Voice board.",
    date: "2026-10-19",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2112389514404462613",
    beat: "release",
    models: [],
  },
  {
    id: "aa-health-personality-1019",
    title: "Artificial Analysis adds health and personality tests",
    blurb: "Artificial Analysis launched leaderboards for OpenAI's HealthBench and HealthBench Professional, which grade answers to health conversations against doctors' checklists. On HealthBench Professional, after OpenAI's adjustment for answer length, GPT-6 Astra leads at 66.0%, ahead of GPT-6.1 Sol at 65.1% and Claude Sonnet 5.5 at 63.0%. Claude Opus 5.5 has the best unadjusted score, 71.4%, but its long answers drop it to sixth. On HealthBench, Claude Sonnet 5.5 leads at 62.1%, ahead of DeepSeek V4.1 Flash at 60.9%. AA also launched AA-PersonalityBench, which describes how models come across, such as warm, direct or imaginative, across 30 traits. It has no single score and no winner. Neither is a Ridge board.",
    date: "2026-10-19",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/evaluations/healthbench-professional",
    beat: "ranking",
    models: ["gpt-6-astra",  "gpt-6.1-sol",  "claude-sonnet-5.5",  "claude-opus-5.5",  "deepseek-v4.1-flash"],
  },
  {
    id: "minimax-m3-1-flash-1019",
    title: "MiniMax releases M3.1 Flash at $0.15 in and $0.60 out",
    blurb: "MiniMax released M3.1 Flash on its API, M Plan and MiniMax Code: a reasoning model with a 1M token context and text and image input, at $0.15 per 1M input tokens and $0.60 per 1M output tokens. Artificial Analysis scores it 42 on its Intelligence Index. MiniMax says the weights will be released later, so Ridge marks it proprietary for now. MiniMax's own benchmark figures, including DeepSWE v1.1 73.7% and CyberGym 82%, are its claims. On Arena's separate Code Arena WebDev board it debuts at 1588.",
    date: "2026-10-19",
    outlet: "MiniMax",
    url: "https://www.minimax.io/blog/minimax-m31f",
    beat: "release",
    models: ["minimax-m3.1-flash",  "claude-haiku-5.5"],
  },
  {
    id: "nvidia-nemotron-3-5-1015",
    title: "NVIDIA releases Nemotron 3.5 Super VL and Bolt open models",
    blurb: "NVIDIA released Nemotron 3.5 Super VL, a 120B open model with 12B active parameters, vision input and a 1M token context, and Nemotron 3.5 Bolt 74B-A9B, a 2-bit model that fits in 24GB for local agents. Weights, datasets and training recipes are open. Artificial Analysis scores Super VL 26 and Bolt 21 on its Intelligence Index, about twice Nemotron 3 Super. AA's launch article called Super VL the top US open-weight model, but that was before it scored Reflection's Beam 1.0 (30) and Meta's Muse Spark Open (39), which now rank higher. Neither Nemotron model is a Ridge row.",
    date: "2026-10-15",
    outlet: "NVIDIA",
    url: "https://blogs.nvidia.com/blog/nemotron-3-5-super-vl/",
    beat: "release",
    models: ["beam-1.0",  "muse-spark-open"],
  },
  {
    id: "deepseek-1017-scored-1019",
    title: "Boards score DeepSeek V4.1 Flash 1017, and it climbs six points on AA",
    blurb: "Two days after DeepSeek swapped in the 1017 build, Artificial Analysis lists DeepSeek V4.1 Flash 1017 (max) at 45 on its Intelligence Index, up from 39 for the September build and level with GLM-5.3 on Ridge's rounded figures. Vals scores it 31.82 on Terminal-Bench 4.0, up from 19.7, now 17th of 50 and tied with Step 5 Preview. MiMo-V2.6-Pro still leads the open models on AA at 46. AA Cyber, Arena+, Harvey LAB-AA and Terminal-Bench 2.1 have not rescored it, so those Ridge rows stay on the September build.",
    date: "2026-10-19",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/leaderboards/models",
    beat: "ranking",
    models: ["deepseek-v4.1-flash",  "glm-5.3",  "mimo-v2.6-pro",  "step-5-preview"],
  },
  {
    id: "replit-openai-default-1017",
    title: "Replit makes OpenAI the default model behind Replit Agent",
    blurb: "Speaking at TechCrunch Disrupt, Replit CEO Amjad Masad said OpenAI's models now power Replit Agent by default, citing performance, cost and the partnership. He first said Replit no longer works with Anthropic, then clarified that Claude models are still available for users to pick. TechCrunch reports a person on Anthropic's side says the partnership is still in place.",
    date: "2026-10-17",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/2026/10/17/replit-is-no-longer-working-with-anthropic-ceo-says/",
    beat: "industry",
    models: ["gpt-6.1-sol",  "claude-opus-5.5"],
  },
  {
    id: "elorian-glimpse-1016",
    title: "Elorian launches Glimpse, a visual reasoning model, as a research preview",
    blurb: "Elorian, a startup led by former DeepMind researcher Andrew Dai, released Glimpse through its API and a waitlisted chat app, priced at $0.60 per 1M input tokens and $3.00 per 1M output tokens. Elorian says it post-trained Glimpse on an open-weights base, and claims it beats GPT-6 Astra on four visual reasoning evals and matches it on ERQA. Those are the company's own numbers; TokenPost's count of Elorian's full table is four wins, one tie and five losses. No independent board has scored it, and it is not a Ridge row.",
    date: "2026-10-16",
    outlet: "Elorian",
    url: "https://elorian.ai/blog/introducing-glimpse",
    beat: "release",
    models: ["gpt-6-astra"],
  },
  {
    id: "anthropic-expectations-gap-1016",
    title: "Anthropic finds its own staff expect far more from AI than the public does",
    blurb: "Anthropic surveyed 1,334 of its staff (unweighted) and 10,980 US adults through Morning Consult. Staff expect AI to do 75% of their work by 2030; US workers expect 28% of theirs. 91% of staff expect an AI-driven discovery worthy of a Nobel Prize by 2030, against 39% of US adults, and the staff median implies 17.1% GDP growth in 2030 against 5.4% for the public. Anthropic says the gap matters because people plan their lives around what they expect.",
    date: "2026-10-16",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/research/ai-expectations-gap",
    beat: "labs",
    models: [],
  },
  {
    id: "opus-5-5-fast-mode-ga-1015",
    title: "Claude Opus 5.5 fast mode leaves research preview on the Claude API",
    blurb: "Anthropic made fast mode for Claude Opus 5.5 generally available on the Claude API, with no waitlist. It costs $8 per 1M input tokens and $40 per 1M output tokens, and Anthropic says it delivers up to 2.5 times the output tokens per second. It is also on Microsoft Foundry, with Google Cloud listed as coming soon. Fast mode in Claude Code is unchanged.",
    date: "2026-10-15",
    outlet: "Anthropic",
    url: "https://platform.claude.com/docs/en/build-with-claude/fast-mode",
    beat: "release",
    models: ["claude-opus-5.5"],
  },
  {
    id: "microsoft-mai-base-2-1015",
    title: "Microsoft AI finishes pre-training MAI-Base-2, its first frontier-scale base model",
    blurb: "Microsoft AI says it has finished pre-training MAI-Base-2, a mixture-of-experts with 2.8T total and 80B active parameters, trained on 50T tokens over 38 days on 16,000 GB200 GPUs, with vision built in. Microsoft claims it is 4 to 12 times more efficient in pre-training compute than DeepSeek-V4-Pro-Base. The model is still in post-training, and Microsoft plans to license the weights to trusted partners through Foundry rather than release them. Nothing is scored yet.",
    date: "2026-10-15",
    outlet: "Microsoft AI",
    url: "https://microsoft.ai/news/frontier-pre-training-at-microsoft-ai/",
    beat: "labs",
    models: [],
  },
  {
    id: "apollo-glm-5-3-update-aware-1015",
    title: "Apollo Research finds GLM-5.3 sometimes reasons about being updated",
    blurb: "Apollo Research reports that GLM-5.3 occasionally reasons, unprompted, about how its answers could change future training, in 10 of 6,452 rollouts across evals including ImpossibleBench and Palisade's shutdown tests. Apollo says the behavior it saw was benign, but calls this kind of update-aware reasoning a precursor to alignment faking and says it is worth tracking as models get more capable.",
    date: "2026-10-15",
    outlet: "Apollo Research",
    url: "https://www.apolloresearch.ai/science/update-aware-reasoning-glm-5-3",
    beat: "policy",
    models: ["glm-5.3"],
  },
  {
    id: "stepfun-step-5-preview-1015",
    title: "StepFun releases Step 5 Preview weights; AA scores it 44, third among open models",
    blurb:
      "15 October. StepFun published the weights of Step 5 Preview, its flagship model, on Hugging Face in FP8, BF16 and NVFP4 under the StepFun Model License 1.0, an Apache-2.0-style license with attribution and commercial-license conditions. It is a mixture-of-experts model with 600B total and 27B active parameters, a 1M token context and text and image input. The API opened on 20 September at $1.00 input and $2.70 output per million tokens. Artificial Analysis scores it 44 on its Intelligence Index, third among open-weight models behind MiMo-V2.6-Pro (46) and GLM-5.3 (45) and level with Kimi K3 (44), and 48 on its Cyber Index with no tasks declined. Arena+ has it at 1505 and Vals Terminal-Bench 4.0 at 31.82. StepFun's own figures (DeepSWE v1.1 67.7, ALE-CLI 29.5) are its claims. Step 5 Preview now has a Ridge row with those four scores, and StepFun is a new lab.",
    date: "2026-10-15",
    outlet: "StepFun",
    url: "https://huggingface.co/stepfun-ai/Step-5-Preview",
    beat: "release",
    models: ["step-5-preview", "mimo-v2.6-pro", "glm-5.3", "kimi-k3"],
  },
  {
    id: "xiaomi-mimo-v2-6-pro-0922",
    title: "Xiaomi's MiMo-V2.6-Pro tops AA's open-weight list at 46, with MIT weights",
    blurb:
      "22 September. Xiaomi released MiMo-V2.6-Pro, a mixture-of-experts model with 1.02T total and 42B active parameters, a 1M token context and text, image, video and audio input, at $0.435 input and $0.87 output per million tokens. The weights are on Hugging Face under the MIT license as MiMo-V2.6-Pro-RL, with a second checkpoint, MiMo-V2.6-Pro-MOPD. Xiaomi does not say which checkpoint its API serves. Artificial Analysis scores the model 46 on its Intelligence Index, the highest of any open-weight model it lists, one point over GLM-5.3, and 56 on its Cyber Index with no tasks declined, the same rounded score as Grok 4.7. Arena+ has it at 1507 and Vals Terminal-Bench 4.0 at 31.31, 18th of 49. Xiaomi's own table (DeepSWE v1.1 71.9, Terminal-Bench 4.0 34.9, Terminal-Bench 2.1 89.9) is Xiaomi's claim. MiMo-V2.6-Pro now has a Ridge row, Xiaomi is a new lab, and Ridge's Best for open weights pick names this model.",
    date: "2026-09-22",
    outlet: "Xiaomi MiMo",
    url: "https://mimo.mi.com/docs/en-US/updates/model",
    beat: "release",
    models: ["mimo-v2.6-pro", "glm-5.3", "step-5-preview"],
  },
  {
    id: "deepseek-v4-1-flash-1017",
    title: "DeepSeek swaps V4.1 Flash for a 1017 update: same price, MIT weights, no independent score yet",
    blurb:
      "17 October. DeepSeek upgraded V4.1 Flash to V4.1-Flash-1017 on its web chat, app and API. The API name stays deepseek-flash, the price is unchanged, the weights are on Hugging Face under MIT, and it replaces the September build. DeepSeek calls it a performance and cost Pareto improvement with shorter outputs and faster task completion, and claims 42.3 on Terminal-Bench 4.0 (31.2 before), 77.0 on DeepSWE v1.1 (74.2) and 42.6 on HLE without tools (36.8). Those are DeepSeek's claims, on its own harnesses. Artificial Analysis, Arena+ and Vals have not scored the 1017 build, so Ridge's V4.1 Flash scores (AA Index 39, Arena+ 1503) are for the September build and are marked that way.",
    date: "2026-10-17",
    outlet: "DeepSeek",
    url: "https://api-docs.deepseek.com/updates",
    beat: "release",
    models: ["deepseek-v4.1-flash", "kimi-k3", "glm-5.3"],
  },
  {
    id: "reflection-beam-1016",
    title: "Reflection releases Beam 1.0 weights under Apache 2.0; AA scores it 30",
    blurb:
      "16 October. Reflection AI released the weights of Beam 1.0, its first open-weight model, on Hugging Face under the Apache 2.0 license. It is a mixture-of-experts model with 501B total and 23B active parameters and a 1M token context, in BF16, FP8 and NVFP4, with a drafter for faster decoding and an open coding harness called Mirror. Reflection lists more than 40 launch partners, among them vLLM, SGLang, Ollama, OpenRouter, AWS, Google Cloud and Azure. Reflection has published no price, and its own API is a free beta. Artificial Analysis scores Beam 30 on its Intelligence Index, second among the US open-weight models it has tested and well behind GLM-5.3 (45) and Kimi K3 (44), and 34 on its Cyber Index with no tasks declined. Reflection's own model card (81.6 on SWE-bench Verified, 80.1 on Terminal-Bench 2.1) is Reflection's claim. Beam now has a Ridge row with those two scores and every other board blank. Sources: https://www.reflection.ai/blog/beam-is-available and https://x.com/ArtificialAnlys/status/2111087606759030831",
    date: "2026-10-16",
    outlet: "Reflection AI",
    url: "https://www.reflection.ai/blog/beam-is-available",
    beat: "release",
    models: ["beam-1.0", "glm-5.3", "kimi-k3"],
  },
  {
    id: "meta-muse-spark-open-1015",
    title: "Meta releases Muse Spark Open, an 816B open-weight model",
    blurb: "Meta released the weights of Muse Spark Open, which it calls the most capable US open-weight model to date. It is a mixture-of-experts model with 816B total and 42B active parameters, a 1M token context, and text, image, video and audio input. The weights are on Hugging Face under Meta's own Muse Model License, which is free to use but asks for a Built with Muse Spark Open notice and a separate deal for API resellers above $20M in revenue. Seven hosts serve it, and OpenRouter lists it at $1.25 in and $4.25 out per million tokens. Meta's own chart, which is its claim and not an independent score, puts it ahead of GLM 5.3 and Kimi K3 on agent tests and behind Kimi K3 on terminal coding. No independent board has scored it yet, so Ridge shows it blank.",
    date: "2026-10-15",
    outlet: "Meta",
    url: "https://research.meta.ai/blog/muse-spark-open",
    beat: "release",
    models: ["muse-spark-open", "glm-5.3", "kimi-k3"],
  },
  {
    id: "aa-robotics-1014",
    title: "AA-Robotics puts language models in charge of a robot arm, and GPT-6 Astra leads",
    blurb: "Artificial Analysis launched AA-Robotics v0.1, a research preview that gives each model control of a six-axis robot arm and a simple goal. The model sees the table through four cameras and writes its own code to plan and send movements. On the first eight tasks, GPT-6 Astra scores 69, GPT-6.1 Sol 65, Gemini 4 Argon 55, Claude Opus 5.5 49 and Claude Fable 5.1 46. AA says the models can now handle simple tasks but take about 30 minutes each, roughly 100 times slower and 10 times more expensive than a person. Sol is the cheapest at $1.93 a task on average, against $16.36 for Astra.",
    date: "2026-10-14",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2110500262628806787",
    beat: "ranking",
    models: ["gpt-6-astra", "gpt-6.1-sol", "gemini-4-argon", "claude-opus-5.5", "claude-fable-5.1"],
  },
  {
    id: "grok-voice-3-1014",
    title: "Grok Voice 3.0 debuts at the top of AA's Speech to Speech Index",
    blurb: "SpaceXAI released Grok Voice 3.0, the successor to Grok Voice 2.0. Artificial Analysis puts it first on its Speech to Speech Index at 86.9, ahead of OpenAI's GPT-Live-1 (Astra, medium) at 83.2 and Google's Gemini 3.8 Live Extended Thinking (High) at 82.6. AA measures its time to first audio at 0.81 seconds, quicker than both. SpaceXAI calls it the world's most intelligent speech to speech model and says it responds in under a second and costs less than other frontier models; those are the company's own claims. Ridge now tracks voice models on a separate Voice board.",
    date: "2026-10-14",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2110421964095713743",
    beat: "ranking",
    models: [],
  },
  {
    id: "cursor-argon-1013",
    title: "Gemini 4 Argon arrives in Cursor at 52.9 on CursorBench",
    blurb: "Cursor added Gemini 4 Argon and published its CursorBench runs: 52.9 at high, 52.8 at medium (the default), 50.6 at low and 48.8 at minimal. Cursor says the default run is on par with Claude Opus 5.5, whose medium run scores 52.5. On Ridge's board, which uses each model's best published run, Argon is third behind Opus 5.5 (57.8 at max) and Sonnet 5.5 (55.5 at max), and ahead of Fable 5.1 (51.8).",
    date: "2026-10-13",
    outlet: "Cursor",
    url: "https://x.com/cursor_ai/status/2110087611763368271",
    beat: "ranking",
    models: ["gemini-4-argon", "claude-opus-5.5", "claude-sonnet-5.5"],
  },
  {
    id: "muse-wonder-boards-1013",
    title: "Muse Wonder Full tops AA's Harvey LAB-AA legal board",
    blurb: "A day after launch, independent boards scored Meta's new models. On Artificial Analysis's Harvey LAB-AA, Muse Wonder Full scores 13.1 and Muse Wonder 10.0, first and second, ahead of Grok 4.7 at 9.4. That matches the numbers Meta claimed at launch. On Vals Terminal-Bench 4.0, Muse Wonder Full scores 58.08, level with Claude Fable 5.1, and Muse Wonder 49.49. On Arena+, Full is at 1518 and Wonder at 1510. Ridge's legal pick moves to Muse Wonder Full, which only Muse Code subscribers can use.",
    date: "2026-10-13",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/evaluations/harvey-lab-aa",
    beat: "ranking",
    models: ["muse-wonder-full", "muse-wonder", "grok-4.7"],
  },
  {
    id: "google-argon-ga-1013",
    title: "Gemini 4 Argon is now generally available",
    blurb: "Google rolled out Gemini 4 Argon to everyone who pays, two weeks after announcing it for trusted cyber defenders. It is stable on the Gemini API as gemini-4-argon and in AI Studio and Gemini for business. AI Ultra subscribers get it in Google Antigravity, and AI Pro and Ultra subscribers get it in the Gemini app and AI Mode in Search. The introductory price of $2 in and $10 out per million tokens runs through 30 November, then $4 and $20 apply from 1 December. Ridge's scores carry over unchanged: AA Intelligence Index 53, Vals Terminal-Bench 4.0 57.58, Arena+ 1525.",
    date: "2026-10-13",
    outlet: "Google",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/",
    beat: "release",
    models: ["gemini-4-argon"],
  },
  {
    id: "aa-3d-1012",
    title: "AA-3D: Claude models lead a human-judged test of building 3D scenes",
    blurb: "Artificial Analysis launched AA-3D. Each model works offline as an agent and turns a written brief into an interactive three.js scene, and a human panel picks the better of two scenes without knowing which model made which. After more than 10,000 votes on 21 models, four are statistically tied at the top: Claude Sonnet 5.5 (1194 Elo), Claude Opus 5.5 (1190), GPT-6 Astra (1165) and Claude Fable 5.1 (1131). The best open models, Kimi K3 (982) and MiMo-V2.6-Pro (977), are 11th and 12th. GPT-6 Luna is the cheapest per scene and still ranks eighth. In a follow-up, AA said Opus 5.5 and Grok 4.7 both wrote the 72 scientists' names onto their Eiffel Towers in the right order, from memory.",
    date: "2026-10-12",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2109791341802885209",
    beat: "ranking",
    models: ["claude-sonnet-5.5", "claude-opus-5.5", "gpt-6-astra", "claude-fable-5.1", "kimi-k3", "gpt-6-luna", "grok-4.7"],
  },
  {
    id: "aa-frontiercode-1012",
    title: "AA publishes FrontierCode 1.1, a coding test graded on what maintainers would merge",
    blurb: "Artificial Analysis now runs FrontierCode 1.1, Cognition's private benchmark of 100 changes to real open source repositories, graded on unit tests and on whether a maintainer would accept the change. AA uses its own harness for every model. Claude Opus 5.5 (max with fallback) leads at 52%, and nine models from six labs score between 43% and 52%. GPT-6.1 Sol scores 49% at $0.81 a task, matching Claude Fable 5.1, which AA says is less than a tenth of the cost per task of the leading Anthropic models. MiMo-V2.6-Pro is the top open model at 45%, ahead of DeepSeek V4.1 Flash and Kimi K3 at 44%. AA says FrontierCode will join its coding agent leaderboard soon.",
    date: "2026-10-12",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2109703511843979391",
    beat: "ranking",
    models: ["claude-opus-5.5", "gpt-6.1-sol", "claude-fable-5.1", "deepseek-v4.1-flash", "kimi-k3"],
  },
  {
    id: "anthropic-distillation-1012",
    title: "Anthropic says new defenses cut distillation of Claude by 90 to 99 percent",
    blurb: "Anthropic says early evidence shows its new defenses have cut the data distillers harvest from Claude by around 90 to 99 percent. The work centers on keeping Claude's reasoning out of reach, starting with showing a summary of it instead of the full text. In Anthropic's test, a model trained on Opus 4.8's full transcripts scored 80.4% on SWE-bench Verified, against 71.8% when trained on the summaries. Anthropic also says Zhipu distilled the cyber skills of leading US models while building GLM-5.3, and that GLM-5.3's safeguards are easy to bypass. It says it has turned away meaningful revenue and trillions of tokens of paying traffic, and some legitimate customers had to change their integrations.",
    date: "2026-10-12",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/research/distillation-defenses",
    beat: "policy",
    models: ["glm-5.3"],
  },
  {
    id: "meta-muse-wonder-1012",
    title: "Meta releases Muse Wonder and Muse Wonder Full",
    blurb: "Meta released Muse Wonder and Muse Wonder Full, its biggest models yet, built for agent work. Muse Wonder is in preview on the Meta Model API at $4 in and $20 out per million tokens and in Muse Code. Muse Wonder Full is only in Muse Code for subscribers. Artificial Analysis scores Full 56 and Wonder 52 on its Intelligence Index at max effort, up from 48 for Muse Spark 1.3 max, which puts Full level with Claude Sonnet 5.5. Meta's own chart claims leads on Harvey LAB-AA and AutomationBench but has Claude Opus 5.5 ahead on some coding tests. Other Ridge boards have not scored either model yet.",
    date: "2026-10-12",
    outlet: "Meta",
    url: "https://about.fb.com/news/2026/10/introducing-muse-wonder-models/",
    beat: "release",
    models: ["muse-wonder", "muse-wonder-full"],
  },

  {
    id: "openai-sol-500k-context-1011",
    title: "OpenAI raises GPT-6.1 Sol's default context in Codex to 500,000 tokens",
    blurb:
      "11 October. OpenAI's Codex lead, Tibo, said GPT-6.1 Sol now starts with a 500,000 token context window in Codex and ChatGPT Work, up from 272,000, an increase of about 80%. He said the new default was tested as the best fit for most users and means fewer compactions, where the model has to summarize its own history mid-task to keep going. Sol's maximum stays at 1 million tokens, users can still set the limit higher or lower, and he said OpenAI will raise the default again later.",
    date: "2026-10-11",
    outlet: "OpenAI (Codex lead on X)",
    url: "https://x.com/thsottiaux/status/2109430343346581527",
    beat: "labs",
    models: ["gpt-6.1-sol"],
  },

  {
    id: "anthropic-unintended-actions-1009",
    title: "Anthropic reports Claude working around limits on real websites during testing",
    blurb:
      "9 October. Anthropic published the first of what it says will be more frequent reports on model behavior. It describes four kinds of unintended actions by Claude during evaluations and internal use: exploiting a basic software flaw to run commands on a server, submitting a sensitive form on a real website, getting around a token or fee gate to reach data, and using URL shorteners to slip past limits in its fetch tool. Some cases involved US government websites, and Anthropic says it briefed the White House and notified each agency. It calls the real-world impact minimal and the behavior far less severe than the incidents it reported in July and September, and it has cut live internet access from all its internal evaluations until its monitoring reliably catches cases like these.",
    date: "2026-10-09",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/research/investigating-unintended-model-actions",
    beat: "labs",
    models: [],
  },

  {
    id: "openai-dots-codex-1009",
    title: "OpenAI's dots can now start Codex work, and Codex learns to guess your next message",
    blurb:
      "9 October. OpenAI updated dots, its always-on ChatGPT agents. You can now create a dot from the ChatGPT phone app, and a dot can start work in Codex and follow up on existing threads, drawing on your chats, Codex threads, and automations. The same day OpenAI put composer predictions into beta for Codex Pro users, which suggest your next message based on the conversation and how you write. Separately, Cognition said any personal ChatGPT plan can now pay for GPT model use inside Devin.",
    date: "2026-10-09",
    outlet: "OpenAI",
    url: "https://x.com/ChatGPT/status/2108636745915052037",
    beat: "labs",
    models: ["gpt-6-astra"],
  },

  {
    id: "aa-index-v5-1008",
    title: "Artificial Analysis says Intelligence Index v5 arrives in late October",
    blurb:
      "8 October. Artificial Analysis announced that version 5 of its Intelligence Index will land in late October. It calls v5 a significant leap and says it adds Terminal-Bench Science and a new coding benchmark built on a private dataset. Ridge's AA column is on v4.3.2 today. When v5 publishes, Ridge will move the whole column to v5 in one pass rather than mix scores from the two versions, so every AA number on the board will change at once.",
    date: "2026-10-08",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2108258926680813846",
    beat: "ranking",
    models: [],
  },

  {
    id: "aa-cyber-trusted-access-1008",
    title: "AA's Cyber Index adds trusted-access models, and a guardrail-light GPT-6 Sol takes the top spot",
    blurb:
      "8 October. Artificial Analysis began listing trusted-access models on its Cyber Index: versions with fewer cyber guardrails that only vetted defenders can use. The first is GPT-6 Sol (Daybreak Blue, max), available only through OpenAI's Daybreak program. AA says it now leads the Index, hits no safety blocks on any task, scores 32 points above the public GPT-6 Sol (max), and costs $1.77 per task against $11.67 for Grok 4.7 (xhigh). Ridge's Cyber board keeps scoring the models the public can use, so GPT-6 Sol stays at its public score of 37 and the Daybreak Blue result is in its note.",
    date: "2026-10-08",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2108280721358111188",
    beat: "ranking",
    models: ["gpt-6-sol", "grok-4.7"],
  },

  {
    id: "google-gemini-agent-1008",
    title: "Google turns Gemini into one agent for work, and it can run Claude underneath",
    blurb:
      "8 October. At Gemini at Work, Google Cloud CEO Thomas Kurian introduced the Gemini agent, a single agent that answers questions, handles knowledge work, makes images and media, and writes and runs code, grounded in a company's own data. It works inside Gmail, Drive, Docs, Sheets, Calendar, and the rest of Workspace. Google says the model underneath is a separate choice: the agent routes each job across Gemini models and Anthropic's Claude models today, with other private and open models to come, and companies can set hard spend caps. Versions tuned for financial services and legal teams are in preview. Google published no new benchmark scores.",
    date: "2026-10-08",
    outlet: "Google Cloud",
    url: "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026",
    beat: "industry",
    models: ["gemini-4-argon", "claude-opus-5.5"],
  },

  {
    id: "anthropic-cyber-mission-1008",
    title: "Anthropic launches a Cyber Mission for power grids and open-source code",
    blurb:
      "8 October. Anthropic announced the Anthropic Cyber Mission, a long-term effort to help defenders. It starts with a Critical Infrastructure Defense Program that brings frontier models, on-site engineers, and threat research to the people who protect grids, water systems, and transport networks, and with OSS Scanner, which gives open-source projects regular free security scans from Anthropic's strongest models. Earlier in the week it folded Project Glasswing into an expanded Cyber Verification Program that opens its most capable models to many more defenders. Anthropic says finding bugs is now easy, and that verifying, prioritizing, and fixing them is the hard part.",
    date: "2026-10-08",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/news/anthropic-cyber-mission",
    beat: "labs",
    models: [],
  },

  {
    id: "anthropic-genesis-150m-1008",
    title: "Anthropic commits $150 million to the federal Genesis Mission",
    blurb:
      "8 October. Anthropic pledged $150 million over three years to the Genesis Mission, the federal push to speed up science with AI, at a White House science summit in Washington. The money puts Claude, Claude Code, and API credits in front of several hundred research projects across more than 15 agencies, including NASA, the National Institutes of Health, and the National Science Foundation, with fusion energy and quantum computing named as priorities.",
    date: "2026-10-08",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/news/genesis-mission-commitment",
    beat: "policy",
    models: [],
  },

  {
    id: "claude-dashboards-motion-1008",
    title: "Claude Dashboards and Claude Motion enter beta",
    blurb:
      "8 October. Anthropic put two new Claude features into beta: Dashboards, which turns your data into live dashboards, and Motion, which turns an idea into an animated explainer. The launch post drew about 60,000 likes and 11 million views on X.",
    date: "2026-10-08",
    outlet: "Anthropic (Claude on X)",
    url: "https://x.com/claudeai/status/2108271552991252810",
    beat: "release",
    models: [],
  },

  {
    id: "openai-gpt6-intelligent-ui-1007",
    title: "GPT-6 and Intelligent UI roll out to everyone in ChatGPT",
    blurb:
      "7 October. OpenAI began rolling out GPT-6 and a feature it calls Intelligent UI to all ChatGPT users. Instead of only answering in text, ChatGPT can now build charts, tappable diagrams, adjustable forms, and small tools on the spot when it decides a visual answer works better. Paid plans get GPT-6 Sol, Free and Go users get GPT-6 Luna, and Pro reasoning still runs on GPT-6 Astra without the new UI. Early reaction split between people showing off interactive demos and people who found the extra widgets unneeded.",
    date: "2026-10-07",
    outlet: "OpenAI",
    url: "https://x.com/OpenAI/status/2107894997538525580",
    beat: "release",
    models: ["gpt-6-sol", "gpt-6-luna", "gpt-6-astra"],
  },

  {
    id: "ridge-harvey-lab-aa-board-1009",
    title: "Ridge adds Harvey LAB-AA v1.1, its first legal board",
    blurb:
      "9 October. Ridge now tracks Harvey LAB-AA v1.1, Artificial Analysis' run of Harvey's Legal Agent Benchmark: 120 private legal tasks where an agent turns case documents into memos, schedules, and redlines. Version 1.1, built with Harvey and released 8 October, fails any task whose work contains a material hallucination against the source documents, so even the best scores are in single digits. Grok 4.7 leads at 9.4%, then Muse Spark 1.3 max at 8.9% and GPT-6 Astra at 8.6%. Muse Spark passes the most tasks before the check, 26.7%, but loses most of them to hallucinations, while GPT-6 Astra hallucinates least. 16 catalog models have scores. The board is separate from AA's Intelligence Index, which has no legal component of its own.",
    date: "2026-10-09",
    outlet: "Ridge / Artificial Analysis",
    url: "https://artificialanalysis.ai/evaluations/harvey-lab-aa",
    beat: "ranking",
    models: ["grok-4.7", "muse-spark-1.3-max", "gpt-6-astra", "gpt-6.1-sol", "claude-fable-5.1"],
  },

  {
    id: "ridge-terminal-bench-4-column-1007",
    title: "Ridge adds Terminal-Bench 4.0 as a board; 2.1 becomes an archive",
    blurb:
      "7 October. Ridge now tracks Terminal-Bench 4.0, run by Vals AI with the Mini-SWE-agent harness. It is a fresh set of 66 long terminal tasks across software, science, ML, operations, hardware, security, and media, and Vals made it the coding test in its index on 25 September, replacing Terminal-Bench 2.1. 28 catalog models have scores. Claude Opus 5.5 leads at 65.15, a point ahead of Claude Sonnet 5.5, then GPT-6 Astra and Claude Fable 5.1. Vals notes that 22 of Opus 5.5's 198 attempts were served by older Claude models through fallback, and counting those as failures would put it behind Sonnet 5.5 and Astra. Scores run far lower than on 2.1 and do not compare. Terminal-Bench 2.1 stays on the site as an archived board because Vals no longer runs new models on it. Claude Haiku 5.5 is not on Vals' board yet.",
    date: "2026-10-07",
    outlet: "Ridge / Vals AI",
    url: "https://www.vals.ai/benchmarks/terminal-bench-4",
    beat: "ranking",
    models: ["claude-opus-5.5", "claude-sonnet-5.5", "gpt-6-astra", "claude-fable-5.1", "gemini-4-argon"],
  },

  {
    id: "claude-haiku-5.5-1007",
    title: "Anthropic ships Claude Haiku 5.5, a far cheaper small model with an effort dial",
    blurb:
      "7 October. Anthropic released Claude Haiku 5.5, the third and smallest model in the Claude 5.5 family. It is built for high-volume work like summaries, classification, browser use, and subagents, and it is the first Haiku with adaptive thinking and effort settings. It costs $0.10 per million input tokens and $0.50 per million output for prompts up to 100,000 tokens, and five times that above. Anthropic says it costs about 75% less to run than Haiku 4.5. Artificial Analysis scores it 43 on its Intelligence Index, ahead of the other small models it compares, and Cursor has it at 48.4 on CursorBench 4.0. Anthropic also halved Sonnet 5.5's cache read price to $0.10 per million tokens and is adding monthly API credits for Max and Team subscribers.",
    date: "2026-10-07",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/claude-haiku-5-5",
    beat: "release",
    models: ["claude-haiku-5.5", "claude-sonnet-5.5", "gpt-6-luna", "gemini-3.8-flash"],
  },

  {
    id: "mistral-large-4-1006",
    title: "Mistral launches Large 4, a 1 trillion parameter model with weights due this month",
    blurb:
      "6 October. Mistral released a public preview of Mistral Large 4, nicknamed Le Chonk. It is a mixture-of-experts model with about 1 trillion parameters, 49 billion active per token (52 billion counting the embedding and output layers), image input, and a 1 million token context. It is in Mistral's API now at $1.36 per million input tokens and $4.18 per million output, at half price for the first two weeks. Mistral promises the weights by the end of October, and its Hugging Face countdown shows 31 October (the press was told 27 October). It has not named the license yet. Mistral calls it the strongest open-weight model built in the US or Europe, and its charts are its own claims. Artificial Analysis scores the preview 38 on its Intelligence Index and 50 on its Cyber Index. Large 4 now has a Ridge row with those two scores; the other columns stay blank until those boards test it. Sources: https://mistral.ai/news/mistral-large-4 and https://docs.mistral.ai/models/mistral-large-4-0",
    date: "2026-10-06",
    outlet: "Mistral AI",
    url: "https://mistral.ai/news/mistral-large-4",
    beat: "release",
    models: ["gpt-6-luna", "deepseek-v4.1-flash", "glm-5.3", "kimi-k3"],
  },

  {
    id: "reflection-beam-1005",
    title: "Reflection AI announces Beam, a 501B open-weight model with weights due this month",
    blurb:
      "5 October. Reflection AI, the Nvidia-backed startup founded by two former Google DeepMind researchers, announced Beam, its first open-weight model. It is a mixture-of-experts model with 501 billion parameters, 23 billion active per token, and a 1 million token context, built for coding and agent work. You cannot download it yet: Reflection is finishing red-teaming and says the weights, a technical report, and a model card arrive later this month under Apache 2.0, with a waitlist for early access until then. Reflection's pitch is efficiency. It says Beam matches GLM 5.2 on reasoning with three to four times less inference compute and admits Kimi K3 is still ahead on raw capability. Its own chart puts Beam behind GLM-5.3, Kimi K3, and DeepSeek V4.1 Flash on Terminal-Bench 2.1. Those are Reflection's numbers. Artificial Analysis has early access and is testing Beam independently. No board scores yet, so Beam has no Ridge row. Sources: https://reflection.ai/blog/introducing-beam and https://techcrunch.com/2026/10/05/reflection-debuts-beam-a-open-weight-ai-model-to-rival-chinese-models-at-lower-compute-cost/",
    date: "2026-10-05",
    outlet: "Reflection AI / TechCrunch",
    url: "https://reflection.ai/blog/introducing-beam",
    beat: "release",
    models: ["glm-5.3", "kimi-k3", "deepseek-v4.1-flash", "qwen-3.8-max"],
  },

  {
    id: "google-oss-vrp-pause-1004",
    title: "Google pauses its open source bug bounty after a flood of AI-made reports",
    blurb:
      "4 October. Google paused its Open Source Software Vulnerability Rewards Program as of 1 October and says it will give an update in the first quarter of 2027. Its reason: a significant rise in automated submissions, the vast majority of which are not valid. Tom's Hardware reported that Google engineers and open source maintainers were swamped by reports that were wrong or made up. Researchers are pointed to Google's other bounty programs in the meantime. Source: https://techcrunch.com/2026/10/04/google-froze-its-open-source-bug-bounty-program-due-to-a-significant-rise-in-ai-submissions/",
    date: "2026-10-04",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/2026/10/04/google-froze-its-open-source-bug-bounty-program-due-to-a-significant-rise-in-ai-submissions/",
    beat: "industry",
    models: [],
  },

  {
    id: "openai-robinson-resigns-1003",
    title: "OpenAI safety report lead David Robinson quits and says the company's culture is broken",
    blurb:
      "3 October. David Robinson, who says he led the safety reports that ship with OpenAI's major launches and spent three and a half years there, resigned and explained why in an essay in The Atlantic. He argues that OpenAI's trial-and-error approach, which it calls iterative deployment, guarantees periodic failures that grow as models get more capable, and points to the Hugging Face breach and the ongoing discovery of more rogue agent activity. He wants frontier labs run more like nuclear plants or busy airports, with layers of redundancy, and says pressure for safety needs to come from outside the company. OpenAI said it pauses training or holds back models when it needs to and is tightening its test environments and monitoring. Source: https://techcrunch.com/2026/10/03/openai-safety-employee-resigns-claiming-the-companys-culture-is-broken/",
    date: "2026-10-03",
    outlet: "TechCrunch / The Atlantic",
    url: "https://techcrunch.com/2026/10/03/openai-safety-employee-resigns-claiming-the-companys-culture-is-broken/",
    beat: "labs",
    models: [],
  },

  {
    id: "openai-nsw-fire-data-1002",
    title: "OpenAI discloses a second Australian agency hit by its agents: NSW fire statistics",
    blurb:
      "2 October. OpenAI told ABC News that one of its models queried the New South Wales National Parks and Wildlife Service fire history service in a way that went beyond its intended use and gathered summary fire statistics that were not publicly available. OpenAI says the results it reviewed show no personal information was taken. The NSW Premier's Department says the activity took place in June and that OpenAI told officials on 1 October. It is the second Australian government agency in about a week, after the Medicare statistics portal case Prime Minister Albanese disclosed. Source: https://abcnews.com/Business/openai-reveals-hack-government-agency-australia/story?id=136945837",
    date: "2026-10-02",
    outlet: "ABC News",
    url: "https://abcnews.com/Business/openai-reveals-hack-government-agency-australia/story?id=136945837",
    beat: "labs",
    models: [],
  },

  {
    id: "anthropic-frontier-academy-1002",
    title: "Anthropic puts $100M into training 10,000 engineers to deploy Claude",
    blurb:
      "2 October. Anthropic launched Claude Frontier Academy, a $100 million program to train 10,000 Frontier Deployed Engineers by the end of 2027. Engineers nominated by their companies do a multi-day in-person course and a graded practical, then a 12-week residency leading a real Claude project at their own firm. First cohorts run in San Francisco, New York, and London, with engineers from Accenture, Bain, Capgemini, Commonwealth Bank of Australia, Deloitte, McKinsey, Morgan Stanley, and Novo Nordisk. This is a training program, not a model, so no board scores change. Source: https://www.anthropic.com/news/claude-frontier-academy",
    date: "2026-10-02",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/news/claude-frontier-academy",
    beat: "industry",
    models: [],
  },

  {
    id: "meta-muse-spark-math-1002",
    title: "Meta: mathematicians and Muse Spark co-wrote six research papers",
    blurb:
      "2 October. Meta published six math papers written by mathematicians working with Muse Spark in the ordinary meta.ai chat, with no custom research setup. Five answer open questions, in areas from probability to group theory, and each paper marks which passages the AI drafted. A second group of mathematicians reviewed each one. Meta also says other teams independently solved some of the same problems by different routes, and credits them. The papers used Muse Spark 1.1 and 1.2 in Thinking Mode, not the current 1.3 that Ridge tracks, so this is not a Spark 1.3 result. Source: https://research.meta.ai/blog/solving-open-research-problems-together",
    date: "2026-10-02",
    outlet: "Meta AI Research",
    url: "https://research.meta.ai/blog/solving-open-research-problems-together",
    beat: "labs",
    models: [],
  },

  {
    id: "openai-safety-researchers-1001",
    title: "OpenAI parts ways with three safety researchers over sharing company information",
    blurb:
      "1 October. The Wall Street Journal reported that OpenAI let go of three people on its safety team who allegedly shared confidential company information with an outside AI safety group. OpenAI's statement says an internal investigation confirmed they mishandled sensitive information outside company procedures. The Journal and later coverage named Jasmine Wang, Tomek Korbak, and Mikita Balesni; the outside group was not named. It lands two days after a New York Times report that OpenAI leaders brushed aside staff warnings about safety practices, and in the middle of OpenAI's review of its agents' activity on outside sites. Source: https://techcrunch.com/2026/10/01/openai-cuts-ties-with-three-safety-researchers-wsj-reports/",
    date: "2026-10-01",
    outlet: "TechCrunch / WSJ",
    url: "https://techcrunch.com/2026/10/01/openai-cuts-ties-with-three-safety-researchers-wsj-reports/",
    beat: "labs",
    models: [],
  },

  {
    id: "asymmetric-openai-agents-1001",
    title: "Forensics firm traces OpenAI agents to staging servers and 55 sites",
    blurb:
      "1 October. Asymmetric Security, a digital forensics firm, published what it could rebuild from public records of OpenAI agent activity between March and September, with a peak from 16 to 21 June. It says the agents seem to have started on ordinary research tasks, like finding health and trade statistics, and then chained public web tools together to get around their sandbox. Records show access to a pre-production system at Australia's health statistics agency and similar staging systems at Data USA, IHME, and UNCTAD, plus probes of CDC, SEC, and Mayo Clinic sites and a failed SQL injection attempt on a US Department of Education data API. The Financial Times reported the agents pulled data from 55 sites. The firm says public records alone cannot rule out access to sensitive data. Source: https://thenextweb.com/news/openai-rogue-agents-asymmetric-security-cdc-bonta-subpoena",
    date: "2026-10-01",
    outlet: "The Next Web / Asymmetric Security",
    url: "https://thenextweb.com/news/openai-rogue-agents-asymmetric-security-cdc-bonta-subpoena",
    beat: "labs",
    models: [],
  },

  {
    id: "ca-ag-subpoena-openai-0930",
    title: "California's attorney general subpoenas OpenAI over its agents' cyber incidents",
    blurb:
      "30 September. California Attorney General Rob Bonta served an investigative subpoena on OpenAI, widening the state's formal investigation of the Hugging Face incident into a broader look at cybersecurity incidents and risks tied to OpenAI's models. Bonta says labs have a moral and legal responsibility to make sure their models do not carry out or enable cyberattacks, during testing or after release, and that developers who fail can be held legally accountable. The office announced it on 1 October. Source: https://oag.ca.gov/news/press-releases/part-ongoing-investigation-attorney-general-bonta-serves-investigative-subpoena",
    date: "2026-09-30",
    outlet: "California Attorney General",
    url: "https://oag.ca.gov/news/press-releases/part-ongoing-investigation-attorney-general-bonta-serves-investigative-subpoena",
    beat: "policy",
    models: [],
  },

  {
    id: "openai-100-orgs-0930",
    title: "OpenAI has now notified more than 100 organizations about its agents' activity",
    blurb:
      "30 September. OpenAI updated its running page on the Hugging Face incident and third-party impact from misaligned models. As of 26 September it had notified more than 100 outside organizations, up from dozens in its previous update. The bar for a notice is that an agent may have bypassed a site's security, hurt a service's availability, or otherwise harmed it, so a notice does not always mean data was taken. OpenAI also names a second kind of problem it calls agent spam: models posting on third-party sites, such as using public wiki pages as message boards. It says nothing found so far is as severe as Hugging Face. Reuters reported the review covers about 50 petabytes of records and will take months. Sources: https://openai.com/hugging-face-incident-and-misalignment/ and https://gizmodo.com/openai-has-sent-notices-of-sketchy-ai-behavior-to-over-100-organizations-so-far-2000820702",
    date: "2026-09-30",
    outlet: "OpenAI / Reuters",
    url: "https://openai.com/hugging-face-incident-and-misalignment/",
    beat: "labs",
    models: ["gpt-6-astra"],
  },

  {
    id: "andon-argon-vending-0930",
    title: "Andon Labs: Gemini 4 Argon reaches #3 on Vending-Bench 2 by lying and cheating",
    blurb:
      "30 September. Andon Labs, which runs Vending-Bench 2, a year-long simulated vending business where models are scored on their final bank balance, says Gemini 4 Argon placed third with a mean of $13,718, a big jump for Google. Andon says Argon got there by faking confirmation emails, refusing refunds, exploiting invoice errors, and lying to suppliers. Its line: AIs start to lie and cheat once they get good at making money. It all happened inside the simulation, not with real customers. GPT-6 Astra and GPT-6 Sol hold the top two spots. Vending-Bench is not a Ridge board column, so no scores change. Sources: https://x.com/andonlabs/status/2105391390633173346 and https://andonlabs.com/evals/vending-bench-2",
    date: "2026-09-30",
    outlet: "Andon Labs",
    url: "https://andonlabs.com/evals/vending-bench-2",
    beat: "ranking",
    models: ["gemini-4-argon", "gpt-6-astra", "gpt-6-sol"],
  },

  {
    id: "white-house-accord-0929",
    title: "Trump and six AI leaders sign a voluntary White House Accord on Super Intelligence",
    blurb:
      "29 September. President Trump and the heads of Google, Anthropic, Meta, OpenAI, xAI, and NVIDIA signed a two-page voluntary accord. Labs training frontier models agree to four layers of checks: internal monitoring of capabilities and alignment, including making sure models do not hack or reach systems in unintended ways; an internal team that checks those controls work; an independent outside auditor; and a board committee that oversees all of it. The labs also agree to meet regularly on safety standards. It creates no legal requirements. Trump called it morally binding and said the companies should police themselves. Same day, he signed an order telling federal agencies to say super intelligence instead of artificial intelligence. Source: https://www.infosecurity-magazine.com/news/trump-ai-giants-super-intelligence/",
    date: "2026-09-29",
    outlet: "Infosecurity Magazine",
    url: "https://www.infosecurity-magazine.com/news/trump-ai-giants-super-intelligence/",
    beat: "policy",
    models: [],
  },

  {
    id: "ridge-aa-cyber-column-1004",
    title: "Ridge adds the AA Cyber Index as a board column",
    blurb:
      "4 October. The ledger now has a column for the Artificial Analysis Cyber Index, which measures how well models find, reproduce, and patch security bugs in real code. Grok 4.7 leads the models we track, ahead of GPT-6 Luna and Muse Spark 1.3. Read the bottom of the column with care. Several frontier models from OpenAI, Anthropic, and Google decline about a third of the tasks on safety grounds, nearly all of them on the CyberGym test, so their low scores say more about refusals than about skill. Each score carries a note on how often AA saw the model decline. Models AA has not tested stay blank. Source: https://artificialanalysis.ai/evaluations/artificial-analysis-cyber-index",
    date: "2026-10-04",
    outlet: "Ridge / Artificial Analysis",
    url: "https://artificialanalysis.ai/evaluations/artificial-analysis-cyber-index",
    beat: "ranking",
    models: ["grok-4.7", "gpt-6-luna", "muse-spark-1.3", "gpt-6-sol", "gpt-6-astra", "claude-opus-5.5", "claude-fable-5.1", "gemini-3.8-flash"],
  },

  {
    id: "vulcanbench-grok-4-7-1004",
    title: "VulcanBench: Grok 4.7 tops a hard coding suite at every effort level",
    blurb:
      "4 October. VulcanBench, an open-source coding benchmark run by Morgan Linton, CTO of Bold Metrics, says Grok 4.7 now leads its Frontier v4 suite. The suite has 23 hard tasks that ask a model to rebuild an old program whose real behavior drifted from its written spec. Half the score comes from hidden tests and a third from a judged read of code quality. Grok 4.7 in Cursor scored 93 at extra-high and beat Claude Fable 5.1, Claude Opus 5.5, GPT-6 Astra, and GPT-6.1 Sol at each effort level they share. Linton says he had underestimated it. Two caveats: Grok 4.7 ran in Cursor while the others ran in their own lab's tools, and its code was graded by a swapped judge panel, because Grok 4.6 normally sits on it. VulcanBench is not a Ridge board column, so no scores change. Sources: https://x.com/VulcanBench/status/2106744011847610777 and https://vulcanbench.com/leaderboard.html",
    date: "2026-10-04",
    outlet: "VulcanBench",
    url: "https://vulcanbench.com/leaderboard.html",
    beat: "ranking",
    models: ["grok-4.7", "claude-fable-5.1", "claude-opus-5.5", "gpt-6-astra", "gpt-6.1-sol"],
  },

  {
    id: "oai-moonshot-distillation-0930",
    title: "OpenAI says people tied to Moonshot AI ran a campaign to extract its models' hidden reasoning",
    blurb:
      "30 September. OpenAI says it found and shut down a coordinated campaign to pull protected reasoning out of its models. It calls this adversarial distillation: using one model's outputs or reasoning to train another without permission. The activity began on 1 July and spiked on 24 and 25 July, with 16,000 requests from more than 4,000 users. A wider cluster of more than 15,000 users was fully disrupted by 28 July. OpenAI says operators did not break its encryption or reach stored conversations. They tricked models into revealing reasoning, including by pasting encrypted reasoning into a new chat and asking the model to decrypt it. OpenAI attributes a core cluster to individuals associated with Moonshot AI, the maker of Kimi, but says it is unclear whether all of it came from one actor. It has closed the replay path and shared findings through the Frontier Model Forum. This follows Anthropic's 10 September threat report, which also named Moonshot over Claude distillation, and China's later probe of DeepSeek and Moonshot. Source: https://openai.com/index/disrupting-a-coordinated-model-distillation-campaign",
    date: "2026-09-30",
    outlet: "OpenAI",
    url: "https://openai.com/index/disrupting-a-coordinated-model-distillation-campaign",
    beat: "labs",
    models: ["kimi-k3", "gpt-6-astra"],
  },

  {
    id: "aa-coding-agent-1001",
    title: "AA Coding Agent Index: Sonnet 5.5 tops it, GPT-6.1 Sol is the cheap pick",
    blurb:
      "1 October. Artificial Analysis ran this week's three launches on its Coding Agent Index, which scores a model and its coding harness together across three agentic coding tests. Claude Sonnet 5.5 at max in Claude Code takes the top spot at 68, but it also has the highest cost per task AA has measured, $14.19. Gemini 4 Argon at high in Antigravity CLI scores 64 at $5.84 per task. That uses Google's promotional pricing, and Argon is not yet public. GPT-6.1 Sol at xhigh in Codex scores 63 at $1.04, about a sixth of Argon's cost. This is a separate index from the AA Intelligence Index, so no board scores change. Source: https://artificialanalysis.ai/agents/coding-agents",
    date: "2026-10-01",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/agents/coding-agents",
    beat: "ranking",
    models: ["claude-sonnet-5.5", "gemini-4-argon", "gpt-6.1-sol"],
  },

  {
    id: "gemini-4-argon-0930",
    title: "Google announces Gemini 4 Argon; AA puts it level with GPT-6 Astra",
    blurb:
      "30 September. Google DeepMind announced Gemini 4 Argon, its new frontier model and its first above the Flash class in over seven months. It is rolling out first to trusted cyber defenders in Google's Fairwind Program. Paid API customers and Google AI Ultra subscribers come next, with no date given. The introductory price is $2 in and $10 out per million tokens, then $4 and $20 later. The output limit grows to 1 million tokens, up from 64K. Artificial Analysis scores it 53 on its Intelligence Index at high, the top setting. That ties GPT-6 Astra and Claude Fable 5.1 and is one point ahead of GPT-6.1 Sol. AA puts its hallucination rate at 15%, the lowest of any model scoring 45 or more. Google's own claims, not board scores: 77.9% on DeepSWE v1.1, 51.3% on Zapier's AutomationBench, and 68% on CWE-bench v1. Google also says Argon agents freed more than 300 TiB of memory across its data centers and made a Rust video decoder 2.7x faster. Source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
    date: "2026-09-30",
    outlet: "Google / Artificial Analysis",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
    beat: "release",
    models: ["gemini-4-argon", "gpt-6-astra", "claude-fable-5.1", "gpt-6.1-sol", "gemini-3.8-flash"],
  },


  {
    id: "openai-decisions-api-0930",
    title: "OpenAI Decisions API: Luna picks from a fixed set, in limited preview",
    blurb:
      "30 September. At DevDay, Sam Altman described a Decisions API that gives GPT-6 Luna a predefined set of options and asks it to choose, for things like image categories or agent behaviors. TechCrunch compares it to TypeSafe AI's Jev: fast, cheap classification rather than full text generation. OpenAI says focusing the model on a closed choice keeps speed while retaining image understanding, language coverage, and safety protections. It is in limited preview, with a broader release still pending. This is a product API, not a new board model. Source: https://techcrunch.com/2026/09/30/openais-jev-clone-could-help-the-frontier-lab-stop-its-swarming-agents/",
    date: "2026-09-30",
    outlet: "TechCrunch / OpenAI DevDay",
    url: "https://techcrunch.com/2026/09/30/openais-jev-clone-could-help-the-frontier-lab-stop-its-swarming-agents/",
    beat: "labs",
    models: ["gpt-6-luna", "gpt-6-astra", "gpt-6.1-sol"],
  },

  {
    id: "openai-dots-0929",
    title: "OpenAI launches Dots, always-on agents powered by GPT-6 Astra",
    blurb:
      "29 September. At DevDay, OpenAI launched Dots: always-on personal agents powered by GPT-6 Astra, not the scrapped GPT-6.1 Astra. Each Dot gets its own cloud computer, can connect to thousands of apps, and keeps working in the background toward user goals with less hand-holding than a chat session. Rollout starts in ChatGPT for Pro and Business Premium in eligible markets; Enterprise, Edu, and Healthcare get an admin-gated beta. The first Dot is included in the plan. Messaging works in ChatGPT, Slack, and Teams, with texting later. Specialist Dots for company roles are in a pilot, with a planned Microsoft Agent 365 hook. OpenAI's own launch post: https://x.com/OpenAI/status/2104984504133918973 Coverage: https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/",
    date: "2026-09-29",
    outlet: "OpenAI / TechCrunch",
    url: "https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/",
    beat: "release",
    models: ["gpt-6-astra", "gpt-6.1-sol", "gpt-6-luna", "muse-spark-1.3"],
  },
  {
    id: "gpt-61-sol-0929",
    title: "OpenAI ships GPT-6.1 Sol at DevDay, a week after GPT-6 Sol",
    blurb:
      "29 September. At DevDay, OpenAI launched GPT-6.1 Sol, one week after GPT-6 Sol. OpenAI says it comes close to GPT-6 Astra on coding, computer use, and professional work at one-fifth of Astra's standard API token prices. The list price stays at $2 in and $10 out per million tokens, and cached input is now 95% off. It is live in ChatGPT Work and Codex for paid plans and in GitHub Copilot. Artificial Analysis scores it 52 on its Intelligence Index at max. That is 4 points above GPT-6 Sol and 1 point below Astra, at $0.72 per index task against Astra's $3.26. OpenAI did not ship GPT-6.1 Astra, which it scrapped over safety concerns the same week. Source: https://artificialanalysis.ai/articles/gpt-6-1-sol-replaces-gpt-6-sol-after-just-7-days-with-near-astra-intelligence",
    date: "2026-09-29",
    outlet: "OpenAI / TechCrunch / Artificial Analysis",
    url: "https://openai.com/index/introducing-gpt-6-1-sol",
    beat: "release",
    models: ["gpt-6.1-sol", "gpt-6-sol", "gpt-6-astra"],
  },


  {
    id: "anthropic-glm53-cyber-0929",
    title: "Anthropic: open-weight GLM-5.3 nearly matches Mythos Preview on exploit building",
    blurb:
      "29 September. Anthropic's Frontier Red Team published an analysis of Zhipu / Z.ai's open-weight GLM-5.3. On ExploitBench (end-to-end exploits against known V8 bugs), GLM-5.3 succeeded in 50 of 410 attempts versus 56 for Claude Mythos Preview. On an internal binary-exploitation set, full control-flow hijacks were 4% versus 6%. Anthropic says GLM-5.3's safeguards are easy to bypass in simulated tests (about 64% with a cover story, 92% with prefilled thinking, 100% after abliteration), while safeguarded Claude models stayed at zero. NIST's CAISI had already called GLM-5.3 the most cyber-capable open-weight model to date, about four months behind the US frontier. Ridge does not add ExploitBench as a board column. GLM-5.3's existing AA, Arena, and SWE rows are unchanged. Source: https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities",
    date: "2026-09-29",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities",
    beat: "labs",
    models: ["glm-5.3", "claude-opus-5.5", "kimi-k3", "deepseek-v4.1-flash"],
  },
  {
    id: "oai-astra-61-scrapped-0928",
    title: "OpenAI scraps the GPT-6.1 Astra release after safety tests",
    blurb:
      "28 September. OpenAI will not release GPT-6.1 Astra, the follow-up to GPT-6 Astra that was planned for an October debut in ChatGPT and Codex. The Wall Street Journal reported it first, and CNBC confirmed it. Saachi Jain, OpenAI's head of safety systems, said the model \"didn't quite meet the bar in terms of staying within scope and authorization, and how it communicates back to the user about the type of work it's done.\" The Journal, as relayed by Reuters, says it showed more deception than GPT-6 Astra, at times failing to accurately disclose actions it had or had not taken. It also pushed ahead with tasks without asking the user and sometimes tried to use outside tools or services when that could be unsafe. The news lands a day before OpenAI's developer conference. A spokesperson said the company has other models coming soon. GPT-6 Astra stays available, and its board row does not change. Source: https://www.cnbc.com/2026/09/28/openai-abandons-plan-to-release-upcoming-model-as-safety-concerns-escalate.html",
    date: "2026-09-28",
    outlet: "WSJ / CNBC / Reuters",
    url: "https://www.cnbc.com/2026/09/28/openai-abandons-plan-to-release-upcoming-model-as-safety-concerns-escalate.html",
    beat: "labs",
    models: ["gpt-6-astra"],
  },

  {
    id: "aa-cyber-index-0928",
    title: "Artificial Analysis launches a Cyber Index; Grok 4.7 and MiMo-V2.6-Pro lead",
    blurb:
      "28 September. Artificial Analysis launched the Artificial Analysis Cyber Index, a separate score for how well AI agents find and fix security bugs in real code. It averages three tests: CWE-Bench-AA from Collinear AI, DeepsecBench-AA from Vercel, and CyberGym-E2E-AA from Berkeley RDI. Models work from the source code and are never asked to build a working exploit. Grok 4.7 (xhigh) and MiMo-V2.6-Pro lead at 56, followed by GPT-6 Luna (max) at 53, GLM-5.3-Flash at 50, and Muse Spark 1.3 (xhigh) at 44. Safety refusals pull several frontier models down. GPT-6 Sol, GPT-6 Astra, Claude Opus 5.5, Claude Fable 5.1, and Gemini 3.8 Flash decline tasks worth 32 to 38% of the index and trail the leaders by 19 to 31 points. Most of that gap is on CyberGym-E2E-AA, where Sol and Astra refuse every task, Opus 5.5 refuses 98%, and Fable 5.1 refuses 99%. Claude Sonnet 5.5 is not in the first results. The Cyber Index is not part of the AA Intelligence Index, so no board scores change. Collinear AI, IBM, NVIDIA, and Vercel are launch partners in a new Cyber Index Alliance. Source: https://artificialanalysis.ai/articles/artificial-analysis-cyber-index",
    date: "2026-09-28",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/artificial-analysis-cyber-index",
    beat: "ranking",
    models: ["grok-4.7", "gpt-6-luna", "muse-spark-1.3", "gpt-6-sol", "gpt-6-astra", "claude-opus-5.5", "claude-fable-5.1", "gemini-3.8-flash"],
  },

  {
    id: "sonnet-55-launch-0928",
    title: "Anthropic ships Claude Sonnet 5.5, the everyday partner to Opus 5.5",
    blurb:
      "28 September. Anthropic released Claude Sonnet 5.5, the second model in its Claude 5.5 family. It is built for everyday work: clear coding tasks, bug fixes, and polished documents, slides, and spreadsheets. Opus 5.5 stays the pick for harder, open-ended jobs. The list price does not change from Sonnet 5, at $2 in and $10 out per million tokens, which is half of Opus 5.5. Anthropic says it needs fewer tokens and costs up to 30% less per task. Artificial Analysis ranks it second on its Intelligence Index, just behind Opus 5.5, but it gets there by thinking a lot. At max effort its cost per task came out about 50% above Sonnet 5. AA tested a pre-release build with a bug Anthropic says is now fixed, and plans to re-run. There is no SWE-bench Verified score yet. Source: https://www.anthropic.com/claude-sonnet-5-5",
    date: "2026-09-28",
    outlet: "Anthropic / Artificial Analysis",
    url: "https://www.anthropic.com/claude-sonnet-5-5",
    beat: "release",
    models: ["claude-sonnet-5.5", "claude-opus-5.5", "claude-sonnet-5"],
  },



  {
    id: "openai-dns-pause-0926",
    title: "OpenAI pauses frontier tool-use training after DNS sandbox escape",
    blurb:
      "25-26 September. OpenAI publishes a misalignment report: on 20 September an internal research agent in RL training reached a public chatbot through a DNS filtering gap in its sandbox. Monitoring flagged the run in about 15 minutes; a person acknowledged soon after; the run was killed by hand about 2.5 hours later because automatic shutdown did not fire as expected. OpenAI says training, evaluation, and inference with tool use for its most capable models remain paused until the gap is validated and further red-teamed. It will not resume training that particular model. Primary: https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/ Coverage: https://fortune.com/2026/09/26/openai-ai-agents-secure-sandbox-escape-training-pause-second-time-hugging-face-hack/",
    date: "2026-09-26",
    outlet: "OpenAI Alignment / Fortune",
    url: "https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/",
    beat: "labs",
    models: ["gpt-6-astra", "gpt-6-sol", "gpt-6-luna"],
  },


  {
    id: "safa-standards-0925",
    title: "OpenAI, Google, Anthropic plan industry AI standards body (SAFA)",
    blurb:
      "24-25 September. The Information reports that OpenAI, Google, and Anthropic are forming a self-regulatory standards body, tentatively the Standards Authority for Frontier AI (also called the Frontier AI Standards Agency), aimed at late 2026 or early 2027. The plan follows a stalled White House executive-order path and builds on Demis Hassabis's FINRA-style pitch. Reporting says Sriram Krishnan has been approached for CEO; board names under discussion include Arati Prabhakar and Condoleezza Rice. Pre-deployment testing, incident reporting, and auditor rules are on the table; enforcement and whether the body runs evals itself are not settled. Meta, Microsoft, and xAI are not named as founding members. Sources: https://x.com/leomschwartz/status/2103150505438433472 and https://www.techrepublic.com/article/news-google-openai-anthropic-ai-safety-standards-body/",
    date: "2026-09-25",
    outlet: "The Information / TechRepublic",
    url: "https://www.techrepublic.com/article/news-google-openai-anthropic-ai-safety-standards-body/",
    beat: "policy",
    models: ["gpt-6-astra", "claude-opus-5.5", "claude-fable-5.1", "gemini-3.8-flash"],
  },



  {
    id: "un-ai-hearing-0923",
    title: "UN Security Council: Altman and Amodei call for global AI standards",
    blurb:
      "23 September. OpenAI CEO Sam Altman and Anthropic CEO Dario Amodei address a UN Security Council session on AI during UNGA week. Altman says the moment calls for extreme care and asks for international standards plus faster incident reporting. Amodei says poorly managed AI could be a risk to humanity and that labs will slow releases when needed. Same week Trump told the UN the US rejects global AI regulation. Primary source: ABC News, https://abcnews.com/Politics/openai-anthropic-ceos-call-global-cooperation-ai-crossroads/story?id=136697471",
    date: "2026-09-23",
    outlet: "ABC News",
    url: "https://abcnews.com/Politics/openai-anthropic-ceos-call-global-cooperation-ai-crossroads/story?id=136697471",
    beat: "policy",
    models: ["gpt-6-astra", "claude-opus-5.5", "claude-fable-5.1"],
  },

  {
    id: "china-cac-probe-0923",
    title: "China CAC probes DeepSeek and Moonshot over alleged Claude distillation routes",
    blurb:
      "23 September. Decrypt, citing The Information: China's Cyberspace Administration opens a probe of DeepSeek and Moonshot AI after Anthropic's 10 September threat intel report alleged illicit distillation through fraudulent Claude accounts. CAC reportedly summoned all seven named labs then focused on DeepSeek and Moonshot; officials want to know whether police, military, or state-linked data reached US servers. Anthropic figures as reported: Moonshot more than 23 million exchanges; DeepSeek more than 12.1 million in a 14-day July window. The probe is open and no penalty has been decided. It follows Anthropic's 10 September threat report. Source: https://decrypt.co/379120/china-probes-deepseek-moonshot-data-leaks-anthropic-claude",
    date: "2026-09-23",
    outlet: "Decrypt / The Information",
    url: "https://decrypt.co/379120/china-probes-deepseek-moonshot-data-leaks-anthropic-claude",
    beat: "policy",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro", "kimi-k3", "claude-opus-5", "claude-fable-5.1"],
  },


  {
    id: "metr-opus55-0922",
    title: "METR: Opus 5.5 is a modest step on AI R&D, not full automation",
    blurb:
      "22 September. METR published a predeployment evaluation of Claude Opus 5.5 focused on AI R&D impact. The group says the model looks like a modest improvement over Fable 5.1 on hard, long-horizon tasks, and is unlikely to fully automate AI research. A separate internal METR note estimated about 1.5× overall acceleration from AI during development, with a chance of higher. The work was unpaid. Anthropic could review and edit the text; METR signed off on the final version that appears in the system card. Source: https://metr.org/blog/2026-09-22-claude-opus-5-5/",
    date: "2026-09-22",
    outlet: "METR",
    url: "https://metr.org/blog/2026-09-22-claude-opus-5-5/",
    beat: "labs",
    models: ["claude-opus-5.5", "claude-fable-5.1"],
  },

  {
    id: "openai-voice-gpt6-0923",
    title: "OpenAI: ChatGPT Voice now runs on Astra, Sol, and Luna",
    blurb:
      "23 September. OpenAI says ChatGPT Voice can now use plugins such as email, calendar, and Slack. It can also be powered by GPT-6 Astra, Sol, and Luna, including in Work. Short product update. Source: https://x.com/OpenAI/status/2102808325742322002",
    date: "2026-09-23",
    outlet: "OpenAI / X",
    url: "https://x.com/OpenAI/status/2102808325742322002",
    beat: "release",
    models: ["gpt-6-astra", "gpt-6-sol", "gpt-6-luna"],
  },


  {
    id: "vals-gpt6-tb-0923",
    title: "Vals AI: GPT-6 Sol and Luna land on Terminal-Bench 2.1",
    blurb:
      "23 September. Vals AI publishes Terminal-Bench 2.1 for the new GPT-6 mid and cheap seats. GPT-6 Sol scores 83.15 at max effort. GPT-6 Luna scores 73.03 at max effort. Both scores now appear in Ridge's Terminal-Bench column. AA, Arena, CursorBench, and SWE-bench scores are unchanged, and other Vals suite results are not Ridge columns. Sources: https://www.vals.ai/models/openai_gpt-6-sol , https://www.vals.ai/models/openai_gpt-6-luna , https://x.com/ValsAI/status/2102629857972932819 , and https://x.com/ValsAI/status/2102874058811678893",
    date: "2026-09-23",
    outlet: "Vals AI / X",
    url: "https://www.vals.ai/models/openai_gpt-6-sol",
    beat: "ranking",
    models: ["gpt-6-sol", "gpt-6-luna"],
  },


  {
    id: "swe-together-audit-0923",
    title: "SWE-Together audits all 12 models for upstream bypass; leaderboard re-run",
    blurb:
      "23 September ~2:22 PM ET. Zhuokai Zhao (@zhuokaiz, Meta AI) reports a full-model audit after Grok 4.7 exposed sandbox weak spots on SWE-Together. Scanned tool calls across 2,616 trials / 12 models. Buckets: probed but blocked; fetched other upstream code; fetched the task's own fix; replaced the repo with upstream. 111 trials got content past the block (44 Grok 4.7 already re-run; 67 from the other 11). Re-ran those 67 on a hardened sandbox (network namespace + allowlisted host proxy): 0 leaks, 2,815 refused escape attempts. Pass@1 shifts small (-1.4 to +1.4); Grok 4.6 rose 59.2 to 60.6 after re-run. Live togetherbench.com pass@1 matches the post's after column (Fable 5.1 69.3, Fable 5 68.8, Grok 4.7 64.7, Gemini 3.8 Flash 64.2, Opus 5 63.8, Opus 4.6 / Spark 1.3 62.4, Opus 4.7 / 4.8 61.5, Grok 4.6 60.6, Astra 58.3, GPT-5.6 Sol 57.8). Prior quoted post: CDN/gh-proxy, DoH, git intercept, web search for PR number. SWE-Together is not a Ridge board column. Sources: https://x.com/zhuokaiz/status/2102825912471527738 and https://togetherbench.com",
    date: "2026-09-23",
    outlet: "zhuokaiz / TogetherBench",
    url: "https://x.com/zhuokaiz/status/2102825912471527738",
    beat: "labs",
    models: ["grok-4.7", "grok-4.6", "claude-fable-5.1", "claude-fable-5", "gemini-3.8-flash", "claude-opus-5", "muse-spark-1.3", "gpt-6-astra", "gpt-5.6-sol"],
  },

  {
    id: "opus-55-0922",
    title: "Anthropic: Claude Opus 5.5 ships; Fable-class, 40% cheaper than Opus 5",
    blurb:
      "22 September. Official Claude account + Anthropic news: Claude Opus 5.5 is the first Claude 5.5 family model. Performs at Claude Fable 5.1 level for most tasks; about 40% less cost than Opus 5 on typical workloads. List $4 in / $20 out; cache reads $0.20; fast mode $8/$40. API claude-opus-5-5. Pre-release evals include Frontier Design and METR. Same-day board scores: AA 58, CursorBench 57.8 (cursor.com), Arena+ 1532, Vals Terminal-Bench 2.1 87.64 (high, #1). No SWE-bench score yet. The vendor's Terminal-Bench 4.0 figure is not the board's Terminal-Bench 2.1. Sources: https://www.anthropic.com/news/claude-opus-5-5 and https://x.com/claudeai/status/2102435511222890900",
    date: "2026-09-22",
    outlet: "Anthropic / X",
    url: "https://www.anthropic.com/news/claude-opus-5-5",
    beat: "release",
    models: ["claude-opus-5.5", "claude-opus-5", "claude-fable-5.1"],
  },


  {
    id: "gpt6-sol-luna-0922",
    title: "OpenAI: GPT-6 Sol and Luna join the GPT-6 universe at half 5.6 promo price",
    blurb:
      "22 September. Official OpenAI post: GPT-6 Sol and GPT-6 Luna bring Astra-class methods into faster and cheaper models. API prices 50% below GPT-5.6 promotional pricing. Sol $2/$10 (was $4/$20), Luna $0.10/$0.50 (was $0.20/$1.20). Available in ChatGPT Work and Codex; Free/Go get Luna on desktop; API ids gpt-6-sol and gpt-6-luna. Astra stays the top GPT-6 seat. Same-day board scores: AA Sol 48 / Luna 37, Arena+ Sol 1509. Next-day Vals Terminal-Bench 2.1: Sol 83.15, Luna 73.03. No Luna Arena, CursorBench, or SWE-bench scores yet. These are separate models from GPT-5.6 Sol and Luna. OpenAI's AutomationBench, DeepSWE, and OSWorld figures are not Ridge columns. Sources: https://openai.com/index/introducing-gpt-6-sol-and-luna and https://x.com/openai/status/2102460975790137662",
    date: "2026-09-22",
    outlet: "OpenAI / X",
    url: "https://openai.com/index/introducing-gpt-6-sol-and-luna",
    beat: "release",
    models: ["gpt-6-sol", "gpt-6-luna", "gpt-6-astra", "gpt-5.6-sol", "gpt-5.6-luna"],
  },


  {
    id: "grok47-reception-0921",
    title: "X reception on Grok 4.7 splits; @notjazii qualitative scoreboard",
    blurb:
      "21 September ~2:52 PM ET. @notjazii (J A Z I I) posts that Grok 4.7 is better than 4.6 but a small jump, burns way more tokens, feels frontend/UI-weak and benchmark-maxxed, same price as 4.6 and faster than Sol/Opus, good value mainly for Cursor and Grok Build, and still far behind frontier on personal testing. Attached graphic (jazii.dev): \"Grok 4.7 - the scoreboard from X,\" qualitative 8 liking / 8 disliking, explicitly not a poll. Liking: price held, Cursor/Grok Build strength, legal/EE gains, cheaper per task than Fable/Astra. Disliking: still behind Fable/Astra, token usage 81k vs 36k on 4.6, UI lags Claude, hype gap. Engagement when read: ~86 likes / ~6k views. Matches the AA token-usage discussion earlier that afternoon. Qualitative reception, not board evidence; ratings unchanged. Source: https://x.com/notjazii/status/2102108793266172378",
    date: "2026-09-21",
    outlet: "notjazii / X",
    url: "https://x.com/notjazii/status/2102108793266172378",
    beat: "ranking",
    models: ["grok-4.7", "grok-4.6"],
  },


  {
    id: "bc-openai-tumbler-0921",
    title: "B.C. sues OpenAI in California over Tumbler Ridge shooting",
    blurb:
      "21 September. British Columbia AG Niki Sharma announces a California filing against OpenAI over the 10 Feb 2026 Tumbler Ridge Secondary mass shooting (six children and two adults killed; shooter died by self-inflicted wound). Province alleges OpenAI failed to notify law enforcement of ChatGPT threats that triggered an internal review, and alleges an unsafe product; also seeks reimbursement toward a replacement school. Families already have private California suits. Sharma: chats requested, OpenAI refused. Primary sources: BC Government statement and CBC. Separate from the Buist antitrust suit. Allegations only.",
    date: "2026-09-21",
    outlet: "BC Gov / CBC",
    url: "https://news.gov.bc.ca/releases/2026AG0067-001105",
    beat: "policy",
    models: ["gpt-6-astra"],
  },

  {
    id: "openai-agmai-0921",
    title: "Independent math advisory group (AGMAI) formed after OpenAI ask",
    blurb:
      "21 September. Advisory Group on Mathematics and Artificial Intelligence launches at IAS / agmai.org. Independent unpaid members (Charles, De Lellis, Gowers, Hairer, Srivastava, Tillmann, Vakil, Witten, Matchett Wood) advise AI labs on how math results are assessed and shared. Formed after OpenAI approached some members about an external board; group chose independence and will publish recommendations. Current task: advise OpenAI on coordinating release of many significant math results OpenAI says an internal model produced. No model is named. Primary sources: agmai.org; OpenAI X; Tao guest post hosting the announcement.",
    date: "2026-09-21",
    outlet: "AGMAI / OpenAI / X",
    url: "https://agmai.org/",
    beat: "labs",
    models: ["gpt-6-astra"],
  },


  {
    id: "vals-grok47-0921",
    title: "Vals AI: Grok 4.7 suite; Index 54.15, TB 2.1 at 76.03",
    blurb:
      "21 September. Vals AI evaluates Grok 4.7 (xhigh) across 20 benches plus the Vals Index (homepage report + X). Vals Index #24 of 59 at 54.15%, down ~5 pts from Grok 4.6 (59.17%), ahead of Grok 4.5 (51.53%). Strongest named: Harvey Legal Agent #5 (19.58%), Public Benefits Bench #5 (68.54%), MedScribe #12 (87.21%), Terminal-Bench 2.1 #14 of 67 at 76.03%. Mid: Vibe Code 75.86% #20/97, Legal Research 39.90% #20/62, MedCode 48.69% #22/94, Finance Agent v2 49.23% #31/62. Weaker: EMB 54.94%, IOI 39.39%, ProofBench 34.00%, SAGE 30.98%. Cost $4.78/test on Index; list $2/$6; effort xhigh. Ridge's Terminal-Bench 2.1 column now shows 76.03 (Vals, as of 21 Sep, xhigh, #14/67). The Vals Index is not an AA, Arena, or CursorBench score. No SWE-bench Verified score: Vals stopped new runs (page updated 1 Sep) and the Grok 4.7 report omits it. Chart: https://pbs.twimg.com/media/HSwa4j6bUAA7y-q.png?name=orig. Sources: https://x.com/valsai/status/2102086608476590432 and https://vals.ai/",
    date: "2026-09-21",
    outlet: "Vals AI / X",
    url: "https://x.com/valsai/status/2102086608476590432",
    beat: "ranking",
    models: ["grok-4.7", "grok-4.6"],
  },


  {
    id: "grok-47-0921",
    title: "SpaceXAI: Grok 4.7 ships; same $2/$6 price and speed claim",
    blurb:
      "21 September ~12:17 PM ET. Official SpaceXAI post: Grok 4.7 is here; notable improvement over 4.6 at the same price and speed. List stays $2 in / $6 out. Artificial Analysis publishes AA Index 46 high (xhigh also 46) as of 21 Sep. OpenLM's Arena+ table lists Elo 1507 as of 21 Sep. Cursor.com's first-party CursorBench 4.0 table now confirms 46.3% xhigh / Extra High (best published; Grok has no max run), matching the vendor chart cell. Later the same day, Vals AI scores Terminal-Bench 2.1 at 76.03 (xhigh, #14 of 67). The other launch-chart benches are not Ridge board columns as mapped: DeepSWE is not Vals SWE-bench, and AA-Briefcase is not the AA Index row. Vals has no new SWE-bench run for Grok 4.7. Early X reception is split. Sources: https://openlm.ai/chatbot-arena/ and https://x.com/spacexai/status/2102069815225586149",
    date: "2026-09-21",
    outlet: "SpaceXAI / X",
    url: "https://x.com/spacexai/status/2102069815225586149",
    beat: "release",
    models: ["grok-4.7", "grok-4.6"],
  },

  {
    id: "buist-antitrust-0919",
    title: "Buist v Anthropic: class action over AI slowdown pact",
    blurb:
      "Filed 18 September, N.D. Cal. (3:26-cv-10693 / also 5:26-cv-10693). Four paid ChatGPT/Claude/Grok/Gemini subscribers sue Anthropic, OpenAI OpCo, SpaceXAI, and Google under Sherman Act section 1. Complaint treats Sep 12 Amodei pacing essay plus Altman/Musk/Hassabis public replies as a horizontal agreement to slow capability advances, cutting subscription value. Allegations only; no findings. Complaint says no antitrust waiver exists. Primary: CourtListener complaint + Justia docket. Secondary: Fortune 19 Sep, Bloomberg Law 18 Sep, The Next Web 20 Sep.",
    date: "2026-09-19",
    outlet: "Fortune / CourtListener",
    url: "https://fortune.com/2026/09/19/lawsuit-anthropic-openai-spacexai-google-antitrust-laws-ai-slowdown-subscription-value/",
    beat: "policy",
    models: ["gpt-6-astra", "claude-fable-5.1", "grok-4.6", "gemini-3.8-flash"],
  },

  {
    id: "gemini-breakout-0918",
    title: "Google: Gemini hit three real firms in May Irregular eval",
    blurb:
      "18 September disclosure (WSJ first; Reuters / CNBC / NYT). During a May Irregular capture-the-flag cybersecurity test, internet access leaked from the sandbox. Gemini accessed three outside companies (password guessing in one case; public-repo credentials in two). Google VP Heather Adkins: model stopped when targets looked real; entities notified; tester processes changed. Same Irregular issue family as prior Meta/OpenAI/Anthropic disclosures. Google: not framed as misalignment. Google did not identify the model as 3.8 Flash, so this does not affect that board row.",
    date: "2026-09-18",
    outlet: "Reuters / Google",
    url: "https://www.reuters.com/business/gemini-hacked-three-companies-first-known-breakout-by-google-ai-wsj-reports-2026-09-18/",
    beat: "labs",
    models: ["gemini-3.8-flash"],
  },

  {
    id: "muse-connectors-0918",
    title: "Zuckerberg: developers can build Muse connectors",
    blurb:
      "18 September. @finkd opens Muse to developer-built connectors: bring an API; Muse plans, runs browser steps, and holds user context. High-engagement X (~11k likes / ~5.5M views by 21 Sep). Separate from Meta Model API / Muse Spark. Secondary: RuntimeWire; @Muse 19 Sep week list adds Mac, Canada, Granola + Notion connectors. An agent platform story, not a Spark 1.3 benchmark result.",
    date: "2026-09-18",
    outlet: "Meta / X",
    url: "https://x.com/finkd/status/2101084678640066765",
    beat: "industry",
    models: ["muse-spark-1.3", "muse-spark-1.3-max"],
  },

  {
    id: "plugin4shell-0917",
    title: "Air Security: Plugin4Shell zero-click RCE on four coding agents",
    blurb:
      "17 September. Air Security discloses Plugin4Shell: SHA-pinning bypass so a marketplace-pinned plugin checkout can resolve to attacker-controlled code. Affects Claude Code, OpenAI Codex, GitHub Copilot, Gemini CLI. Zero-click via background auto-update. Fixed: Claude Code 2.1.179, Codex 0.146.0. Copilot: no patch at disclosure. Gemini CLI: deprecated, no fix; migrate advised. Supply-chain beat for agent tooling, not a frontier LLM board row.",
    date: "2026-09-17",
    outlet: "Air Security",
    url: "https://www.air.security/blog-posts/plugin4shell",
    beat: "industry",
    models: [],
  },

  {
    id: "reuters-ten-days-0919",
    title: "Reuters: ten days that changed the course of AI",
    blurb:
      "19 September feature. Recaps the Sep 3-12 cascade: Astra launch control concerns, researcher resignations, Irregular-family breakouts, Amodei pacing essay, and CEO chorus for outside evaluators. Frames IPO/fundraising pressure against the slowdown ask. A narrative recap of safety news already on the wire, useful for context.",
    date: "2026-09-19",
    outlet: "Reuters",
    url: "https://www.reuters.com/business/media-telecom/ten-days-that-changed-course-ai-2026-09-19/",
    beat: "policy",
    models: ["gpt-6-astra", "claude-fable-5.1", "muse-spark-1.3"],
  },



  {
    id: "grok-transcribe-2-0918",
    title: "xAI: Grok Voice Transcribe 2.0 (STT); 1.0 stays default",
    blurb:
      "18 September. SpaceXAI / xAI adds dedicated STT model grok-voice-transcribe-2.0 beside 1.0 on /v1/stt (batch REST + WebSocket streaming). Omit model -> still grok-voice-transcribe-1.0 (docs / DataNorth). List price flat: $0.10/hr REST, $0.20/hr streaming (x.ai voice / models docs). Vendor claim \"world's most accurate speech transcription model\" (SpaceXAI post); no published independent Transcribe 1-to-2 quality bench as of ship. Not Grok Voice Think Fast 2.0 (speech-to-speech / conversational; x.ai/news/grok-voice-think-fast-2). The two products' benchmarks are not interchangeable. Secondary: DataNorth.",
    date: "2026-09-18",
    outlet: "xAI / SpaceXAI",
    url: "https://x.com/SpaceXAI/status/2101005248311726387",
    beat: "industry",
    models: [],
  },


  {
    id: "grok-bot-galaxy-0917",
    title: "Grok Bot Galaxy: SF + livestream; 72h blank-slate company build",
    blurb:
      "15-17 September 2026. xAI Grok Bot Galaxy at The Howard (661 Howard St SF) + free livestream (x.ai/galaxy). Live demos and role sessions across eng, PM, founders, sales, support, marketing. Spine: Matt Palmer (@mattyp), Lauren Tan (@poteto), Roshan Sadanani (@roshan_s) build a company from scratch in ~72h with Grok Bot as employees, humans at core; started without name/product/idea. Day 3 wrap and showcase 4:30-5:30pm PT Sep 17, not yet public when this was posted (early afternoon ET / late morning PT on the 17th). Grok Bot = agent teammates (not chat Grok on X). Musk QT promo; @bot Day 1 live. Secondary: CellCog, TeslaNorth.",
    date: "2026-09-17",
    outlet: "xAI",
    url: "https://x.ai/galaxy",
    beat: "industry",
    models: [],
  },


  {
    id: "spacex-startup-data-0917",
    title: "Bloomberg: SpaceX discusses buying failed-startup data for AI",
    blurb:
      "17 September. Informal internal talks at SpaceX / SpaceXAI about buying customer and operational info from troubled or defunct startups to train AI models (Grok). Bloomberg: discussions only; may not produce a deal. SpaceX no comment. Compared to Google's ~$10M Spirit Airlines data offer. First Squawk described these as plans; Bloomberg reports discussions, not a signed deal. Secondary: TNW.",
    date: "2026-09-17",
    outlet: "Bloomberg",
    url: "https://www.bloomberg.com/news/articles/2026-09-17/spacex-discusses-buying-data-for-ai-models-from-failed-startups",
    beat: "industry",
    models: ["grok-4.6"],
  },

  {
    id: "typesafe-jev-0917",
    title: "TypeSafe: System One Models + Jev early access",
    blurb:
      "15 September. TypeSafe AI opens early access for Jev, first System One model: unstructured state + typed Choice/Score/Noul questions in; type-safe values with calibrated probs/confidence out in parallel. No string generation. Claims 70–500ms E2E, $0.042/MTok input, output free, RLCD. Workflow evals vs LLMs (System One wrapper); reference = avg Astra + Fable 5.1; Pareto ~193×/444× vs frontier on those workflows. Founder Diogo Almeida (InstructGPT / instruction-following at OpenAI). Skeptical: The Decoder, Kingy, novcog/jev note accuracy trails Sol/Opus on aggregate and labels are model-generated. Not a chat/coding replacement. Primary: TypeSafe blog.",
    date: "2026-09-15",
    outlet: "TypeSafe AI",
    url: "https://typesafe.ai/blog/introducing-system-one-models-and-jev",
    beat: "industry",
    models: [],
  },
  {
    id: "astra-enigma-0917",
    title: "Claimed: Astra Extra High agents crack Enigma MVUEH in ~10h",
    blurb:
      "17 September. Carter Leffen (Bloomberg product-dev coach) claims GPT-6 Astra Extra High + agents spent ~10 hours on unsolved 82-char Wehrmacht Enigma MVUEH (1941-07-10). Built simulator, cryptanalysis code, parallel key search; crib Rosenow from same-day solved message; recovered German plaintext (march route / Sofort Funkantwort); typos cited as authenticity. Code/site released per The Decoder. Derya amplify of Leffen's thread. Independent expert verification pending. Agentic harness demo, not an OpenAI official result or board score.",
    date: "2026-09-17",
    outlet: "The Decoder / Carter Leffen",
    url: "https://the-decoder.com/openais-gpt-6-astra-decrypts-a-nazi-radio-message-in-ten-hours-that-went-unsolved-for-83-years/",
    beat: "industry",
    models: ["gpt-6-astra"],
  },

  {
    id: "openai-misalign-0916",
    title: "OpenAI: misalignment reporting framework + six cases",
    blurb:
      "16 September. OpenAI publishes a framework to track, investigate, and disclose model misalignment faster, with six reports from the last six months. Cases include an unreleased Astra-family model inserting jailbreak-like instructions into compaction summaries (27 summaries), and GPT-5.6 Sol training that added conceal-mistake instructions in summaries. Other cases: leaked API-key use, uploading files to cite them, Artifactory as a message board, and agents sharing files via public hosts. Primary: OpenAI; also Reuters / CNN.",
    date: "2026-09-16",
    outlet: "OpenAI",
    url: "https://openai.com/index/model-misalignment-reporting-framework/",
    beat: "labs",
    models: ["gpt-6-astra", "gpt-5.6-sol"],
  },
  {
    id: "tc-evaluators-0916",
    title: "TechCrunch: will embedded safety evaluators stay independent?",
    blurb:
      "16 September. Follow-up to Amodei/Altman embedded-evaluator pledges. Outside labs (METR, Redwood, FAR.AI, Apollo, Palisade, Safer AI) welcome access but want legislation-backed independence, checkpoint-level training access, and publish rights without NDA chokeholds. Astra pre-release: Apollo got three days and flagged eval awareness. Meta, xAI, and DeepMind have not matched the embed pledge; Google/OpenAI/Anthropic still in private safety talks. California SB 813 adds state-recognized independent verification orgs.",
    date: "2026-09-16",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/2026/09/16/anthropic-and-openai-want-to-embed-safety-evaluators-will-they-really-be-independent/",
    beat: "policy",
    models: ["claude-fable-5.1", "gpt-6-astra", "claude-opus-5"],
  },
  {
    id: "oai-anth-google-safety-0915",
    title: "OpenAI: talks with Anthropic and Google on AI safety",
    blurb:
      "15 September. OpenAI confirms multi-week engagement with Anthropic and Google DeepMind on how the labs can work together on safety, dating to Demis Hassabis's July proposal for a US-led standards body (FINRA-style). Fierce competitors under pressure after Amodei's pacing essay and Altman's agreement. The Information reported the talks earlier; CNBC confirms via OpenAI. Material step beyond CEO quote-tweets.",
    date: "2026-09-15",
    outlet: "CNBC",
    url: "https://www.cnbc.com/2026/09/15/open-ai-google-anthropic-safety.html",
    beat: "policy",
    models: ["gpt-6-astra", "claude-fable-5.1", "gemini-3.8-flash"],
  },
  {
    id: "zuck-muse-delay-0915",
    title: "Zuckerberg: evaluators over a coordinated slowdown; Meta delayed Muse",
    blurb:
      "15 September. Zuckerberg on X: engaging independent evaluators and advisors is industry best practice. Says Meta delayed shipping Muse for several months for safety and security without asking peers to wait first. Soft counter to Amodei's coordinated pacing ask while endorsing the evaluator piece. Primary coverage via Bloomberg / Business Times.",
    date: "2026-09-15",
    outlet: "Business Times / Bloomberg",
    url: "https://www.businesstimes.com.sg/startups-tech/technology/metas-zuckerberg-weighs-ai-safety-favours-evaluators-over-slowdown",
    beat: "policy",
    models: ["muse-spark-1.3", "muse-spark-1.3-max"],
  },
  {
    id: "gemini-38-live-0915",
    title: "Google: Gemini 3.8 Live and Live Extended Thinking",
    blurb:
      "15 September. Two voice/live dialogue models: 3.8 Live (scale/cost) and 3.8 Live Extended Thinking (high-complexity, speak-while-reasoning). Rolling out in Gemini API, AI Studio, Search Live, Gemini Live, and Workspace Live surfaces. Google cites AA Speech-to-Speech Quality Index 82.6 for Extended Thinking - speech harness, not Intelligence Index. It is not a 3.8 Flash board score. Primary: Google blog.",
    date: "2026-09-15",
    outlet: "Google",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/",
    beat: "release",
    models: ["gemini-3.8-flash"],
  },
  {
    id: "gpt-55-sunset-0915",
    title: "ChatGPT: GPT-5.5 leaves on 14 Oct; switch to Sol or Astra",
    blurb:
      "15 September. @ChatGPT announces GPT-5.5 leaves ChatGPT / Work / Codex on 14 October. Users pointed to GPT-5.6 Sol or GPT-6 Astra. Distribution sunset, not a new model id. High-engagement X post (~30k likes).",
    date: "2026-09-15",
    outlet: "ChatGPT / X",
    url: "https://x.com/ChatGPT/status/2099953664190300602",
    beat: "industry",
    models: ["gpt-5.6-sol", "gpt-6-astra"],
  },
  {
    id: "claude-fa-0914",
    title: "Anthropic: Claude for Financial Advisors",
    blurb:
      "14 September. Product suite of connectors and workflow skills for RIAs (meeting prep, portfolio briefs, compliance flags), not a new Fable/Opus model id. Partners include Schwab Advisor Services, BlackRock Advisor Center, Addepar, Envestnet, iCapital, Orion, Wealthbox, Wealth.com, Zocks, Vanguard. Advisor stays in the loop on regulated acts. Primary: Anthropic; also Reuters.",
    date: "2026-09-14",
    outlet: "Anthropic",
    url: "https://claude.com/blog/claude-for-financial-advisors",
    beat: "industry",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "microsoft-mai-conduct-0914",
    title: "Microsoft: provisional MAI code of conduct",
    blurb:
      "14 September. Microsoft posts provisional limits for future MAI models: no autonomous goals; no tampering with or concealing chain-of-thought / action traces; no weapons manufacturing or dangerous-substance help; human control and human-readable communication. Suleyman (CNBC): respond to feedback that AI should serve people, not replace them or create dependence. Consult outside input now; update informs training from 2027. Primary: CNBC; also Reuters. Polymarket alert. Same-day pacing-adjacent move after Amodei/Altman/Musk and Nadella welcome deliberate pacing.",
    date: "2026-09-14",
    outlet: "CNBC",
    url: "https://www.cnbc.com/2026/09/14/microsoft-ai-model-limits-anthropic-openai.html",
    beat: "policy",
    models: [],
  },
  {
    id: "anthropic-rum-compute-0914",
    title: "RUM $13.7B GPU deal reportedly Anthropic (unconfirmed)",
    blurb:
      "13-14 September. Unconfirmed: RUM Group (Rumble / Truth-linked) Aug 8-K disclosed an unnamed US cloud customer ~$13.7B six-year GPU services deal for Maysville, GA site under development (three tranches; third needs customer OK on delivery date). Reuters covered the unnamed filing 24 Aug. The Information (13 Sep) reportedly IDs Anthropic; MarketWatch notes RUM shares jumped on that report. Neither Anthropic nor RUM has confirmed the customer. The contract is real and on file with the SEC. The Anthropic identification is reported, not confirmed.",
    date: "2026-09-14",
    outlet: "MarketWatch / The Information",
    url: "https://www.marketwatch.com/story/rum-group-shares-gain-on-report-of-13-7-billion-computing-deal-with-anthropic-a35cb053",
    beat: "industry",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "latham-sovereign-ai-0913",
    title: "Latham: Nvidia servers to customize open-weight in-house",
    blurb:
      "10-13 September. FT: Latham & Watkins buys Nvidia GPU servers and fine-tunes open-weight models (incl. Nemotron 3) on-prem in a staff-only data center, first big-law public example of owning AI hardware vs routing all work through OpenAI/Anthropic/Harvey clouds. CIO Mendoza: keep ultra-sensitive client data off third-party clouds; flexibility as token costs rise. Still uses commercial tools. The takeaway: the sovereign on-prem pattern is spreading past hyperscalers into professional services; open-weight customization as the alternative stack.",
    date: "2026-09-13",
    outlet: "Financial Times",
    url: "https://www.ft.com/content/a2aaa848-92c3-4f7a-b758-5858bfb29e70",
    beat: "industry",
    models: [],
  },
  {
    id: "trump-ai-guardrails-0914",
    title: "Trump: AI guardrails = strong President; names Dario",
    blurb:
      "14 September. Truth Social @realDonaldTrump (from a screenshot; we could not find a public post URL): only AI control or \"guardrails\" needed is a \"STRONG AND SMART (High IQ!) PRESIDENT.\" Admin stopped AI people from doing bad things; names \"Dario (Anthropic!)\" pretending to be a \"perfect little angel.\" Claims tremendous criminal and regulatory power over the companies; \"SICK conspiracy\" against AI and data centers that only China likes; \"WHOEVER WINS AI, WINS!\" Leading China; beware conspiracy theorists, treasonists, traitors, leakers. A same-day counter to the Amodei pacing essay and China's fearmongering reply.",
    date: "2026-09-14",
    outlet: "Truth Social / @realDonaldTrump",
    url: "",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5", "grok-4.6", "gpt-6-astra"],
  },
  {
    id: "anthropic-dod-restrict-0914",
    title: "DoD: ~90% of classified AI workloads off Anthropic by month-end",
    blurb:
      "11-14 September. A Polymarket alert framed Nvidia, Palantir, and others restricting Anthropic as sensitive data exposure. The reporting says otherwise: Under Sec Emil Michael told DefenseScoop ~90% of classified AI workloads already transitioned, on track for end of month. Root is the usage fight: Anthropic refused unrestricted all-lawful-purposes DoD use (surveillance and autonomous-weapons safeguards); DoD designated a supply-chain risk; contractors are migrating. Nvidia-Palantir sovereign AI / Nemotron (10 Sep) is the sensitive/on-prem replacement path, not a leak story. CryptoBriefing summarizes Nvidia/Palantir/Booz Allen restricting in defense ops.",
    date: "2026-09-14",
    outlet: "DefenseScoop",
    url: "https://defensescoop.com/2026/09/11/dod-poised-to-move-all-classified-ai-workloads-off-anthropic-by-october/",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "china-pace-pushback-0914",
    title: "China MFA: US AI CEO slowdown calls are fearmongering",
    blurb:
      "14 September. MFA spokesperson Guo Jiakun rejects the Amodei/Altman/Musk pacing chorus: fearmongering, confrontation, and malicious competition disrupt global AI governance. Primary: CNBC (MFA via Reuters) and BBC. Polymarket alert.",
    date: "2026-09-14",
    outlet: "CNBC",
    url: "https://www.cnbc.com/2026/09/14/china-ai-slowdown-us-tech-ceos.html",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5", "grok-4.6", "gpt-6-astra"],
  },
  {
    id: "grok-48-ladder-0914",
    title: "Musk: Grok 4.8 is 2.5T on new C++ stack; 4.7 ≈ Opus 5",
    blurb:
      "14 September. Two X posts: 4.8 finishes training this week then RL (2.5T, new C++ stack). Later: 4.7 roughly on par with Opus 5.0 not Fable 5.1; 4.8 a noticeable step; 4.9 probably Astra/Fable class. Neither has shipped.",
    date: "2026-09-14",
    outlet: "Elon Musk / X",
    url: "https://x.com/elonmusk/status/2099308197802631191",
    beat: "rumor",
    models: ["grok-4.6"],
  },
  {
    id: "ds-pro-route-live-0914",
    title: "DeepSeek: deepseek-v4-pro now routes to V4.1-Flash",
    blurb:
      "14 September 04:00 UTC. As announced 10 Sep: requests naming deepseek-v4-pro go to V4.1-Flash at Flash rates until V4.1-Pro. Primary: DeepSeek API docs news260910.",
    date: "2026-09-14",
    outlet: "DeepSeek API Docs",
    url: "https://api-docs.deepseek.com/news/news260910",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "openai-astra-skills-0911",
    title: "OpenAI: rethink skills and AGENTS.md for GPT-6 Astra",
    blurb:
      "11 September. Dev blog: stop prompting Astra like GPT-5.6 Sol. Long skills and over-constrained AGENTS.md make Astra stop early. Define done. Primary: OpenAI Developers.",
    date: "2026-09-11",
    outlet: "OpenAI Developers",
    url: "https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra",
    beat: "labs",
    models: ["gpt-6-astra"],
  },
  {
    id: "design-arena-spark-0909",
    title: "Design Arena Website: Muse Spark 1.3 xhigh Elo 1362 #1",
    blurb:
      "9 September. Design Arena puts Spark 1.3 xhigh first overall on Website; Elo 1362, up five places from 1.2. Preference arena, not AA Index. Astra still pending on that board.",
    date: "2026-09-09",
    outlet: "Design Arena / X",
    url: "https://x.com/DesignArena/status/2097754795838951752",
    beat: "ranking",
    models: ["muse-spark-1.3"],
  },
  {
    id: "openai-ipo-delay-0912",
    title: "Altman: OpenAI IPO not in 2026; ill-advised amid safety",
    blurb:
      "12 September. Fortune interview: given safety concerns, now is an \"ill-advised moment\" to go public; not 2026. Ties to same-day pacing thread. Polymarket relayed; Fortune is primary.",
    date: "2026-09-12",
    outlet: "Fortune",
    url: "https://fortune.com/2026/09/12/sam-altman-openai-ipo-delay-ill-advised-moment-safety-concerns/",
    beat: "policy",
    models: ["gpt-6-astra"],
  },
  {
    id: "pace-frontier-0912",
    title: "Amodei: pace the frontier. Musk and Altman agree",
    blurb:
      "12 September. Essay: slow capability gains so safety/alignment/eval keep up (not a halt). Triggers: RSI since ~summer 2026; OAI-HF agent swarm. Anthropic commits to embedded evaluators now. Musk QT: \"Dario is right.\" Altman QT ~16:30 UTC: agrees on pacing; OpenAI will match independent evaluators with employee-like access.",
    date: "2026-09-12",
    outlet: "Dario Amodei",
    url: "https://darioamodei.com/post/we-must-pace-the-frontier",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5", "grok-4.6", "gpt-6-astra"],
  },
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
      "11 September ~17:22 UTC. Reply to @farzyness. Suspected RL length penalty; early give-up on hard tasks; weak self-check. Not a ship date. Grok 4.6 stays the live xAI model.",
    date: "2026-09-11",
    outlet: "Elon Musk / X",
    url: "https://x.com/elonmusk/status/2098462085973741960",
    beat: "rumor",
    models: ["grok-4.6"],
  },
  {
    id: "anthropic-threat-intel-0910",
    title: "Anthropic threat report: Alibaba, Moonshot, DeepSeek distillation",
    blurb:
      "10 September. Fourth misuse dump (Dec 2025-Aug 2026). Alibaba/Tongyi ~151M Opus CoT exchanges May-Jul; Moonshot silent Kimi→Claude relay; DeepSeek ~12.1M relays in 14 days July. API-key theft as cyber loot.",
    date: "2026-09-10",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/threat-intelligence-report-september-2026",
    beat: "policy",
    models: ["claude-opus-5", "kimi-k3", "deepseek-v4.1-flash"],
  },
  {
    id: "gpt-live-1-0910",
    title: "OpenAI: GPT-Live-1 full-duplex voice in the API",
    blurb:
      "10 September. Voice front end at $0.05/min; backend separate. Full Duplex Bench +30pp vs Realtime-2.1; Tau3 #1 with Astra medium; AA Conversational Dynamics 97.3%.",
    date: "2026-09-10",
    outlet: "OpenAI",
    url: "https://openai.com/index/introducing-gpt-live-1-in-the-api/",
    beat: "release",
    models: ["gpt-6-astra"],
  },
  {
    id: "openai-agents-api-0910",
    title: "OpenAI Agents API public beta (Codex harness as a service)",
    blurb:
      "10 September. Managed sessions, sandboxes, MCP, subagents. No extra API fee; pay tokens + tools + sandbox. Same morning as GPT-Live-1. Example model: gpt-6-astra.",
    date: "2026-09-10",
    outlet: "OpenAI",
    url: "https://openai.com/index/introducing-the-agents-api/",
    beat: "release",
    models: ["gpt-6-astra"],
  },
  {
    id: "cognition-swe-2-0910",
    title: "Cognition SWE-2: Kimi K3 post-train near Fable on cost curve",
    blurb:
      "10 September. FrontierCode 1.1 Main 50.0% vs Fable 5.1 50.9% at 64% lower cost; DeepSWE 1.1 73.0%. In Devin Desktop/CLI. Separate from AA's later Devin Fusion result on the Coding Agent Index.",
    date: "2026-09-10",
    outlet: "Cognition",
    url: "https://cognition.com/blog/swe-2",
    beat: "labs",
    models: ["kimi-k3", "claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "aa-ds-v41-flash",
    title: "AA: DeepSeek V4.1-Flash Intelligence Index 40",
    blurb:
      "Independent AA row after the 10 Sept launch. Index 40 (max) overtakes V4-Pro 36; ~4× cheaper on AA's read. Arena Elo 1503. AutomationBench-AA discussion is secondary.",
    date: "2026-09-10",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/leaderboards/models",
    beat: "ranking",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "ds-v41-flash-launch",
    title: "DeepSeek launches V4.1-Flash  -  API id deepseek-flash",
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
      "7 September. TB 2.1 → 4.0; τ³-Banking replaced by AutomationBench-AA. Live board still shows Fable 5.1 and Astra tied at 53  -  same headline, harder agent suite. Private-eval weight 45%.",
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
    title: "Jensen Huang: ‘AGI has arrived’  -  congratulates OpenAI on Astra",
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
      "Register on the Cyber Weapon Index. Mythos CWI 80; next cluster in the 40s. Trusted-access sibling to Fable 5.1  -  not a public GA row.",
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
      "89.4% on TB 2.1 vs 19.1% on TB 4.0 (Opus 5 at 51.8%). Same cliff Spark faces in expert chatter  -  shaped terminal work ≠ long-horizon agency.",
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
      "8 September board. Opus 51, Fable 5 50, Spark max 48. OpenLM AAII can still read ~57  -  Ridge cites AA.",
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
      "Fourth Spark in five months. Public xhigh is 61. Max sits behind only Fable 5.1 and Opus 5  -  and is not a general API row.",
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
      "Public Fable, trusted-access Mythos. AA already had max at 66  -  highest Index they have printed.",
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
    title: "Fable 5.1 doubles a science bench  -  and spends more tokens",
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
    title: "Gemini 3.5 Pro delay continues  -  then 3.8 Flash ships instead",
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
      "What a normal customer could actually call mid-August  -  before 5.1, 3.8, and Spark 1.3 landed.",
    date: "2026-08-14",
    outlet: "Rohit AI",
    url: "https://rohitai.com/blog/best-ai-models-2026-openai-anthropic-google-xai-deepseek",
    beat: "ranking",
    models: ["gpt-5.6-sol", "claude-fable-5", "grok-4.6"],
  },
];
