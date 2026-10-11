import type { Metadata } from "next";
import Link from "next/link";
import SilkBackground from "@/components/SilkBackground";

const POST_TITLE = "Why llama.cpp is almost 9x faster than my LLM engine";
const POST_DESCRIPTION =
  "Benchmarking my from scratch C++ inference engine against llama.cpp on an Apple M4, and what I'd fix first.";

export const metadata: Metadata = {
  title: POST_TITLE,
  description: POST_DESCRIPTION,
  openGraph: {
    type: "article",
    url: "/writing/llm-engine-benchmark",
    title: POST_TITLE,
    description: POST_DESCRIPTION,
    // A page-level openGraph replaces the inherited one, so re-add the site share image.
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Fatin Mojumder" }],
  },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-14 mb-4 text-[22px] font-semibold tracking-[-0.02em] text-foreground">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 leading-[1.75] text-foreground/80">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-white/[.04] px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
      {children}
    </code>
  );
}

function Table({ head, rows, bold }: { head: string[]; rows: string[][]; bold?: number }) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-sm text-left">
        <thead className="bg-white/[.03] text-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className={`border-t border-border ${i === bold ? "font-medium text-accent" : "text-foreground/80"}`}
            >
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LlmEngineBenchmarkPost() {
  return (
    <>
      <SilkBackground />
      <article className="relative mx-auto w-full max-w-[768px] px-6 pt-20">
        <Link href="/writing" className="font-mono text-xs text-muted hover:text-foreground">
          &larr; Writing
        </Link>

        <h1 className="mb-4 mt-6 text-[clamp(30px,4.5vw,42px)] font-semibold leading-[1.15] tracking-[-0.035em] text-foreground">
          Why llama.cpp generates text almost 9x faster than my from scratch LLM engine
        </h1>
        <p className="mb-10 font-mono text-xs text-faint">October 2026 · Fatin Mojumder</p>

        <div className="mb-10 rounded-2xl border border-[#2f3a10] bg-accent/[.04] p-6">
          <p className="mb-3 font-medium text-accent">The short version</p>
          <ul className="list-disc space-y-2 pl-5 text-foreground/80 marker:text-faint">
            <li>
              I wrote my own program for running an AI language model on a laptop, then raced it
              against llama.cpp, the most widely used open source tool for the same job.
            </li>
            <li>
              Mine wrote 12.6 tokens per second (a token is roughly a word). llama.cpp managed 27.5 on
              a single CPU core, and 109 using the laptop&apos;s GPU.
            </li>
            <li>
              The main reason: my engine unpacks the model into a format six times larger, so it moves
              far more data through memory for every word. In my tests, the fixes roughly doubled to
              quadrupled its speed.
            </li>
          </ul>
        </div>

        <H2>Some background</H2>
        <P>
          Chat assistants like ChatGPT run on large language models. A model is mostly a huge list of
          numbers (its &quot;weights&quot;), and producing each word means doing math with all of them.
          Usually that happens on big servers, but smaller models can run directly on a laptop, with no
          internet and no API key.
        </P>
        <P>
          I built{" "}
          <a
            href="https://github.com/fatinm1/LLM-Engine"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            LLM Engine
          </a>{" "}
          to learn how that works from the ground up. It&apos;s a C++ program that loads Meta&apos;s
          Llama 3.2 model and chats with it on a regular CPU, and I wrote every part myself: reading the
          model file, splitting text into tokens, the math for each layer of the model, and picking the
          next word. No machine learning libraries.
        </P>
        <P>
          <a
            href="https://github.com/ggml-org/llama.cpp"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            llama.cpp
          </a>{" "}
          is the open source project most people use to run models locally, built and tuned by hundreds
          of contributors. My engine works, but llama.cpp is much faster. I wanted to know exactly why,
          so I measured both on my MacBook.
        </P>

        <details className="group mb-5 rounded-2xl border border-border bg-white/[.02] p-5">
          <summary className="cursor-pointer font-medium text-foreground">
            A few terms used below
          </summary>
          <dl className="mt-4 space-y-3 text-sm leading-[1.7] text-foreground/80">
            <div>
              <dt className="font-medium text-foreground">Token</dt>
              <dd>A word or piece of a word. Models read and write text one token at a time.</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Prompt speed vs. generation speed</dt>
              <dd>
                Prompt speed is how fast the model reads your message. Generation speed is how fast it
                writes the reply. Both are measured in tokens per second (tok/s).
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Quantization</dt>
              <dd>
                Storing each weight in fewer bits (here about 5 instead of 32) so the model is smaller
                and faster to read, with very little loss in quality.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Matrix vector product</dt>
              <dd>
                The core math step: multiplying a big grid of weights by a list of numbers. Producing
                one token takes over a hundred of these.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Memory bandwidth</dt>
              <dd>
                How fast data can move from memory to the processor, in GB per second. For models like
                this, it&apos;s often the real speed limit.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Thread</dt>
              <dd>One line of work on one processor core. More threads can use more cores at once.</dd>
            </div>
          </dl>
        </details>

        <H2>Setup</H2>
        <ul className="mb-5 list-disc space-y-2 pl-6 leading-[1.75] text-foreground/80 marker:text-faint">
          <li>
            <strong className="text-foreground">Model:</strong> Llama 3.2 1B Instruct, Q4_K_M GGUF (763 MiB
            on disk)
          </li>
          <li>
            <strong className="text-foreground">Machine:</strong> MacBook Air, Apple M4, 10 cores, 24 GB RAM
          </li>
          <li>
            <strong className="text-foreground">Tools:</strong> <Code>llm_bench</Code>, a small benchmark I
            added that times prompt processing and generation separately and records peak memory, and
            llama.cpp&apos;s <Code>llama-bench</Code> (build 11429, installed with Homebrew) on the same
            file
          </li>
          <li>
            <strong className="text-foreground">Settings:</strong> a 42 token prompt, 128 generated tokens,
            greedy decoding, 3 runs each
          </li>
        </ul>
        <P>
          One thing I found right away: the tokens per second number my app showed included the time
          spent reading the prompt. With a short reply, that made generation look slower than it is.{" "}
          <Code>llm_bench</Code> reports the two separately.
        </P>

        <H2>Results</H2>
        <Table
          head={["engine", "prompt tok/s", "generation tok/s"]}
          bold={0}
          rows={[
            ["LLM Engine (mine)", "8.7", "12.6"],
            ["llama.cpp, CPU, 1 thread", "50.6", "27.5"],
            ["llama.cpp, CPU, 4 threads", "164.9", "73.1"],
            ["llama.cpp, GPU (Metal)", "839.2", "109.2"],
          ]}
        />
        <P>
          LLM Engine also peaked at <strong className="text-foreground">5,756 MB</strong> of memory to run a
          763 MiB file.
        </P>
        <P>
          One oddity: my prompt speed is lower than my generation speed, even though both do the same
          work per token. My guess is that macOS starts the work on an efficiency core and moves it to
          a performance core a few seconds in, but I haven&apos;t confirmed that yet.
        </P>
        <P>
          The fair comparison is the 1 thread row, since my engine does its heavy math on one thread.
          Even there, llama.cpp generates text <strong className="text-foreground">2.2x faster</strong> and
          reads the prompt <strong className="text-foreground">5.8x faster</strong>. With all its tricks
          turned on, it&apos;s 8.6x faster at generating and almost 100x faster at reading the prompt.
        </P>

        <H2>Where the time goes</H2>
        <P>
          Generating one token is mostly matrix vector products: each of the 16 layers multiplies the
          hidden state by seven weight matrices, and then a final 128,256 by 2,048 matrix turns it
          into a score for every token in the vocabulary.
        </P>
        <P>
          To check how much of the time that accounts for, I also ran the engine on a Linux machine
          (2 vCPU Xeon) with random weights in Llama 3.2 1B&apos;s exact shapes. The full engine took{" "}
          <strong className="text-foreground">0.413 seconds per token</strong> there, and the matrix vector
          products alone, done the same way, took{" "}
          <strong className="text-foreground">0.41 seconds per token</strong>. So nearly all of generation
          time is those products. Attention, normalization, RoPE and sampling barely register at this
          length.
        </P>
        <P>Three design choices make those products slow:</P>
        <P>
          <strong className="text-foreground">1. Every weight is converted to 32 bit floats at load.</strong>{" "}
          The file stores weights in about 5 bits each. My engine expands them, so generating each token
          reads about <strong className="text-foreground">4.9 GB of weights instead of about 0.8 GB</strong>,
          roughly six times more data.
        </P>
        <P>
          At 12.6 tokens per second, that&apos;s about 62 GB/s coming out of memory, from a single
          thread. The M4&apos;s memory bandwidth is about 120 GB/s, so my engine is already using about
          half of it. That means adding threads alone could only roughly double the speed. The real
          limit is how many bytes each token needs.
        </P>
        <P>
          <strong className="text-foreground">2. The heavy math runs on one thread.</strong> I added a thread
          pool, but it only splits up the attention heads, which are tiny at this length. The matrix
          vector products run on a single core.
        </P>
        <P>
          <strong className="text-foreground">3. The prompt is processed one token at a time.</strong>{" "}
          llama.cpp processes the whole prompt as one matrix multiply, which is why its prompt speed is
          so far ahead even on one thread.
        </P>

        <H2>The memory surprise</H2>
        <P>
          Expanding to 32 bit floats explains the 5,756 MB. For the 1B model, the expanded weights
          alone are about 6 GB:
        </P>
        <ul className="mb-5 list-disc space-y-2 pl-6 leading-[1.75] text-foreground/80 marker:text-faint">
          <li>3.9 GB for the 16 layers</li>
          <li>1.05 GB for the token embeddings</li>
          <li>
            another 1.05 GB because the output layer shares its weights with the embeddings, but my
            code copies that buffer instead of pointing to it
          </li>
        </ul>
        <P>
          My README said &quot;~1.2 GB.&quot; The real number is almost five times that. llama.cpp keeps
          weights quantized and memory maps the file, so it stays close to the file size.
        </P>

        <H2>What fixing it could look like</H2>
        <P>
          On the Linux machine, I benchmarked the matrix vector products four ways (median of 3 runs,
          matrix math only):
        </P>
        <Table
          head={["variant", "tok/s", "weight data read per token"]}
          rows={[
            ["current: 32 bit floats, 1 thread", "2.4", "4.94 GB"],
            ["32 bit floats, 2 threads", "4.9", "4.94 GB"],
            ["keep weights in 8 bit (Q8_0), 1 thread", "5.7", "1.39 GB"],
            ["8 bit and 2 threads", "10.6", "1.39 GB"],
          ]}
        />
        <P>
          Keeping weights quantized and quantizing the activations to 8 bits before each product,
          which is what llama.cpp does, gave about a 2.3x speedup on one thread, with results within
          0.8% of the 32 bit version. Adding threads on top nearly doubled it again.
        </P>

        <H2>What I&apos;d change, in order</H2>
        <ol className="mb-5 list-decimal space-y-3 pl-6 leading-[1.75] text-foreground/80 marker:text-faint">
          <li>
            <strong className="text-foreground">Keep weights quantized</strong> and write Q4_K and Q6_K dot
            products that work directly on the packed blocks. This is the biggest win for both speed
            and memory, since the M4 run shows the engine is limited by how many bytes it reads.
          </li>
          <li>
            <strong className="text-foreground">Batch the prompt</strong> into one matrix multiply instead of
            one token at a time.
          </li>
          <li>
            <strong className="text-foreground">Split the matrix vector rows across threads</strong> with a
            persistent pool, instead of creating futures for every attention head.
          </li>
          <li>
            <strong className="text-foreground">Point the output layer at the embedding buffer</strong>{" "}
            instead of copying it. That&apos;s an easy 1 GB saved.
          </li>
          <li>
            <strong className="text-foreground">Write NEON kernels</strong> for Apple Silicon instead of
            relying on the compiler.
          </li>
          <li>
            <strong className="text-foreground">Precompute the RoPE sine and cosine tables</strong> instead
            of calling <Code>pow</Code>, <Code>sin</Code> and <Code>cos</Code> for every token.
          </li>
        </ol>

        <H2>What I learned</H2>
        <P>
          The math in a transformer is the easy part. The speed comes from how you move bytes: keeping
          weights small, keeping every core busy, and not copying what you can share. Measuring first
          also kept me honest. My README had a memory number that was off by almost five times, and I
          wouldn&apos;t have caught it without checking.
        </P>

        <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
          The benchmark tools are in the repo: <Code>bench/llm_bench.cpp</Code>,{" "}
          <Code>bench/matvec_bench.cpp</Code> and <Code>bench/compare.sh</Code>. Raw results are in{" "}
          <Code>bench/results/</Code>.
        </p>
      </article>
    </>
  );
}
