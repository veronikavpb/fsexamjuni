import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@components/header";
import CreateExperienceForm from "@components/experiences/CreateExperienceForm";
import { Experience, LoggedInUser } from "@types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ExperienceService from "@services/ExperienceService";

const Experiences: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [error, setError] = useState<string>();
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("loggedInUser");
    if (stored) setLoggedInUser(JSON.parse(stored));
  }, []);

  const fetchAll = async () => {
    setError("");
    setLoading(true);
    const resp = await ExperienceService.getAllExperiences();
    if (!resp.ok) {
      setError("Failed to load experiences");
    } else {
      setExperiences(await resp.json());
    }
    setLoading(false);
  };

  const fetchMine = async () => {
    if (!loggedInUser) return;
    setError("");
    setLoading(true);
    const resp = await ExperienceService.getExperiencesByOrganiser(
      loggedInUser.id
    );
    if (!resp.ok) {
      setError("Failed to load your experiences");
    } else {
      setExperiences(await resp.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loggedInUser) {
      if (showOnlyMine && loggedInUser.role === "ORGANISER") {
        fetchMine();
      } else {
        fetchAll();
      }
    }
  }, [loggedInUser, showOnlyMine]);

  if (!loggedInUser) {
    return (
      <>
        <Header />
        <main className="p-6 text-center">
          <p>
            You need to{" "}
            <Link href="/login" className="text-blue-600">
              login
            </Link>{" "}
            to view experiences.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Experiences</title>
      </Head>
      <Header />
      <main className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Travel Experiences</h1>

        {loggedInUser.role === "ORGANISER" && (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setShowOnlyMine((v) => !v)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded"
            >
              {showOnlyMine ? "Show All Experiences" : "Show Only Mine"}
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded"
            >
              Create New Experience
            </button>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">
          {showOnlyMine && loggedInUser.role === "ORGANISER"
            ? `My Experiences (${experiences.length})`
            : `Available Experiences (${experiences.length})`}
        </h2>

        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <p className="text-red-800">{error}</p>
        ) : experiences.length ? (
          <div className="grid gap-4 w-full max-w-3xl">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-4 border rounded-lg">
                <h3 className="font-bold text-lg">{exp.name}</h3>
                <p className="text-gray-600 mb-2">{exp.description}</p>
                <p className="text-sm mb-1">📍 {exp.location}</p>
                <p className="text-sm mb-1">
                  📅 {new Date(exp.date).toLocaleString()}
                </p>
                <p className="text-sm">
                  👤 Organiser: {exp.organiser.firstName}{" "}
                  {exp.organiser.lastName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No experiences found.</p>
        )}

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <CreateExperienceForm
              user={loggedInUser}
              onSuccess={() => {
                setShowCreateForm(false);
                fetchAll();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}
      </main>
    </>
  );
};

export const getServerSideProps = async ({ locale }: { locale: any }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

export default Experiences;
