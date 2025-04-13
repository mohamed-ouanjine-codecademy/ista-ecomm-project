// frontend/src/components/ReviewDistributionChart.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTranslation } from 'react-i18next';

const ReviewDistributionChart = ({ reviews = [] }) => {
  const { t } = useTranslation();

  // Build a distribution array for ratings 1 through 5.
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating: rating.toString(),
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('reviewDistribution')}
      </Typography>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={distribution} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" label={{ value: t('rating'), position: 'insideBottom', offset: -5 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ReviewDistributionChart;
