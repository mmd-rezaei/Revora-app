"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RevoraButton from "@/components/ui/RevoraButton";
import PageLoader from "@/components/ui/PageLoader";
import EmptyState from "@/components/ui/EmptyState";
import { approveCar, fetchPendingCars, rejectCar } from "@/lib/api/cars";
import { revoraColors } from "@/theme/colors";

function AdminContent() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["pending-cars"], queryFn: fetchPendingCars });
  const approveMutation = useMutation({
    mutationFn: approveCar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pending-cars"] }),
  });
  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectCar(id, "Does not meet REVORA catalog standards"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pending-cars"] }),
  });

  if (isLoading) return <PageLoader />;
  const pending = data?.items || [];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>Review queue</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Approve or reject user-submitted cars.</Typography>
      {pending.length === 0 ? (
        <EmptyState title="Queue is clear" body="No pending submissions right now." />
      ) : (
        pending.map((car) => (
          <Box key={car.id} sx={{ p: 3, mb: 2, border: `1px solid ${revoraColors.border}`, bgcolor: revoraColors.paper }}>
            <Chip label={car.status} size="small" sx={{ mb: 1 }} />
            <Typography variant="h5">{car.brandName} {car.modelName} {car.trim}</Typography>
            <Typography color="text.secondary">{car.year} · {car.horsepower} HP · {car.engine}</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <RevoraButton variant="contained" onClick={() => approveMutation.mutate(car.id)}>Approve</RevoraButton>
              <RevoraButton onClick={() => rejectMutation.mutate(car.id)}>Reject</RevoraButton>
            </Box>
          </Box>
        ))
      )}
    </Container>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute admin>
      <AdminContent />
    </ProtectedRoute>
  );
}
