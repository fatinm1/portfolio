import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why llama.cpp is almost 9x faster than my LLM engine | Fatin Mojumder",
  description:
    "Benchmarking my from scratch C++ inference engine against llama.cpp on an Apple M4, and what I'd fix first.",
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-medium text-white mt-12 mb-4">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-white/80 leading-relaxed mb-5">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#C8FF00] text-[0.9em]">
      {children}
    </code>
  );
}

function Table({ head, rows, bold }: { head: string[]; rows: string[][]; bold?: number }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-white/10">
      <table className="w-full text-sm text-left">
        <thead className="bg-white/5 text-white">
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
              className={`border-t border-white/10 ${i === bold ? "text-[#C8FF00] font-medium" : "text-white/80"}`}
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
    <article className="max-w-3xl mx-auto px-6 pt-16 pb-8">
      <Link href="/writing" className="text-sm text-white/50 hover:text-white transition-colors">
        &larr; Writing
      </Link>

      <h1 className="text-3xl sm:text-4xl font-medium text-white mt-6 mb-4 leading-tight">
        Why llama.cpp generates text almost 9x faster than my from scratch LLM engine
      </h1>
      <p className="text-white/50 text-sm mb-10">October 2026 · Fatin Mojumder</p>

      <div className="rounded-xl border border-[#C8FF00]/30 bg-[#C8FF00]/5 p-6 mb-10">
        <p className="text-[#C8FF00] font-medium mb-3">The short version</p>
        <ul className="list-disc pl-5 space-y-2 text-white/80">
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
          className="text-[#C8FF00] hover:underline"
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
          className="text-[#C8FF00] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          llama.cpp
        </a>{" "}
        is the open source project most people use to run models locally, built and tuned by hundreds
        of contributors. My engine works, but llama.cpp is much faster. I wanted to know exactly why,
        so I measured both on my MacBook.
      </P>

      <details className="rounded-xl border border-white/10 bg-white/5 p-5 mb-5 group">
        <summary className="cursor-pointer text-white font-medium">
          A few terms used below
        </summary>
        <dl className="mt-4 space-y-3 text-white/80 text-sm">
          <div>
            <dt className="text-white font-medium">Token</dt>
            <dd>A word or piece of a word. Models read and write text one token at a time.</dd>
          </div>
          <div>
            <dt className="text-white font-medium">Prompt speed vs. generation speed</dt>
            <dd>
              Prompt speed is how fast the model reads your message. Generation speed is how fast it
              writes the reply. Both are measured in tokens per second (tok/s).
            </dd>
          </div>
          <div>
            <dt className="text-white font-medium">Quantization</dt>
            <dd>
              Storing each weight in fewer bits (here about 5 instead of 32) so the model is smaller
              and faster to read, with very little loss in quality.
            </dd>
          </div>
          <div>
            <dt className="text-white font-medium">Matrix vector product</dt>
            <dd>
              The core math step: multiplying a big grid of weights by a list of numbers. Producing
              one token takes over a hundred of these.
            </dd>
          </div>
          <div>
            <dt className="text-white font-medium">Memory bandwidth</dt>
            <dd>
              How fast data can move from memory to the processor, in GB per second. For models like
              this, it&apos;s often the real speed limit.
            </dd>
          </div>
          <div>
            <dt className="text-white font-medium">Thread</dt>
            <dd>One line of work on one processor core. More threads can use more cores at once.</dd>
          </div>
        </dl>
      </details>

      <H2>Setup</H2>
      <ul className="list-disc pl-6 space-y-2 text-white/80 mb-5">
        <li>
          <strong className="text-white">Model:</strong> Llama 3.2 1B Instruct, Q4_K_M GGUF (763 MiB
          on disk)
        </li>
        <li>
          <strong className="text-white">Machine:</strong> MacBook Air, Apple M4, 10 cores, 24 GB RAM
        </li>
        <li>
          <strong className="text-white">Tools:</strong> <Code>llm_bench</Code>, a small benchmark I
          added that times prompt processing and generation separately and records peak memory, and
          llama.cpp&apos;s <Code>llama-bench</Code> (build 11429, installed with Homebrew) on the same
          file
        </li>
        <li>
          <strong className="text-white">Settings:</strong> a 42 token prompt, 128 generated tokens,
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
        LLM Engine also peaked at <strong className="text-white">5,756 MB</strong> of memory to run a
        763 MiB file.
      </P>
      <P>
        One oddity: my prompt speed is lower than my generation speed, even though both do the same
        work per token. My guess is that macOS starts the work on an efficiency core and moves it to
        a performance core a few seconds in, but I haven&apos;t confirmed that yet.
      </P>
      <P>
        The fair comparison is the 1 thread row, since my engine does its heavy math on one thread.
        Even there, llama.cpp generates text <strong className="text-white">2.2x faster</strong> and
        reads the prompt <strong className="text-white">5.8x faster</strong>. With all its tricks
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
        <strong className="text-white">0.413 seconds per token</strong> there, and the matrix vector
        products alone, done the same way, took{" "}
        <strong className="text-white">0.41 seconds per token</strong>. So nearly all of generation
        time is those products. Attention, normalization, RoPE and sampling barely register at this
        length.
      </P>
      <P>Three design choices make those products slow:</P>
      <P>
        <strong className="text-white">1. Every weight is converted to 32 bit floats at load.</strong>{" "}
        The file stores weights in about 5 bits each. My engine expands them, so generating each token
        reads about <strong className="text-white">4.9 GB of weights instead of about 0.8 GB</strong>,
        roughly six times more data.
      </P>
      <P>
        At 12.6 tokens per second, that&apos;s about 62 GB/s coming out of memory, from a single
        thread. The M4&apos;s memory bandwidth is about 120 GB/s, so my engine is already using about
        half of it. That means adding threads alone could only roughly double the speed. The real
        limit is how many bytes each token needs.
      </P>
      <P>
        <strong className="text-white">2. The heavy math runs on one thread.</strong> I added a thread
        pool, but it only splits up the attention heads, which are tiny at this length. The matrix
        vector products run on a single core.
      </P>
      <P>
        <strong className="text-white">3. The prompt is processed one token at a time.</strong>{" "}
        llama.cpp processes the whole prompt as one matrix multiply, which is why its prompt speed is
        so far ahead even on one thread.
      </P>

      <H2>The memory surprise</H2>
      <P>
        Expanding to 32 bit floats explains the 5,756 MB. For the 1B model, the expanded weights
        alone are about 6 GB:
      </P>
      <ul className="list-disc pl-6 space-y-2 text-white/80 mb-5">
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
      <ol className="list-decimal pl-6 space-y-3 text-white/80 mb-5">
        <li>
          <strong className="text-white">Keep weights quantized</strong> and write Q4_K and Q6_K dot
          products that work directly on the packed blocks. This is the biggest win for both speed
          and memory, since the M4 run shows the engine is limited by how many bytes it reads.
        </li>
        <li>
          <strong className="text-white">Batch the prompt</strong> into one matrix multiply instead of
          one token at a time.
        </li>
        <li>
          <strong className="text-white">Split the matrix vector rows across threads</strong> with a
          persistent pool, instead of creating futures for every attention head.
        </li>
        <li>
          <strong className="text-white">Point the output layer at the embedding buffer</strong>{" "}
          instead of copying it. That&apos;s an easy 1 GB saved.
        </li>
        <li>
          <strong className="text-white">Write NEON kernels</strong> for Apple Silicon instead of
          relying on the compiler.
        </li>
        <li>
          <strong className="text-white">Precompute the RoPE sine and cosine tables</strong> instead
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

      <p className="text-white/50 text-sm mt-10 pt-6 border-t border-white/10">
        The benchmark tools are in the repo: <Code>bench/llm_bench.cpp</Code>,{" "}
        <Code>bench/matvec_bench.cpp</Code> and <Code>bench/compare.sh</Code>. Raw results are in{" "}
        <Code>bench/results/</Code>.
      </p>
    </article>
  );
}
