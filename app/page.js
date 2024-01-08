"use client";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import protocolDefinition from "../public/protocol/jornova.json";

export default function Home() {
  useEffect(() => {
    const initWeb5 = async () => {
      const { Web5 } = await import("@web5/api/browser");
      try {
        const { web5, did } = await Web5.connect({ sync: "5s" });
        if (web5 && did) {
          await configureProtocol(web5, did);
        }
      } catch (error) {
        console.error("Error initializing Web5:", error);
      }
    };
    initWeb5();
  }, []);

  const configureProtocol = async (web5, did) => {
    const { protocols, status } = await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: protocolDefinition.protocol,
        },
      },
    });

    if (status.code !== 200) {
      console.error("Error querying protocols", status);
      return;
    }

    if (protocols.length > 0) {
      return;
    }

    const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });
    const { status: configureRemoteStatus } = await protocol.send(did);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 bg-indigo-50">
      <div className="max-w-4xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <Logo className="h-7 mb-2 mx-auto" />
          <h1 className="font-bold text-2xl mb-2">
            Talk back with your journal &ndash; <span className="text-indigo-600">it listens</span>, <span className="text-amber-600">it responds</span>
          </h1>
          <p className="mb-8 text-lg text-gray-600">Transform your journaling experience with the AI-driven guide to mental wellness and personal development.</p>

          <Button className="gap-2">
            <Icon icon="ph:pen-nib-bold" className="w-4 h-4" />
            Try For Free
          </Button>
        </div>

        <div className="w-full border-2 border-dashed border-indigo-100 p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Icon icon="tabler:lock-star" className="w-6 h-6" />
              <h4 className="font-bold">Privacy & data</h4>
              <p className="text-gray-500">We use web5 tech, you own your data</p>
            </div>
            <div>
              <Icon icon="material-symbols:markdown-outline" className="w-6 h-6" />
              <h4 className="font-bold">Markdown</h4>
              <p className="text-gray-500">Write in Markdown</p>
            </div>
            <div>
              <Icon icon="uil:export" className="w-6 h-6" />
              <h4 className="font-bold">Export</h4>
              <p className="text-gray-500">Export entries as JSON with Markdown</p>
            </div>
            <div>
              <Icon icon="lucide:text" className="w-6 h-6" />
              <h4 className="font-bold">Summarized</h4>
              <p className="text-gray-500">Entries are summarized and reflected back to you</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
