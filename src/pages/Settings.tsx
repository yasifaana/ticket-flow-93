import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { EditProfileDialog } from "@/components/tickets/edit-profile-dialog";
import { ChangePasswordDialog } from "@/components/tickets/change-password-dialog";
import { useNotificationPreference } from "@/services/api";

export default function Settings() {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const {enabled, toggle, isLoading} = useNotificationPreference(user.id, user.isNotification);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" className="mr-1" onClick={() => setIsEditOpen(true)}>Edit Profile</Button>
            <Button variant="outline" size="sm" className="m-1" onClick={() => setIsChangePasswordOpen(true)}>Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div className="flex items-center justify-between">
              <Label>Email notifications</Label>
              <Switch defaultChecked />
            </div> */}
            <div className="flex items-center justify-between">
              <Label>Push notifications</Label>
              <Switch checked={enabled} onCheckedChange={toggle} disabled={isLoading}/>
            </div>
            {/* <div className="flex items-center justify-between">
              <Label>Ticket assignments</Label>
              <Switch defaultChecked />
            </div> */}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Dark mode</Label>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Button variant="outline" size="sm">System default</Button>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" size="sm">Change Password</Button>
            <Button variant="outline" size="sm">Two-Factor Authentication</Button>
            <Button variant="outline" size="sm">Active Sessions</Button>
          </CardContent>
        </Card> */}
      </div>
      {user && (<EditProfileDialog open={isEditOpen} onOpenChange={setIsEditOpen} data={user} />)}
      {user && (<ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} userId={user.id}/>)}
    </div>
  );
}