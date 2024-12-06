
import Image from "next/image";
import Notifications from "../components/Notifications";

export default function Home() {

  return (
<div className="grid grid-rows-[5px_1fr_10px] justify-items-stretch w-full min-h-screen p-8 pb-10 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
  <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
    <div>
    <Image
      className="dark:invert"
      src="https://cdn.verkada.com/image/upload/v1671057149/brand/verkada-logo.svg"
      alt="Verkada logo"
      width={180}
      height={38}
      priority
    />
    <p className="text-gray-600 dark:text-gray-200 ml-10 font-bold">API DEMO KIT</p>
    </div>
  <Notifications />
  </main>
  <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://apidocs.verkada.com/reference/getting-started"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src="https://nextjs.org/icons/file.svg"
        alt="File icon"
        width={16}
        height={16}
      />
      Helix Documentation
    </a>
    
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://apidocs.verkada.com/reference/example-use-cases"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src="https://nextjs.org/icons/window.svg"
        alt="Window icon"
        width={16}
        height={16}
      />
      Examples
    </a>
    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://www.verkada.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src="https://nextjs.org/icons/globe.svg"
        alt="Globe icon"
        width={16}
        height={16}
      />
      Go to verkada.com →
    </a>

    <a
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://github.com/JRVerkada/dkapi"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        aria-hidden
        src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
        alt="Github"
        width={16}
        height={16}
      />
      Source Code →
    </a>

    
  </footer>
</div>
  );
}
