import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { TicketPriority, User } from "@/types/ticket";
import { users } from "@/data/mockData";
import { useCreateTicket, useProfiles, useUpdateProfile } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    avatarUrl: z.string().optional()
})

type FormData = z.infer<typeof formSchema>;

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: User;
}

export function EditProfileDialog({open, onOpenChange, data}: EditProfileDialogProps) {
    const updateProfileMutation = useUpdateProfile();
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: data.name,
            email: data.email,
            avatarUrl: data.avatar
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: data.name,
                email: data.email,
                avatarUrl: data.avatar,
            });
        }
    }, [open, data, form]);

    const onSubmit = async (values: FormData) => {
        await updateProfileMutation.mutateAsync({
            id: data.id,
            name: values.name,
            email: values.email,
            avatarUrl: values.avatarUrl,
        });

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
    
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Fullname..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter valid email..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
    
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      );
}