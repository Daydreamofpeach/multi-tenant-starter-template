"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";

export function PageClient() {
  const router = useRouter();
  const { user, teams, selectedTeam, setSelectedTeam, loading } = useAuth();
  const [teamDisplayName, setTeamDisplayName] = React.useState("");

  React.useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0]);
    }
  }, [teams, selectedTeam, setSelectedTeam]);

  // Handle navigation in useEffect to avoid setState during render
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [loading, user, router]);

  // Handle team navigation
  React.useEffect(() => {
    if (!loading && user && selectedTeam) {
      router.push(`/dashboard/${selectedTeam.id}`);
    }
  }, [loading, user, selectedTeam, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Redirecting to sign in...</div>;
  }

  if (selectedTeam) {
    return <div>Redirecting to team dashboard...</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="max-w-xs w-full">
          <h1 className="text-center text-2xl font-semibold">Welcome!</h1>
          <p className="text-center text-gray-500">
            Create a team to get started
          </p>
          <form
            className="mt-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch('/api/teams', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ displayName: teamDisplayName }),
                });

                if (response.ok) {
                  const data = await response.json();
                  setSelectedTeam(data.team);
                  router.push(`/dashboard/${data.team.id}`);
                } else {
                  alert('Failed to create team');
                }
              } catch (error) {
                console.error('Create team error:', error);
                alert('Failed to create team');
              }
            }}
          >
            <div>
              <Label className="text-sm">Team name</Label>
              <Input
                placeholder="Team name"
                value={teamDisplayName}
                onChange={(e) => setTeamDisplayName(e.target.value)}
              />
            </div>
            <Button className="mt-4 w-full">Create team</Button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
