import Head from "next/head";
import { useEffect, useState } from "react";
import Header from "@components/header";
import CreateExperienceForm from "@components/experiences/CreateExperienceForm";
import { Experience, LoggedInUser } from "@types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ExperienceService from "@services/ExperienceService";

const Experiences: React.FC = () => {
  const [error, setError] = useState<string>();
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>();
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  useEffect(() => {
    const loggedInUserString = sessionStorage.getItem("loggedInUser");
    if (loggedInUserString !== null) {
      setLoggedInUser(JSON.parse(loggedInUserString));
    }
  }, []);
  const getExperiences = async () => {
    setError("");

    const response = await ExperienceService.getAllExperiences();
    if (!response.ok) {
      if (response.status === 401) {
        setError(
          "You are not authorized to view this page. Please login first."
        );
      } else {
        setError(response.statusText);
      }
    } else {
      const experiencesData = await response.json();
      setExperiences(experiencesData);
    }
  };

  const getMyExperiences = async () => {
    if (!loggedInUser?.id) return;

    setError("");

    const response = await ExperienceService.getExperiencesByOrganiser(
      loggedInUser.id
    );
    if (!response.ok) {
      if (response.status === 401) {
        setError(
          "You are not authorized to view this page. Please login first."
        );
      } else {
        setError(response.statusText);
      }
    } else {
      const experiencesData = await response.json();
      setExperiences(experiencesData);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      getExperiences();
    }
  }, [loggedInUser]);
  return (
    <>
      {" "}
      <Head>
        <title>Experiences</title>
      </Head>
      <Header />{" "}
      <main className="p-6 min-h-screen flex flex-col items-center">
        <h1>Travel Experiences</h1>

        {/* Show login message for non-logged-in users */}
        {!loggedInUser && (
          <div className="mt-8 text-center max-w-md">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Login Required
              </h2>
              <p className="text-blue-700 mb-4">
                You need to be logged in to view travel experiences. Please log
                in to discover amazing experiences and events!
              </p>
              <a className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 inline-block">
                Go to Login
              </a>
            </div>
          </div>
        )}

        {/* Show content only for logged-in users */}
        <>
          {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <CreateExperienceForm
                  />
              </div> */}
          {loggedInUser && (
            <div className="mt-4 mb-4 flex gap-3">
              <button
                // onClick={}
                className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {showOnlyMine ? "Show All Experiences" : "Show Only Mine"}
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-green-700 hover:bg-green-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Create New Experience
              </button>
            </div>
          )}
          {/* Experience content */}
          <>
            {error && <div className="text-red-800">{error}</div>}
            {experiences && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4">
                  {"Available Experiences"} ()
                </h2>
                <div className="grid gap-4">
                  {[].map((experience) => (
                    <div
                      // key={}
                      className="p-4 border rounded-lg"
                    >
                      <h3 className="font-bold">{}</h3>
                      <p className="text-gray-600">{}</p>
                      <p className="text-sm">📍 {}</p>
                      <p className="text-sm">
                        📅 {new Date().toLocaleDateString()}
                      </p>
                      <p className="text-sm">👤 Organiser: {}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>{" "}
        </>
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Experiences;
