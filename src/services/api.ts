import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ResponseAllTicketAssignee, ResponseDetailTicket, ResponseFetchAllNotif, ResponseTicketByUser } from "@/types/ticket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api";

export const fetchAllTickets = async (): Promise<ResponseAllTicketAssignee> => {
  const res = await axios.get<ResponseAllTicketAssignee>(`${API_BASE}/tickets`);
  return res.data;
};

export const useTickets = () => {
  return useQuery<ResponseAllTicketAssignee, Error>({
    queryKey: ["useTickets"],
    queryFn: fetchAllTickets,
    staleTime: 1000 * 60, // 1 min cache
  });
};

export const fetchAllTicketByUserId = async (userId: string): Promise<ResponseTicketByUser> => {
  const res = await axios.get<ResponseTicketByUser>(`${API_BASE}/tickets/user`, {params: {userId},});
  return res.data;
}
export const useTicketsUser = (userId: string) => {
  return useQuery<ResponseTicketByUser, Error>({
    queryKey: ["useTicketsUser", userId],
    queryFn: () => fetchAllTicketByUserId(userId),
    staleTime: 1000 * 60
  });
};


export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketData: any) => {
      const res = await axios.post(`${API_BASE}/tickets`, ticketData);

      await sendNotification(ticketData.assigneeId, res.data.title)
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useTicketsUser"] });
      queryClient.invalidateQueries({ queryKey: ["useTickets"] });
      queryClient.invalidateQueries({queryKey: ["useNotification"]});
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & any) => {
      const res = await axios.put(`${API_BASE}/tickets/${id}`, payload);
      if(payload.assigneeId !== res.data.beforeUpdateAssigneeId) {
        await sendNotification(payload.assigneeId, res.data.title);
      };
      return res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["useTicketsUser"] });
      queryClient.invalidateQueries({ queryKey: ["useTickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      queryClient.invalidateQueries({queryKey: ["useNotification"]});
    },
  });
};

const sendNotification = async (assigneeId: string, title?: string) => {
  if (assigneeId != null) {
    await axios.post(`${API_BASE}/profiles/notification`, {
      message: `You are assigned to new ticket: ${title ?? "Untitled"}`,
      assigneeId: assigneeId,
    });
  }
};


export const useTicketId = (id: string) => {
  return useQuery<ResponseDetailTicket, Error>({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/tickets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

//api
export const fetchProfiles = async (): Promise<{ id: string; name: string; avatar?: string }[]> => {
  const res = await axios.get(`${API_BASE}/profiles`);
  return res.data;
};

//use
export const useProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & any) =>
      axios.put(`${API_BASE}/profiles/${id}`, payload),
    onSuccess: (response) => {
      updateUser(response.data);
    },
  });
};

export const useUpdatePassword = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  return useMutation({
    mutationFn: ({id, ...payload}: {id: string} & any) =>
      axios.put(`${API_BASE}/profiles/password/${id}`, payload),
    onSuccess: async () => {
      await signOut();
      
      navigate('/auth', {replace: true});
      toast({
        title: "Password changed",
        description: "Please log in again with your new password.",
      });
    }
  })
}

export const useComment = (id: string, userId: string) => {
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/tickets/${id}/comments`);
      return res.data;
    },
  });

  const addComment = useMutation({
    mutationFn: async (newComment: { content: string; authorId: string }) => {
      const res = await axios.post(
        `${API_BASE}/tickets/${id}/comments`,
        newComment
      );
      return res.data;
    },
    onSuccess: () => {
      // auto-refresh after submit
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  return { comments, isLoading, addComment };
}

export function useNotificationPreference(userId: string, isNotification: boolean) {
  const [enabled, setEnabled] = useState<boolean>(isNotification);

  useEffect(() => {
    setEnabled(isNotification);
  }, [isNotification]);

  const mutation = useMutation({
    mutationFn: async (value: boolean) => {
      return axios.put(`${API_BASE}/profiles/notifications/${userId}`, {enabled: value});
    },
    onSuccess: () => {
      console.log("==SOON BANNER SUCCESS==");
    },
    onError: (error) => {
      setEnabled((prev) => !prev);
      console.error("==SOON BANNER ERROR", error);
    },
  });

  const toggle = (checked: boolean) => {
    setEnabled(checked);
    mutation.mutate(checked);
  };

  return {enabled, toggle, isLoading: mutation.isPending, isError: mutation.isError,};
}

export const fetchNotifications = async (userId: string): Promise<ResponseFetchAllNotif> => {
  const res = await axios.get<ResponseFetchAllNotif>(`${API_BASE}/profiles/notification`, {params: {userId}});
  return res.data;
};

export const useNotification = (userId: string) => {
  return useQuery<ResponseFetchAllNotif, Error>({
    queryKey: ["useNotification", userId],
    queryFn: () => fetchNotifications(userId),
    staleTime: 1000 * 60, // 1 min cache
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({isRead, notifyId} : {isRead: boolean; notifyId: number}) =>
      axios.put(`${API_BASE}/profiles/notification/${notifyId}`, null, {params: {isRead}}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["useNotification"]});
    },
  });
};