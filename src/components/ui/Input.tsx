import { JSX } from "solid-js/jsx-runtime";
import { twMerge } from 'tailwind-merge'

export default function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input {...props} class={twMerge("p-[5px_12px] text-[14px] dark:text-[#f0f6fc] border dark:border-[#3d444d] rounded dark:bg-[#151b23]/20 bg-[#f6f8fa] border-[#d1d9e0] transform duration-100 focus:bg-transparent outline-blue-500", props.class)}/> 
    )
}