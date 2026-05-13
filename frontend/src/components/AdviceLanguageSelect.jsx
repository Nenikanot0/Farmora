import { INDIAN_ADVICE_LANGUAGES } from "../utils/constants";

/**
 * Same language list as weather advice; values are sent to `/crop/analyze` as `language`
 * for Gemini (see `geminiService.js`).
 */
function AdviceLanguageSelect({
  id,
  name = "language",
  value,
  onChange,
  label = "Advice language (all official Indian languages + English)",
  labelClassName,
  selectClassName,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClassName}
      >
        {INDIAN_ADVICE_LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AdviceLanguageSelect;
