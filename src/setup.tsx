import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

function SetUp() {
  const [isRoomCodeVisible, setIsRoomCodeVisible] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  // Generate a random room code
  function createNewRoom() {
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(generatedCode);
    setIsRoomCodeVisible(true);
    toast("Room Created!", {
      description: `Share this room code: ${generatedCode}`,
    });
  }

  // Handle joining a room
  function joinRoom() {
    if (!name || !roomId) {
      toast.error("Name and Room Code are required!");
      return;
    }
    navigate("/chat", {
      state: { name, roomId },
    });
  }

  return (
    <div className="flex flex-col h-screen justify-center mx-4 my-4 md:mx-32 lg:mx-64 xl:mx-72 2xl:mx-96">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Real Time Chat</CardTitle>
          <CardDescription>Get In Touch With Click</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">
            <Button onClick={createNewRoom} className="p-6 text-lg">
              Create New Room
            </Button>
            <Input
              className="p-6 border-2 text-lg"
              id="Name"
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="flex justify-between gap-3">
              <Input
                className="p-6 border-2 text-lg"
                id="roomid"
                type="text"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
              <Toaster />
              <Button
                className="p-6 bg-black text-white"
                variant="outline"
                onClick={joinRoom}
              >
                Join Room
              </Button>
            </div>

            {isRoomCodeVisible && (
              <div className="bg-gray-200 h-32 rounded-xl flex flex-col justify-center items-center">
                <CardDescription className="text-lg">
                  Share this code with your friend
                </CardDescription>
                <p className="text-xl font-bold mt-2">{roomCode}</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard
                        .writeText(roomCode)
                        .then(() => toast.success("Room code copied to clipboard!"))
                        .catch(() => toast.error("Failed to copy room code."));
                    } else {
                      toast.error("Clipboard API not supported by your browser.");
                    }
                  }}
                >
                  Copy Room Code
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SetUp;
