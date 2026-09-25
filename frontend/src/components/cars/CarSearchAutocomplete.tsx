"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { fetchCarSuggestions, type CarSuggestion } from "@/lib/api/cars";
import { revoraColors } from "@/theme/colors";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  sx?: object;
};

export default function CarSearchAutocomplete({
  value,
  onChange,
  onSubmit,
  placeholder = "Search brand, model, trim…",
  sx,
}: Props) {
  const router = useRouter();
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value.trim()), 280);
    return () => window.clearTimeout(timer);
  }, [value]);

  const { data, isFetching } = useQuery({
    queryKey: ["car-suggestions", debounced],
    queryFn: () => fetchCarSuggestions(debounced, 12),
    enabled: debounced.length >= 2,
    staleTime: 30_000,
  });

  const options = useMemo(() => data?.suggestions ?? [], [data?.suggestions]);

  const handleSelect = (option: CarSuggestion | string | null) => {
    if (!option || typeof option === "string") {
      return;
    }

    if (option.type === "car" && option.slug) {
      router.push(`/cars/${option.slug}`);
      return;
    }

    onChange(option.searchValue);
    onSubmit?.();
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={isFetching && debounced.length >= 2}
      inputValue={value}
      onInputChange={(_, next, reason) => {
        if (reason === "input" || reason === "clear") {
          onChange(next);
        }
      }}
      onChange={(_, option) => handleSelect(option)}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
      isOptionEqualToValue={(a, b) =>
        typeof a !== "string" && typeof b !== "string" && a.label === b.label && a.type === b.type
      }
      filterOptions={(items) => items}
      noOptionsText={debounced.length < 2 ? "Type at least 2 characters" : "No matches"}
      groupBy={(option) => {
        if (typeof option === "string") return "";
        if (option.type === "brand") return "Brands";
        if (option.type === "model") return "Models";
        return "Cars";
      }}
      renderOption={(props, option) => {
        if (typeof option === "string") {
          return (
            <li {...props} key={option}>
              {option}
            </li>
          );
        }

        const { key, ...rest } = props;

        return (
          <Box
            component="li"
            key={key}
            {...rest}
            sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}
          >
            {option.image ? (
              <Box
                component="img"
                src={option.image}
                alt=""
                sx={{
                  width: 44,
                  height: 32,
                  objectFit: "cover",
                  borderRadius: 0.5,
                  bgcolor: revoraColors.paper,
                  flexShrink: 0,
                }}
              />
            ) : null}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap>
                {option.label}
              </Typography>
              {option.sublabel ? (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {option.sublabel}
                </Typography>
              ) : null}
            </Box>
            <Chip
              size="small"
              label={option.type}
              sx={{ ml: "auto", textTransform: "capitalize", flexShrink: 0 }}
            />
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit?.();
            }
          }}
        />
      )}
      sx={sx}
    />
  );
}
