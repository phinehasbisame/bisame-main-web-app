import React from "react";
import PhoneInput from "react-phone-number-input";

interface PhoneNumberInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  disabled,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-2 text-blue-600">
      Phone number
    </label>
    <PhoneInput
      defaultCountry="GH"
      countries={["GH"]}
      international
      countryCallingCodeEditable={false}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="rounded-lg px-3 py-2 text-sm font-semibold border focus:outline-none w-full outline-none text-blue-600"
      placeholder="Enter phone number"
    />
  </div>
);

export default PhoneNumberInput;
