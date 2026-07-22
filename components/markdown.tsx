import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

interface Props {
  content: string;
}

export default function Markdown({ content }: Props) {
  return (
    <article
      className="
        max-w-none
        text-zinc-300
        leading-8

        [&_h1]:mb-8
        [&_h1]:text-5xl
        [&_h1]:font-black
        [&_h1]:tracking-tight
        [&_h1]:text-white

        [&_h2]:mt-14
        [&_h2]:mb-5
        [&_h2]:text-3xl
        [&_h2]:font-bold
        [&_h2]:text-green-400

        [&_h3]:mt-10
        [&_h3]:mb-4
        [&_h3]:text-2xl
        [&_h3]:font-semibold
        [&_h3]:text-white

        [&_p]:my-5
        [&_p]:text-lg
        [&_p]:leading-8

        [&_ul]:my-6
        [&_ol]:my-6

        [&_li]:my-2
        [&_li]:text-lg

        [&_strong]:font-semibold
        [&_strong]:text-green-400

        [&_blockquote]:my-8
        [&_blockquote]:rounded-xl
        [&_blockquote]:border-l-4
        [&_blockquote]:border-green-500
        [&_blockquote]:bg-green-500/5
        [&_blockquote]:px-6
        [&_blockquote]:py-4

        [&_table]:my-8
        [&_table]:w-full
        [&_table]:border-collapse

        [&_th]:border
        [&_th]:border-green-500/20
        [&_th]:bg-green-500/10
        [&_th]:p-3
        [&_th]:text-left

        [&_td]:border
        [&_td]:border-green-500/10
        [&_td]:p-3

        [&_img]:rounded-2xl
        [&_img]:shadow-2xl

        [&_hr]:my-10
        [&_hr]:border-green-500/20
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const child = children as React.ReactElement<any>;

            if (!child?.props) {
              return <pre>{children}</pre>;
            }

            const language =
              child.props.className?.replace("language-", "") ?? "text";

            console.log(child.props.children);
            const code = String(child.props.children).replace(/\n$/, "");

            return (
              <CodeBlock
                language={language}
                code={code}
              />
            );
          },

          code({ className, children }) {
            if (className) {
              return (
                <code className={className}>
                  {children}
                </code>
              );
            }

            return (
              <code
                className="
                  rounded-lg
                  border
                  border-violet-500/25

                  bg-gradient-to-r
                  from-violet-500/10
                  via-blue-500/10
                  to-violet-500/10

                  px-2.5
                  py-1

                  font-mono
                  text-[0.9rem]
                  font-medium

                  text-violet-200

                  shadow-[0_0_10px_rgba(139,92,246,.18)]

                  transition-all
                  duration-300

                  hover:border-violet-400/40
                  hover:text-white
                  hover:shadow-[0_0_18px_rgba(139,92,246,.35)]
                "
              >
                {children}
              </code>
            );
          },

          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-400 underline decoration-green-500/30 transition hover:text-green-300"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}