"use client";

import moment from "moment";
import Navbar from "@/components/ui/navbar";
import { useEffect, useState } from "react";
import protocolDefinition from "../../public/protocol/jornova.json";
import { getMood } from "@/lib/utils";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  const [did, setDid] = useState();
  const [web5, setWeb5] = useState();
  const [journals, setJournals] = useState([]);
  const [journal, setJournal] = useState();

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
      setJournal(entries[0] ?? null);
    };
    getJournals();
  }, [did, web5]);

  console.log(journal);

  return (
    <>
      <Navbar />

      <div className="h-[calc(100vh_-_3.5rem)] py-6">
        <div className="max-w-6xl mx-auto px-4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-6">
            <div>
              <div className="divide-y bg-white rounded-lg shadow">
                {journals.map((i, idx) => (
                  <button
                    key={i.id}
                    onClick={() => setJournal(i)}
                    className={`${i?.id === journal?.id ? "bg-indigo-100" : "bg-white hover:bg-gray-50"} w-full p-2.5 flex items-center gap-3 text-left ${
                      idx === 0 && "rounded-t-lg"
                    } ${idx === journals.length - 1 && "rounded-b-lg"}`}
                  >
                    <div className="shrink-0 w-6 uppercase text-gray-400 text-xs text-right">{moment(i.date).format("MM/DD")}</div>
                    <h6 className="flex-1 truncate">{i.title}</h6>
                  </button>
                ))}
              </div>
            </div>
            {journal ? (
              <div className="md:col-span-2 bg-white rounded-lg shadow">
                <div className="p-4 md:p-6 border-b">
                  <h2 className="font-bold text-2xl mb-1">{journal.title}</h2>
                  <p className="text-gray-500">{moment(journal.date).format("dddd, MMMM Do YYYY")}</p>
                </div>

                <div className="relative p-4 md:p-6 border-b">
                  <div className="absolute -top-4 bg-indigo-500 text-white inline-flex px-2 py-1 rounded text-sm font-medium">
                    <p>{getMood(journal.mood)}</p>
                  </div>
                  <div className="border p-3 text-sm bg-indigo-50 text-gray-700 rounded-md"><strong>Reflection:</strong> {journal?.reflection}</div>
                </div>

                <div className={`p-4 md:p-6 ${inter.className}`}>
                  <div className="space-y-2">
                    {journal.messages.map((i, idx) => (
                      <p key={idx} className={`${i.role === "user" ? "text-gray-800" : "text-indigo-400"}`}>
                        {i.content}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 bg-white rounded-lg shadow p-4"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
