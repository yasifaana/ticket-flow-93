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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangePassword, User } from "@/types/ticket";
import { useCreateTicket, useProfiles, useUpdatePassword, useUpdateProfile } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
    previousPassword: z.string().min(8, "Previous Password required").max(100),
    newPassword: z.string().min(8, "New Password required").max(100)
})

type FormData = z.infer<typeof formSchema>;

interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

export function ChangePasswordDialog({open, onOpenChange, userId}: ChangePasswordDialogProps) {
    const updatePasswordMutation = useUpdatePassword();
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    // useEffect(() => {
    //     if (open) {
    //         form.reset({
    //             previousPassword: data.name,
    //             email: data.email,
    //             avatarUrl: data.avatar,
    //         });
    //     }
    // }, [open, data, form]);

    const onSubmit = async (values: FormData) => {
        await updatePasswordMutation.mutateAsync({
            id: userId,
            previousPassword: values.previousPassword,
            newPassword: values.newPassword,
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
                  name="previousPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter previous password..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter new password..." {...field} />
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