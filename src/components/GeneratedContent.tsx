import { IState } from "../App";
import { BiFullscreen } from "react-icons/bi";
import useMessage, { Message } from "../hooks/useMessage";

enum Button {
  Download,
  Copy,
  OpenInAi,
}

function GeneratedContent({ state }: { state: IState }) {
  const { message, setMessage, getMessage } = useMessage();

  const dataURLToBlob = (dataURL: string) => {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; i++) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const handleButton = (type: Button) => {
    const data = `${state.lines.join("\n").trim()}`;
    switch (type) {
      case Button.Download: {
        const file = new Blob([data], { type: "text/plain" });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.download = "recognized-text.txt";
        link.href = url;
        link.click();
        document.removeChild(link);
        return;
      }
      case Button.Copy: {
        navigator.clipboard.writeText(data);
        setMessage({
          type: Message.Success,
          msg: "Copied content successfully",
        });
        return;
      }
      case Button.OpenInAi: {
        window.open(
          `https://openai.com/chat/#?query=${encodeURIComponent(data)}`
        );
        return;
      }
      default:
        return;
    }
  };

  return (
    <div className="max-w-2xl flex items-center justify-center flex-col gap-10">
      {state.image !== null && (
        <div className="relative w-[70%]">
          <BiFullscreen
            onClick={() => {
              const blob = dataURLToBlob(state.image || "");
              const blobUrl = URL.createObjectURL(blob);
              window.open(blobUrl, "_blank");
            }}
            className="absolute top-3 right-3 cursor-pointer h-5 w-5"
          />
          <img
            className="w-full rounded-xl object-contain"
            src={state.image}
            alt=""
          />
        </div>
      )}

      <ul>
        {state.lines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      {message && getMessage()}

      <div className="flex gap-5">
        <button
          className="border border-violet-600 rounded-lg p-1 px-4 hover:bg-violet-600 transition-all active:bg-violet-400"
          onClick={() => handleButton(Button.Download)}
        >
          Download as file
        </button>
        <button
          className="border border-violet-600 rounded-lg p-1 px-4 hover:bg-violet-600 transition-all active:bg-violet-400"
          onClick={() => handleButton(Button.Copy)}
        >
          Copy
        </button>

        <button
          className="border border-violet-600 rounded-lg p-1 px-4 hover:bg-violet-600 transition-all active:bg-violet-400"
          onClick={() => handleButton(Button.OpenInAi)}
        >
          Open in chat GPT
        </button>
      </div>
    </div>
  );
}

export default GeneratedContent;
