declare module "rich-textarea" {
  import {
    ForwardRefExoticComponent,
    RefAttributes,
    TextareaHTMLAttributes,
    CSSProperties,
    ReactNode,
  } from "react";

  export interface HighlightProps {
    start: number;
    end: number;
    style?: CSSProperties;
    className?: string;
    key?: string;
  }

  export interface RichTextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    highlights?: HighlightProps[];
    children?: ReactNode | ((value: string) => ReactNode);
  }

  export const RichTextarea: ForwardRefExoticComponent<
    RichTextareaProps & RefAttributes<HTMLTextAreaElement>
  >;
}
