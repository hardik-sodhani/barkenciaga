import { APPEARANCE_STORAGE_KEY, THEME_STORAGE_KEY } from "@/lib/theme";

const BOOT = `(function(){try{var h=document.documentElement;var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="runway"||t==="midnight"||t==="terracotta"||t==="studio"){h.setAttribute("data-theme",t);}else{h.setAttribute("data-theme","runway");}var a=localStorage.getItem("${APPEARANCE_STORAGE_KEY}");if(a==="light"||a==="dark"){h.setAttribute("data-appearance",a);}else{h.setAttribute("data-appearance",window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");}h.style.colorScheme=h.getAttribute("data-appearance")==="dark"?"dark":"light";}catch(e){document.documentElement.setAttribute("data-theme","runway");document.documentElement.setAttribute("data-appearance","light");document.documentElement.style.colorScheme="light";}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT }} />;
}
