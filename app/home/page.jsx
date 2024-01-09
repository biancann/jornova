"use client";

import moment from "moment";
import Navbar from "@/components/ui/navbar";
import { useEffect, useState } from "react";
import protocolDefinition from "../../public/protocol/jornova.json";
import { getMood } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Page() {
  const [did, setDid] = useState();
  const [web5, setWeb5] = useState();
  const [currentMood, setCurrentMood] = useState();
  const [sevenMood, setSevenMood] = useState();
  const [journals, setJournals] = useState([]);

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
    if (!did || !web5) return;
    const getJournals = async () => {
      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.journal.schema,
            dataFormat: "application/json",
          },
        },
      });

      const entries = [];
      for (let record of records) {
        const data = await record.data.json();
        entries.push({ id: record.id, ...data });
      }
      setJournals(
        entries.sort((a, b) => {
          let da = new Date(a.date),
            db = new Date(b.date);
          return db - da;
        })
      );
    };
    getJournals();
  }, [did, web5]);

  useEffect(() => {
    if (journals.length > 0) {
      setCurrentMood(
        journals
          .filter((o) => o.date === moment().format("YYYY-MM-DD"))
          .map((o) => o.mood)
          .filter((val, idx, self) => self.indexOf(val) === idx)
      );

      const moods7 = [];
      for (let i = 0; i < 7; i++) {
        moods7.push(journals[i]?.mood);
      }
      setSevenMood(moods7);
    }
  }, [journals]);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 h-full my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="w-full rounded-lg bg-white shadow p-4 border-b-2 border-indigo-500">
            <h4 className="font-bold text-2xl mb-1">{journals.length}</h4>
            <p className="text-gray-500">Total Journal</p>
          </div>
          <div className="w-full rounded-lg bg-white shadow p-4 border-b-2 border-indigo-500">
            <div className="font-bold text-xl flex items-center gap-2">
              {currentMood?.map((i, idx) => (
                <TooltipProvider key={idx} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="p-1 bg-gradient-to-t from-indigo-100 rounded-full hover:scale-110 transition-all">{getMood(i, false)}</div>
                    </TooltipTrigger>
                    <TooltipContent>{i}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <p className="text-gray-500">Current Mood</p>
          </div>
          <div className="w-full rounded-lg bg-white shadow p-4 border-b-2 border-indigo-500">
            <div className="font-bold text-xl flex items-center gap-2">
              {sevenMood?.map((i, idx) => (
                <TooltipProvider key={idx} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="p-1 bg-gradient-to-t from-indigo-100 rounded-full hover:scale-110 transition-all">{getMood(i, false)}</div>
                    </TooltipTrigger>
                    <TooltipContent>{i}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <p className="text-gray-500">Last 7 Journal</p>
          </div>
        </div>
      </div>
    </>
  );
}
