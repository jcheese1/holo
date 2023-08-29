import { createPlugin, styled } from "leva/plugin";
import { useCallback } from "react";
import { useInputContext, Components } from "leva/plugin";
import { useDropzone } from "react-dropzone";
import { Data } from "leva/src/types";

export const normalize = (
  input: { onChange: (f: any) => void },
  path: string,
  data: Data
) => {
  return {
    value: input,
  };
};

export const FileContainer = styled("div", {
  position: "relative",
  display: "grid",
  columnGap: "$colGap",
  alignItems: "center",
  variants: {
    fullwidth: {
      true: {
        gridTemplateColumns: "$sizes$rowHeight auto 20px",
      },
    },
  },
});

export const DropZone = styled("div", {
  $flexCenter: "",
  overflow: "hidden",
  height: "$rowHeight",
  background: "$elevation3",
  textAlign: "center",
  color: "inherit",
  borderRadius: "$sm",
  outline: "none",
  userSelect: "none",
  cursor: "pointer",
  $inputStyle: "",
  $hover: "",
  $focusWithin: "",
  $active: "$accent1 $elevation1",
  variants: {
    isDragAccept: {
      true: {
        $inputStyle: "$accent1",
        backgroundColor: "$elevation1",
      },
    },
  },
});

export const Instructions = styled("div", {
  fontSize: "0.8em",
  height: "100%",
  padding: "$rowGap $md",
});

export const Remove = styled("div", {
  $flexCenter: "",
  top: "0",
  right: "0",
  marginRight: "$sm",
  height: "100%",
  cursor: "pointer",

  variants: {
    disabled: {
      true: { color: "$elevation3", cursor: "default" },
    },
  },

  "&::after,&::before": {
    content: '""',
    position: "absolute",
    height: 2,
    width: 10,
    borderRadius: 1,
    backgroundColor: "currentColor",
  },

  "&::after": { transform: "rotate(45deg)" },
  "&::before": { transform: "rotate(-45deg)" },
});

export function FileComponent() {
  const { label, value, onUpdate, disabled } = useInputContext<any>();

  const onDrop = useCallback(
    (acceptedFiles: string | any[]) => {
      if (acceptedFiles.length) onUpdate(acceptedFiles[0]);
    },
    [onUpdate]
  );

  const clear = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onUpdate(undefined);
    },
    [onUpdate]
  );

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop,
    disabled,
  });

  const { Label, Row } = Components;
  return (
    <Row input>
      <Label>{label}</Label>
      <FileContainer fullwidth={!!value}>
        {value && <div>{value?.name}</div>}
        {value && <Remove onClick={clear} disabled={!value} />}
        {!value && (
          <DropZone {...(getRootProps({ isDragAccept }) as any)}>
            <input {...getInputProps()} />
            <Instructions>
              {isDragAccept ? "drop file" : "click or drop"}
            </Instructions>
          </DropZone>
        )}
      </FileContainer>
    </Row>
  );
}

export const pluginFile = createPlugin({
  normalize,
  component: FileComponent,
});
