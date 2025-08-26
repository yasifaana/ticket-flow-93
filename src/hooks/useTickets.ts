import { useState } from 'react';
import { tickets } from '@/data/mockData';

export const useTickets = () => {
  return {
    data: tickets,
    isLoading: false,
  };
};

export const useCreateTicket = () => {
  return {
    mutate: (data: any) => {
      console.log('Creating ticket:', data);
    },
    mutateAsync: async (data: any) => {
      console.log('Creating ticket:', data);
      return Promise.resolve();
    },
    isPending: false,
  };
};

export const useAddComment = () => {
  return {
    mutate: (data: any) => {
      console.log('Adding comment:', data);
    },
    mutateAsync: async (data: any) => {
      console.log('Adding comment:', data);
      return Promise.resolve();
    },
    isPending: false,
  };
};