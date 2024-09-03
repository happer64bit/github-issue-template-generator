export default function Header() {
    return (
        <header class="bg-[#f6f8fa] border-b border-b-[#d1d9e0] dark:bg-[#010409] dark:border-b-[#3d444d] dark:text-white w-full">
            <nav class="px-4 py-4 mx-auto max-w-[1400px] flex justify-between items-center">
                <a href="/" class="font-bold">
                    Issue Template Generator
                </a>

                <a href="https://github.com/happer64bit/github-issue-template-generator" class="text-sm">Source Code</a>
            </nav>
        </header>
    )
}