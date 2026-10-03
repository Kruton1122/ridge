import { Fragment } from "react";

/** Desk copy carries bare source URLs; show them as short links to the host. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
        const url = p.replace(/[.,;:]+$/, "");
        const tail = p.slice(url.length);
        let host = url;
        try {
          host = new URL(url).hostname.replace(/^www\./, "");
        } catch {
          /* keep raw */
        }
        return (
          <Fragment key={i}>
            <a className="rx-link" href={url} target="_blank" rel="noreferrer">{host}</a>
            {tail}
          </Fragment>
        );
      })}
    </>
  );
}
