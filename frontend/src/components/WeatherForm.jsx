import { useState } from "react";
import AdviceLanguageSelect from "./AdviceLanguageSelect";

const initial = {
  village: "",
  city: "",
  district: "",
  crop: "",
  stage: "",
  language: "English",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";

const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600";

function WeatherForm({ onSubmit, busy = false }) {
  const [formData, setFormData] = useState(initial);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-5">
      <fieldset className="min-w-0 space-y-3">
        <legend className={`${labelClass} mb-2`}>Location</legend>
        <p className="text-xs text-slate-500">
          Enter at least one: village, city, or district (we use it to fetch weather).
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="wf-village" className={labelClass}>
              Village
            </label>
            <input
              id="wf-village"
              name="village"
              value={formData.village}
              placeholder="e.g. Rampur"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="wf-city" className={labelClass}>
              City
            </label>
            <input
              id="wf-city"
              name="city"
              value={formData.city}
              placeholder="e.g. Pune"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="wf-district" className={labelClass}>
              District
            </label>
            <input
              id="wf-district"
              name="district"
              value={formData.district}
              placeholder="e.g. Nashik"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
        <div>
          <label htmlFor="wf-crop" className={labelClass}>
            Crop
          </label>
          <input
            id="wf-crop"
            name="crop"
            value={formData.crop}
            placeholder="e.g. wheat, cotton, tomato"
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="wf-stage" className={labelClass}>
            Growth stage
          </label>
          <select
            id="wf-stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select stage</option>
            <option value="seedling">Seedling</option>
            <option value="vegetative">Vegetative</option>
            <option value="flowering">Flowering</option>
            <option value="harvest">Harvest</option>
          </select>
        </div>
      </div>

      <AdviceLanguageSelect
        id="wf-language"
        name="language"
        value={formData.language}
        onChange={handleChange}
        labelClassName={labelClass}
        selectClassName={`${inputClass} font-sans`}
      />

      <button
        type="submit"
        disabled={busy}
        className="mt-1 w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Analyzing weather…" : "Get weather risk analysis"}
      </button>
    </form>
  );
}

export default WeatherForm;
