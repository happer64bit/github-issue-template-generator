import { JSX } from "solid-js/jsx-runtime";
import { twMerge } from "tailwind-merge";

export default function Select(props: JSX.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} class={twMerge("px-4 py-1 dark:border-[#3d444d] dark:bg-[#23272c] text-sm rounded border outline-none focus:border-blue-500 *:text-sm *:py-1", props.class)}></select>
}