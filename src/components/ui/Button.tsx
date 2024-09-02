import { cva } from "class-variance-authority";
import { JSX } from "solid-js/jsx-runtime";
import { twMerge } from "tailwind-merge";

const button = cva("px-4 py-1 rounded text-sm", {
    variants: {
        variety: {
            primary: "bg-[#238636] border border-[#ffffff1a] text-white",
            secondary: "bg-gray-100 border border-gray-200 dark:bg-slate-100/10 dark:border-zinc-700 hover:dark:bg-slate-100/20 hover:bg-gray-200"
        }
    },
    defaultVariants: {
        variety: "primary",
    },
})

export default function Button(props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & { variety: "primary" | "secondary" }) {
    return <button {...props} class={twMerge(button({ variety: props.variety, class: props.class }))}>{props.children}</button>
}