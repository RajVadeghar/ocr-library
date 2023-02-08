import { useState } from "react";
import { sleep } from "../utils/sleep";

export enum Message {
  Success,
  Fail,
}

const useMessage = () => {
  const [message, setMessage] = useState<{ type: Message; msg: string } | null>(
    null
  );

  const getMessage = () => {
    if (!message) return null;

    sleep(5000)
      .then(() => setMessage(null))
      .catch(console.error);

    switch (message.type) {
      case Message.Fail: {
        return <span className="error w-full text-center">{message.msg}</span>;
      }
      case Message.Success: {
        return (
          <span className="w-full mx-auto text-center text-xs italic text-green-500">
            {message.msg}
          </span>
        );
      }
      default:
        return <></>;
    }
  };

  return { message, getMessage, setMessage };
};

export default useMessage;
