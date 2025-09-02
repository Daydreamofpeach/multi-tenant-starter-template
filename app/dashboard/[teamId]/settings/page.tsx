'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Users, 
  Edit, 
  Trash2, 
  Plus, 
  Building2, 
  UserPlus,
  Crown,
  Shield,
  User
} from 'lucide-react';

interface Team {
  id: string;
  displayName: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
}

export default function SettingsPage() {
  const params = useParams<{ teamId: string }>();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    slug: ''
  });
  const [memberFormData, setMemberFormData] = useState({
    email: '',
    role: 'member'
  });

  const fetchTeamData = async () => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}`);
      if (response.ok) {
        const data = await response.json();
        setTeam(data.team);
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [params.teamId]);

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/teams/${params.teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTeamData();
        setShowEditForm(false);
      } else {
        alert('Failed to update team');
      }
    } catch (error) {
      console.error('Failed to update team:', error);
      alert('Failed to update team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone and will delete all associated data.')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${params.teamId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to delete team');
      }
    } catch (error) {
      console.error('Failed to delete team:', error);
      alert('Failed to delete team');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, we need to find the user by email
      // For now, we'll use a simple approach - in a real app, you'd have a user lookup API
      const response = await fetch(`/api/teams/${params.teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: memberFormData.email,
          role: memberFormData.role
        }),
      });

      if (response.ok) {
        await fetchTeamData();
        setShowAddMemberForm(false);
        setMemberFormData({ email: '', role: 'member' });
      } else {
        alert('Failed to add member');
      }
    } catch (error) {
      console.error('Failed to add member:', error);
      alert('Failed to add member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${params.teamId}/members?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTeamData();
      } else {
        alert('Failed to remove member');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert('Failed to remove member');
    }
  };

  const handleUpdateMemberRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/teams/${params.teamId}/members`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: newRole
        }),
      });

      if (response.ok) {
        await fetchTeamData();
      } else {
        alert('Failed to update member role');
      }
    } catch (error) {
      console.error('Failed to update member role:', error);
      alert('Failed to update member role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  if (!team) {
    return <div className="p-6">Team not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Team Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Team Information
              </CardTitle>
              <CardDescription>
                Manage your team's basic information
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setFormData({
                  displayName: team.displayName,
                  slug: team.slug
                });
                setShowEditForm(true);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Team Name</Label>
            <p className="text-lg">{team.displayName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Slug</Label>
            <p className="text-sm text-gray-600">{team.slug}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Created</Label>
            <p className="text-sm text-gray-600">
              {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage team members and their roles
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddMemberForm(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">{member.user.displayName}</p>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getRoleColor(member.role)}>
                    {getRoleIcon(member.role)}
                    <span className="ml-1 capitalize">{member.role}</span>
                  </Badge>
                  {member.role !== 'owner' && (
                    <div className="flex gap-2">
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateMemberRole(member.userId, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveMember(member.userId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-800">Delete Team</h4>
              <p className="text-sm text-red-600">
                Permanently delete this team and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Team
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Team Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Team</CardTitle>
              <CardDescription>
                Update your team's information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateTeam} className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Team Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Update Team</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowEditForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Team Member</CardTitle>
              <CardDescription>
                Invite a new member to your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={memberFormData.email}
                    onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                    required
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={memberFormData.role}
                    onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Member</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddMemberForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
