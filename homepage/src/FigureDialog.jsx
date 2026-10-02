import React, { useEffect, useRef } from "react";
import { X, ArrowUpRight } from "@phosphor-icons/react";

export default function FigureDialog({ paper, lang, c, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!paper) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, [paper]);
  if (!paper?.figure) return null;
  const figure = paper.figure;
  return (
    <dialog
      ref={dialogRef}
      className="figure-dialog"
      aria-labelledby="figure-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="figure-dialog-content">
        <header className="figure-dialog-header">
          <div>
            <p className="eyebrow">
              {c.figureSource} · {figure.label}
            </p>
            <h2 id="figure-title">{paper.title}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label={c.closeFigure} autoFocus>
            <X size={22} aria-hidden="true" />
          </button>
        </header>
        <div className="figure-dialog-image">
          <img src={`./images/papers/${figure.file}`} alt={figure.alt[lang]} width={figure.width} height={figure.height} />
        </div>
        <footer>
          <p>{figure.caption[lang]}</p>
          <a href={figure.source || paper.url} target="_blank" rel="noopener noreferrer">
            {c.figureSource}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </dialog>
  );
}
