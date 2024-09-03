import { Component, createEffect } from "solid-js";
import Prism from "prismjs";
import '@jongwooo/prism-theme-github/themes/prism-github-default-auto.min.css';

import "prismjs/components/prism-yaml";

// Define the types for props
interface CodeBlockProps {
  code: string;
}

const CodeBlock: Component<CodeBlockProps> = (props) => {
  let codeElement: HTMLPreElement | undefined;

  createEffect(() => {
    if (codeElement) {
      Prism.highlightElement(codeElement);
    }
  });

  return (
    <pre>
      <code ref={(el) => codeElement = el as HTMLPreElement} class={"language-yaml rounded-lg"}>
        {props.code}
      </code>
    </pre>
  );
};

export default CodeBlock;
