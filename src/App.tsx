import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import "./index.css";
import GeneratedContent from "./components/GeneratedContent";
import useMessage from "./hooks/useMessage";

export type IState = {
  lines: string[];
  image: string | null;
  loading: boolean;
};

const App: React.FC = () => {
  const [state, setState] = useState<IState>({
    lines: [],
    image: null,
    loading: false,
  });

  return (
    <div className="bg-gray-900 min-h-screen text-white flex items-center py-28 flex-col gap-2">
      <input
        className="cursor-pointer text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-violet-50 file:text-violet-700
        hover:file:bg-violet-100 h-fit p-3 focus:outline-none"
        type="file"
        name="image"
        onChange={(e) => {
          if (!e.target.files) {
            return;
          }
          if (e.target.files.length === 0) {
            alert("Please select a file");
            return;
          }

          setState({ lines: [], image: null, loading: true });

          const image = e.target.files[0];

          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onloadend = () => {
            const image = reader.result as string;

            setState({ ...state, image });

            Tesseract.recognize(image)
              .then((result) => {
                setState({
                  image,
                  lines: result.data.lines.map((line) => line.text),
                  loading: false,
                });
              })
              .catch((err) => {
                console.error(err);
                setState({ image: null, lines: [], loading: false });
              });
          };
        }}
      />

      {state.loading && <p>Loading...</p>}

      {state.lines.length > 0 && <GeneratedContent state={state} />}
    </div>
  );
};

export default App;
