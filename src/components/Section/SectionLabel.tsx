import { css } from "@emotion/react";
import React from "react";

interface SectionLabelProps {
  text: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ text }) => {
  return (
    <div
      css={css`
        padding: 8px 18px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
      `}
    >
      {text}
    </div>
  );
};
