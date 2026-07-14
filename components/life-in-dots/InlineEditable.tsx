import React, { useState, useEffect, useRef } from "react";
import { IconPencil } from "@tabler/icons-react";

interface InlineEditableProps {
  value: string;
  type: "text" | "date" | "number";
  label: string;
  min?: number;
  max?: number;
  onSave: (newValue: string) => boolean | void;
  validate?: (value: string) => string | null;
}

export default function InlineEditable({
  value,
  type,
  label,
  min,
  max,
  onSave,
  validate,
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type !== "date") {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    
    // Validations
    if (type === "date" && !trimmed) {
      setError("Date is required");
      return;
    }
    
    if (validate) {
      const errMsg = validate(trimmed);
      if (errMsg) {
        setError(errMsg);
        return;
      }
    }
    
    if (type === "number" && trimmed) {
      const num = Number(trimmed);
      if (isNaN(num)) {
        setError("Must be a valid number");
        return;
      }
      if (min !== undefined && num < min) {
        setError(`Min value is ${min}`);
        return;
      }
      if (max !== undefined && num > max) {
        setError(`Max value is ${max}`);
        return;
      }
    }

    const success = onSave(trimmed);
    if (success !== false) {
      setIsEditing(false);
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
      setError(null);
    }
  };

  if (isEditing) {
    return (
      <span className="inline-flex flex-col items-start relative z-10">
        <span className="flex items-center gap-2">
          <input
            ref={inputRef}
            type={type}
            value={editValue}
            min={min}
            max={max}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            aria-label={label}
            className="bg-[#111111] border border-[#2CFF05] text-[#EAEAEA] font-jetbrains text-[0.95em] px-2 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-[#2CFF05] min-w-[120px]"
          />
        </span>
        {error ? (
          <span className="absolute top-full left-0 mt-1 text-[11px] font-jetbrains text-red-500 bg-black/90 px-2 py-0.5 rounded border border-red-500/30 z-20">
            {error}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStartEdit}
      className="group inline-flex items-baseline gap-1 cursor-pointer transition-colors duration-150 border-b border-dashed border-[#2CFF05]/40 hover:border-[#2CFF05] hover:text-[#2CFF05] focus:outline-none focus:ring-2 focus:ring-[#2CFF05]/50 focus:rounded px-1 -mx-1"
      aria-label={`${label}: ${value}. Click to edit.`}
    >
      <span className="font-semibold text-[#EAEAEA] group-hover:text-[#2CFF05] transition-colors">
        {value || "[Empty]"}
      </span>
      <IconPencil
        size={11}
        className="text-[#7F7F7F] group-hover:text-[#2CFF05] opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}
