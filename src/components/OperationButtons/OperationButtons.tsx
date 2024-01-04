import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import React from "react";

const ButtonWrapper: React.FC<
  React.PropsWithChildren<{
    width?: string;
  }>
> = ({ children, width }) => {
  return (
    <div
      css={css`
        width: ${width || "50%"};
        padding: 4px;
        box-sizing: border-box;
      `}
    >
      {children}
    </div>
  );
};

interface OperationButtonsProps {
  disabledCreate?: boolean;
  disabledDelete?: boolean;
  disabledDuplicate?: boolean;
  disabledMoveUp?: boolean;
  disabledMoveDown?: boolean;
  disabledRotationRight?: boolean;
  disabledRotationLeft?: boolean;
  onCreate?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRotateRight?: () => void;
  onRotateLeft?: () => void;
}

export const OperationButtons: React.FC<OperationButtonsProps> = (props) => {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        padding: 12px;
      `}
    >
      <ButtonWrapper>
        <Button
          variant="outlined"
          onClick={props.onCreate}
          fullWidth
          disabled={props.disabledCreate}
        >
          Create
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          variant="outlined"
          onClick={props.onDelete}
          fullWidth
          disabled={props.disabledDelete}
        >
          Delete
        </Button>
      </ButtonWrapper>
      <ButtonWrapper
        width={props.onMoveUp || props.onMoveDown ? "50%" : "100%"}
      >
        <Button
          variant="outlined"
          onClick={props.onDuplicate}
          fullWidth
          disabled={props.disabledDuplicate}
        >
          Duplicate
        </Button>
      </ButtonWrapper>
      {props.onMoveUp && (
        <ButtonWrapper width="25%">
          <Button
            variant="outlined"
            onClick={props.onMoveUp}
            fullWidth
            disabled={props.disabledMoveUp}
          >
            Up
          </Button>
        </ButtonWrapper>
      )}
      {props.onMoveDown && (
        <ButtonWrapper width="25%">
          <Button
            variant="outlined"
            onClick={props.onMoveDown}
            fullWidth
            disabled={props.disabledMoveDown}
          >
            Down
          </Button>
        </ButtonWrapper>
      )}
      {props.onRotateLeft && (
        <ButtonWrapper width="50%">
          <Button
            variant="outlined"
            onClick={props.onRotateLeft}
            fullWidth
            disabled={props.disabledRotationLeft}
          >
            Rotate Left
          </Button>
        </ButtonWrapper>
      )}
      {props.onRotateRight && (
        <ButtonWrapper width="50%">
          <Button
            variant="outlined"
            onClick={props.onRotateRight}
            fullWidth
            disabled={props.disabledRotationRight}
          >
            Rotate Right
          </Button>
        </ButtonWrapper>
      )}
    </div>
  );
};
