"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useMutation } from "@tanstack/react-query";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RevoraButton from "@/components/ui/RevoraButton";
import { submitCar } from "@/lib/api/cars";
import { ApiError } from "@/lib/api/client";

const steps = ["Identity", "Powertrain", "Performance"];

const initial = {
  brand: "",
  model: "",
  generation: "",
  year: 2024,
  trim: "",
  bodyType: "Sedan",
  engine: "",
  displacement: 3,
  fuelType: "Petrol",
  transmission: "Automatic",
  driveType: "RWD",
  horsepower: 400,
  torque: 500,
  zeroToHundred: 4.5,
  topSpeed: 250,
  weight: 1600,
  description: "",
  images: "",
};

function AddCarForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      submitCar({
        ...form,
        year: Number(form.year),
        displacement: Number(form.displacement),
        horsepower: Number(form.horsepower),
        torque: Number(form.torque),
        zeroToHundred: Number(form.zeroToHundred),
        topSpeed: Number(form.topSpeed),
        weight: Number(form.weight),
        images: form.images
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    onSuccess: () => setDone(true),
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: e.target.value }));

  if (done) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h3" sx={{ mb: 2 }}>Submitted</Typography>
        <Typography color="text.secondary">
          This car is pending review. It will appear in the catalog after an admin approves it.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>Add a car</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Submissions stay private until REVORA review.
      </Typography>
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      {mutation.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {mutation.error instanceof ApiError ? mutation.error.message : "Could not submit this car."}
        </Alert>
      ) : null}
      <Box sx={{ display: "grid", gap: 2 }}>
        {step === 0 ? (
          <>
            <TextField label="Brand" value={form.brand} onChange={set("brand")} required />
            <TextField label="Model" value={form.model} onChange={set("model")} required />
            <TextField label="Generation" value={form.generation} onChange={set("generation")} required />
            <TextField label="Trim" value={form.trim} onChange={set("trim")} required />
            <TextField label="Year" type="number" value={form.year} onChange={set("year")} />
            <TextField select label="Body type" value={form.bodyType} onChange={set("bodyType")}>
              {["Sedan", "Coupe", "Hatchback", "Wagon", "SUV", "Convertible", "Pickup", "Roadster"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <TextField label="Engine" value={form.engine} onChange={set("engine")} required />
            <TextField label="Displacement (L)" type="number" value={form.displacement} onChange={set("displacement")} />
            <TextField select label="Fuel" value={form.fuelType} onChange={set("fuelType")}>
              {["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Transmission" value={form.transmission} onChange={set("transmission")}>
              {["Manual", "Automatic", "DCT", "CVT", "Single-Speed"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
            <TextField select label="Drive" value={form.driveType} onChange={set("driveType")}>
              {["RWD", "FWD", "AWD", "4WD"].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <TextField label="Horsepower" type="number" value={form.horsepower} onChange={set("horsepower")} />
            <TextField label="Torque (Nm)" type="number" value={form.torque} onChange={set("torque")} />
            <TextField label="0–100 (s)" type="number" value={form.zeroToHundred} onChange={set("zeroToHundred")} />
            <TextField label="Top speed (km/h)" type="number" value={form.topSpeed} onChange={set("topSpeed")} />
            <TextField label="Weight (kg)" type="number" value={form.weight} onChange={set("weight")} />
            <TextField label="Description" value={form.description} onChange={set("description")} multiline minRows={3} />
            <TextField label="Image URLs (one per line, https only)" value={form.images} onChange={set("images")} multiline minRows={3} />
          </>
        ) : null}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <RevoraButton disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Back</RevoraButton>
          {step < 2 ? (
            <RevoraButton variant="contained" onClick={() => setStep((value) => value + 1)}>Next</RevoraButton>
          ) : (
            <RevoraButton variant="contained" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
              Submit for review
            </RevoraButton>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default function AddCarPage() {
  return (
    <ProtectedRoute>
      <AddCarForm />
    </ProtectedRoute>
  );
}
