import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Mainpage() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const wsRef = useRef(null);
  const messageEndRef = useRef(null);
  const {name,roomId}=location.state || {}

  // Establish WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:6060");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const receivedMessage = {
        text: event.data,
        type: "received", // Mark it as a received message
      };
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            name:name,
            roomId: roomId,
          },
        })
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const onSend = () => {
    if (inputValue.trim()) {
      const sentMessage = {
        text: inputValue,
        type: "sent", // Mark it as a sent message
      };
      setMessages((prevMessages) => [...prevMessages, sentMessage]);

      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            name:name,
            message: inputValue
          },
        })
      );
      setInputValue(""); // Clear input field after sending
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center mx-4 my-4 md:mx-32 lg:mx-64 xl:mx-72 2xl:mx-96 ">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Chat Application</CardTitle>
          <CardDescription>Get in touch in one click</CardDescription>
          <CardDescription>Room ID :{roomId}  Name:{name}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Messages Display */}
          <div className="h-[60vh] overflow-y-scroll border p-2 rounded-lg bg-gray-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.type === "sent" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`inline-block px-3 mt-2 py-2 rounded-xl ${
                    msg.type === "sent"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.text}
               
                </span>
                
               
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Input and Send Button */}
          <div className="flex border-4 rounded-xl p-2 bg-gray-100 gap-6 sm:p-6 mt-4">
            <div className="flex w-full">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                id="text"
                type="text"
                placeholder="Type something..."
                required
                className="border bg-white rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={onSend} className="hover:bg-zinc-600">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Mainpage;
