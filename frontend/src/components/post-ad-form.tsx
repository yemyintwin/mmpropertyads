"use client";

import { type FormEvent, useRef, useState } from "react";
import { submitJson } from "@/lib/api";

const steps = [
  "Property",
  "Location",
  "Photos",
  "Description & price",
  "Contact",
  "Review",
];

export function PostAdForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setFailed(false);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const result = await submitJson("/api/my/listings", payload);
    setPending(false);
    setFailed(!result.ok);
    setMessage(result.ok ? "Draft saved." : result.message);
  }

  function nextStep() {
    const activeStep = formRef.current?.querySelector(
      `[data-step="${step}"]`,
    );
    if (!(activeStep instanceof HTMLFieldSetElement)) return;
    if (!activeStep.reportValidity()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} ref={formRef}>
      <ol aria-label="Ad creation progress" className="step-list">
        {steps.map((label, index) => (
          <li aria-current={index === step ? "step" : undefined} key={label}>
            <button
              onClick={() => index < step && setStep(index)}
              type="button"
              disabled={index >= step}
            >
              {index + 1}. {label}
            </button>
          </li>
        ))}
      </ol>
      <fieldset data-step={0} hidden={step !== 0}>
        <legend>Property details</legend>
        <div className="form-section">
          <label className="field">
            Listing type
            <select name="listingType" required>
              <option value="ForSale">For sale</option>
              <option value="ForRent">For rent</option>
            </select>
          </label>
          <label className="field">
            Property type
            <select name="propertyType" required>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
            </select>
          </label>
          <label className="field">
            Bedrooms
            <input min="0" name="bedrooms" type="number" />
          </label>
          <label className="field">
            Bathrooms
            <input min="0" name="bathrooms" type="number" />
          </label>
          <label className="field">
            Floor area (sq ft)
            <input min="0" name="floorArea" type="number" />
          </label>
        </div>
      </fieldset>
      <fieldset data-step={1} hidden={step !== 1}>
        <legend>Location</legend>
        <div className="form-section">
          <label className="field">
            Area or neighbourhood
            <input autoComplete="address-level2" name="area" required />
          </label>
          <label className="field">
            Address
            <input autoComplete="street-address" name="address" />
          </label>
          <label className="check-field wide">
            <input name="hideExactAddress" type="checkbox" value="true" />
            Show area only; hide the exact address
          </label>
        </div>
      </fieldset>
      <fieldset data-step={2} hidden={step !== 2}>
        <legend>Photos</legend>
        <p>Photo upload will be enabled when the SAS upload API is available.</p>
        <label className="field">
          Property photos
          <input accept="image/*" disabled multiple type="file" />
        </label>
      </fieldset>
      <fieldset data-step={3} hidden={step !== 3}>
        <legend>Description and price</legend>
        <div className="form-section">
          <label className="field wide">
            Listing title
            <input maxLength={100} minLength={10} name="title" required />
          </label>
          <label className="field">
            Price
            <input min="1" name="price" required type="number" />
          </label>
          <label className="field">
            Rent period
            <select name="pricePeriod">
              <option value="">Not applicable</option>
              <option value="Monthly">Per month</option>
              <option value="Weekly">Per week</option>
            </select>
          </label>
          <label className="field wide">
            Description
            <textarea maxLength={5000} minLength={50} name="description" required />
          </label>
        </div>
      </fieldset>
      <fieldset data-step={4} hidden={step !== 4}>
        <legend>Contact details</legend>
        <div className="form-section">
          <label className="field">
            Display name
            <input autoComplete="name" name="contactName" required />
          </label>
          <label className="field">
            Phone (optional)
            <input autoComplete="tel" name="phone" type="tel" />
          </label>
          <label className="field wide">
            Preferred contact
            <select name="contactPreference" required>
              <option value="Enquiry">Enquiry form</option>
              <option value="Phone">Phone</option>
              <option value="Both">Both</option>
            </select>
          </label>
        </div>
      </fieldset>
      <fieldset data-step={5} hidden={step !== 5}>
        <legend>Review and submit</legend>
        <p>Review the details above before saving the ad as a draft.</p>
        <label className="check-field">
          <input name="termsAccepted" required type="checkbox" value="true" />
          I agree to the terms of use
        </label>
      </fieldset>
      <div className="step-actions">
        {step > 0 && (
          <button className="button button-light" onClick={() => setStep(step - 1)} type="button">
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button className="button button-primary" onClick={nextStep} type="button">
            Continue
          </button>
        ) : (
          <button className="button button-primary" disabled={pending} type="submit">
            {pending ? "Saving…" : "Save draft"}
          </button>
        )}
      </div>
      {message && (
        <p aria-live="polite" className={failed ? "notice notice-error" : "notice"}>
          {message}
        </p>
      )}
    </form>
  );
}
