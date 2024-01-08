"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import protocolDefinition from "../../public/protocol/jornova.json";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: 1,
    tag: "goal",
    question: "Empowering your journey to a fulfilling life through self-reflection is our mission. What is your primary goal for journaling?",
    options: [
      "Receiving emotional support",
      "Improving my mental health",
      "Reflecting on daily life",
      "Boosting cognitive function",
      "Understanding myself better",
      "Just curious",
    ],
  },
  {
    id: 2,
    tag: "age",
    question: "How many years young are you?",
    options: ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"],
  },
  {
    id: 3,
    tag: "gender",
    question: "How do you identify?",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"],
  },
  {
    id: 4,
    tag: "relationship",
    question: "What's your relationship status?",
    options: ["Single", "In a relationship", "Married", "Divorced", "Widowed", "Prefer not to say"],
  },
  {
    id: 5,
    tag: "religion",
    question: "What is your faith or spiritual orientation?",
    options: ["Buddhist", "Christian", "Hindu", "Jewish", "Muslim", "Spiritual, but not religious", "Prefer not to answer"],
  },
  {
    id: 6,
    tag: "support",
    question: "What style of support best suits you?",
    options: [
      "Candid & direct",
      "Practical & solution-oriented",
      "Analytical & fact-based",
      "Empathic & understanding",
      "Spiritual & mindful",
      "Motivational & encouraging",
    ],
  },
];
export default function Page() {
  const router = useRouter();
  const [did, setDid] = useState();
  const [web5, setWeb5] = useState();
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState();
  const [profile, setProfile] = useState({});

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
    const getProfile = async () => {
      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.profile.schema,
            dataFormat: "application/json",
          },
        },
      });

      if (records.length > 0) {
        return router.push("/home");
      }
    };
    getProfile();
  }, [did, web5]);

  useEffect(() => {
    setQuestion(questions.find((o) => o.id === step) || null);
  }, [step]);

  const answer = (a) => {
    const theProfile = { ...profile };
    if (question.tag === "goal") {
      setProfile({ ...theProfile, goal: a });
    }
    if (question.tag === "age") {
      setProfile({ ...theProfile, age: a });
    }
    if (question.tag === "gender") {
      setProfile({ ...theProfile, gender: a });
    }
    if (question.tag === "relationship") {
      setProfile({ ...theProfile, relationship: a });
    }
    if (question.tag === "religion") {
      setProfile({ ...theProfile, religion: a });
    }
    if (question.tag === "support") {
      setProfile({ ...theProfile, support: a });
    }

    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 500);
  };

  const startOver = () => {
    setProfile({});
    setStep(1);
  };

  const save = async () => {
    const { record } = await web5.dwn.records.create({
      data: { ...profile, "@type": "profile", author: did },
      message: {
        protocolPath: "profile",
        protocol: protocolDefinition.protocol,
        schema: protocolDefinition.types.profile.schema,
        dataFormat: protocolDefinition.types.profile.dataFormats[0],
      },
    });

    toast.success("Saved your data", {
      style: {
        border: "1px solid #6366f1",
        padding: "8px 12px",
        color: "#6366f1",
        borderRadius: "1000px",
      },
      iconTheme: {
        primary: "#6366f1",
        secondary: "#FFFFFF",
      },
    });

    setTimeout(() => {
      router.push("/home");
    }, 500);
  };

  return (
    <main className="py-24 max-w-xl mx-auto px-4">
      <div className="w-full bg-white rounded-md shadow-sm">
        <div className="w-full bg-indigo-500 p-4 rounded-t-md text-white">
          <h2>Welcome to Jornova</h2>
        </div>
        {question ? (
          <div className="p-4">
            <p className="mb-3">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((i) => (
                <Button
                  onClick={() => answer(i)}
                  key={i}
                  className="block"
                  variant={
                    profile.goal === i ||
                    profile.age === i ||
                    profile.gender === i ||
                    profile.relationship === i ||
                    profile.religion === i ||
                    profile.support === i
                      ? "default"
                      : "outline"
                  }
                >
                  {i}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="mb-4">Do you want to save this data?</p>
            <div className="flex items-center gap-2">
              <Button onClick={() => save()}>Save</Button>
              <Button onClick={() => startOver()} variant="secondary">
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
