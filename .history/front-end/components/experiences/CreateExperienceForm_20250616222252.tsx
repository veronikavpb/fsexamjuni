import React, { useState } from "react";
import { StatusMessage, Experience, LoggedInUser } from "@types";
import ExperienceService from "@services/ExperienceService";

type Props = {
  user: LoggedInUser;
  onSuccess: (created: Experience) => void;
  onCancel: () => void;
};

const CreateExperienceForm: React.FC<Props> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();

  const clearErrors = () => {
    setStatusMessage(undefined);
  };

  const validate = (): boolean => {
    if (!name.trim()) {
      setStatusMessage({ message: "Name is required", type: "error" });
      return false;
    }
    if (!description.trim()) {
      setStatusMessage({ message: "Description is required", type: "error" });
      return false;
    }
    if (!date) {
      setStatusMessage({ message: "Date is required", type: "error" });
      return false;
    }
    if (new Date(date) <= new Date()) {
      setStatusMessage({
        message: "Date must be in the future",
        type: "error",
      });
      return false;
    }
    if (!location.trim()) {
      setStatusMessage({ message: "Location is required", type: "error" });
      return false;
    }
    clearErrors();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dto = {
      name,
      description,
      date,
      location,
      organiserId: user.id,
    };

    try {
      const resp = await ExperienceService.createExperience(dto);
      if (resp.ok) {
        const created: Experience = await resp.json();
        setStatusMessage({ message: "Experience created!", type: "success" });
        onSuccess(created);

        setName("");
        setDescription("");
        setDate("");
        setLocation("");
      } else {
        const err = await resp.json();
        setStatusMessage({
          message: err.message || "Creation failed",
          type: "error",
        });
      }
    } catch {
      setStatusMessage({ message: "Network error", type: "error" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Experience</h2>

      {statusMessage && (
        <div
          className={`mb-4 p-3 rounded ${
            statusMessage.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Experience Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter experience name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the experience"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date *
          </label>
          <input
            id="date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location *
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter location"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-4 py-2"
          >
            Create Experience
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExperienceForm;
