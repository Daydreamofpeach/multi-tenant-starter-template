'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TeamSwitcherProps {
  selectedTeam: { id: string; displayName: string; slug: string };
  urlMap?: (team: { id: string; displayName: string; slug: string }) => string;
}

export function TeamSwitcher({ selectedTeam, urlMap }: TeamSwitcherProps) {
  const { teams, setSelectedTeam } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTeamSelect = (team: { id: string; displayName: string; slug: string }) => {
    setSelectedTeam(team);
    if (urlMap) {
      router.push(urlMap(team));
    }
  };

  const handleCreateTeam = async () => {
    setLoading(true);
    try {
      const teamName = prompt('Enter team name:');
      if (!teamName) return;

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: teamName }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedTeam(data.team);
        if (urlMap) {
          router.push(urlMap(data.team));
        }
      } else {
        alert('Failed to create team');
      }
    } catch (error) {
      console.error('Create team error:', error);
      alert('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">{selectedTeam.displayName}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Teams</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {teams.map((team) => (
          <DropdownMenuItem
            key={team.id}
            onClick={() => handleTeamSelect(team)}
            className={selectedTeam.id === team.id ? 'bg-accent' : ''}
          >
            {team.displayName}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreateTeam} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          <span>{loading ? 'Creating...' : 'Create Team'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
