import React from "react";
import mergeRefs from "./merge-refs";
import useResizeObserver from "use-resize-observer";

// type Props = {
//   children: (dimens: { width: number; height: number }) => ReactElement;
// };

const style = {
  flex: 1,
  width: "100%",
  height: "100%",
  // height: "500px",
  minHeight: 0,
  minWidth: 0,
};

export const FillFlexParent = React.forwardRef(function FillFlexParent(
  // props: Props,
  width, height,
  // forwardRef
) {
  const { ref, width, height } = useResizeObserver();
  return (
    <div style={style} ref={mergeRefs(ref)}>
      {width && height ? (width, height) : null}
    </div>
  );
});