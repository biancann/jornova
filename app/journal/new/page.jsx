"use client";

import moment from "moment";
import { useChat } from "ai/react";
import Navbar from "@/components/ui/navbar";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import protocolDefinition from "../../../public/protocol/jornova.json";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat();

  const [did, setDid] = useState();
  const [web5, setWeb5] = useState();
  const [profile, setProfile] = useState();

  const [title, setTitle] = useState();
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));

  useEffect(() => {
    const initWeb5 = async () => {
      const { Web5 } = await import("@web5/api/browser");
      try {
        const { web5, did } = await Web5.connect({ sync: "5s" });
        setDid(did);
        setWeb5(web5);
      } catch (error) {
        console.error("Error initializing Web5:", error);
      }
    };
    initWeb5();
  }, []);

  useEffect(() => {
    if (profile) {
      setMessages([
        {
          id: 1,
          role: "system",
          content:
            `You are a smart assistant that helps users to journal in more depth\n\n#User Data: I'm ${profile?.age}, ${profile?.gender}, and ${profile?.relationship}. I am ${profile?.religion}. My goal is ${profile?.goal}.\n#Rules: - Use ${profile?.support} to guide responses. Prioritize evidence-based reasoning. Cite your sources inline, not at the end.\n- Answer briefly and concisely (20-50 words)\n- You can ask more questions to get deeper context\n- Before asking, give possible solutions that you know about (only if there are any)`,
        },
        { id: 2, role: "assistant", content: "What's on your mind?" },
      ]);
    }
  }, [profile]);

  useEffect(() => {
    if (!did || !web5) return;
    const getProfile = async () => {
      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.profile.schema,
            dataFormat: "application/json",
          },
        },
      });
      for (let record of records) {
        const data = await record.data.json();
        setProfile({ id: record.id, ...data });
      }
    };
    getProfile();
  }, [did, web5]);

  const submiEntry = async () => {
    
  }

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4">
        <div className="w-full bg-white shadow mt-12 rounded-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Link href="/home">
                <Icon icon="uil:arrow-left" className="w-6 h-6" />
              </Link>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled" className="w-full focus:outline-0 text-lg font-bold" />
            </div>
            <div className="flex-shrink">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-[6.5rem] focus:outline-0 text-sm font-medium text-gray-500" />
            </div>
          </div>
          <div className="p-4">
            <ul className="font-medium space-y-2">
              {messages
                .filter((o) => o.role !== "system")
                .map((m, index) => (
                  <li key={index} className={`${m.role === "assistant" && "text-indigo-500"}`}>
                    {m.content}
                  </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit}>
              <textarea
                type="text"
                placeholder="Write here..."
                className="pr-4 py-3 w-full focus:outline-0"
                value={input}
                onChange={handleInputChange}
              ></textarea>

              <div className="flex items-center justify-between border-t mt-12">
                <Button type="submit" className="mt-4 bg-indigo-500 hover:bg-indigo-600 gap-1">
                  <Icon icon="ph:diamonds-four-bold" className="w-4 h-4" />
                  Go deeper
                </Button>
                <Button type="button" onClick={() => submiEntry()} className="mt-4 gap-1">
                  <Icon icon="ph:check-bold" className="w-4 h-4" />
                  Finish Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}